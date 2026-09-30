import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { buildApplicationPdf } from './pdf.js';
import {
  sendPdfToTelegram,
  sendFileToTelegram,
  sendMessageToTelegram,
} from './telegram.js';
import { addGroup, listGroups, removeGroup, storeConfigured } from './chatStore.js';
import { handleTelegramUpdate } from './telegramWebhook.js';
import { webhookSecret } from './webhookSecret.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

/** "id1,id2" yoki bitta id */
function parseChatIds(raw) {
  return String(raw || '')
    .split(/[,;\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Botni guruhga qoʻsha oladiganlar: TELEGRAM_CHAT_ID dagi shaxsiy chatlar + TELEGRAM_ADMIN_IDS */
function adminIds() {
  const privateIds = parseChatIds(process.env.TELEGRAM_CHAT_ID).filter((id) => !id.startsWith('-'));
  return [...new Set([...privateIds, ...parseChatIds(process.env.TELEGRAM_ADMIN_IDS)])];
}

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '2mb' }));

  app.get('/api/health', async (_req, res) => {
    const chatIds = parseChatIds(process.env.TELEGRAM_CHAT_ID);
    let groupCount = null;
    if (storeConfigured()) {
      groupCount = await listGroups()
        .then((g) => g.length)
        .catch(() => null);
    }
    res.json({
      ok: true,
      telegramConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN && chatIds.length),
      chatCount: chatIds.length,
      groupStore: storeConfigured(),
      groupCount,
    });
  });

  app.post('/api/telegram/webhook', async (req, res) => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken || req.get('X-Telegram-Bot-Api-Secret-Token') !== webhookSecret(botToken)) {
      res.status(401).end();
      return;
    }
    try {
      await handleTelegramUpdate(req.body || {}, { botToken, adminIds: adminIds() });
    } catch (err) {
      console.error('Webhook xatosi:', err.message);
    }
    // Telegram xatoda qayta-qayta yubormasligi uchun doim 200
    res.json({ ok: true });
  });

  app.post(
    '/api/submit',
    upload.fields([
      { name: 'passport', maxCount: 1 },
      { name: 'diploma', maxCount: 1 },
      { name: 'resume', maxCount: 1 },
    ]),
    async (req, res) => {
      try {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const envChatIds = parseChatIds(process.env.TELEGRAM_CHAT_ID);

        let storedGroups = [];
        try {
          storedGroups = await listGroups();
        } catch (err) {
          console.error('Guruhlar roʻyxati oʻqilmadi:', err.message);
        }
        const storedIds = new Set(storedGroups.map((g) => g.id));
        const chatIds = [...new Set([...envChatIds, ...storedIds])];

        if (!botToken || chatIds.length === 0) {
          res.status(500).json({
            ok: false,
            error:
              'Telegram sozlanmagan. Environment Variables da TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID ni kiriting.',
          });
          return;
        }

        let data;
        try {
          data = JSON.parse(req.body.data || '{}');
        } catch {
          res.status(400).json({ ok: false, error: 'Anketa maʼlumotlari yaroqsiz.' });
          return;
        }

        if (!data.fullName?.trim() || !data.phone?.trim()) {
          res.status(400).json({ ok: false, error: 'F.I.Sh. va telefon majburiy.' });
          return;
        }

        const pdfBuffer = await buildApplicationPdf(data);
        const safeName = String(data.fullName)
          .replace(/[^\w\u0400-\u04FF\- ]+/g, '')
          .trim()
          .replace(/\s+/g, '_')
          .slice(0, 40);
        const filename = `Anketa_${safeName || 'Nomzod'}.pdf`;

        const caption = [
          '📋 <b>Yangi farmatsevt anketasi</b>',
          '',
          `👤 ${data.fullName}`,
          `📞 ${data.phone}`,
          data.email ? `✉️ ${data.email}` : null,
          data.specialty ? `💊 ${data.specialty}` : null,
          data.experienceYears ? `🗓 Staj: ${data.experienceYears} yil` : null,
          data.salaryRequest ? `💰 Maosh: ${data.salaryRequest}` : null,
        ]
          .filter(Boolean)
          .join('\n');

        const files = req.files || {};
        const attachments = [
          ['passport', 'Pasport'],
          ['diploma', 'Diplom'],
          ['resume', 'Rezyume'],
        ];

        const deliverTo = async (chatId) => {
          await sendMessageToTelegram({ botToken, chatId, text: caption });
          await sendPdfToTelegram({
            botToken,
            chatId,
            pdfBuffer,
            filename,
            caption: `PDF rezyume: ${data.fullName}`,
          });

          for (const [field, label] of attachments) {
            const list = files[field];
            if (list?.[0]) {
              const f = list[0];
              await sendFileToTelegram({
                botToken,
                chatId,
                buffer: f.buffer,
                filename: f.originalname || `${field}.bin`,
                caption: `${label} — ${data.fullName}`,
              });
            }
          }
        };

        const results = await Promise.allSettled(
          chatIds.map(async (chatId) => {
            try {
              await deliverTo(chatId);
            } catch (err) {
              // Guruh supergroup'ga aylansa Telegram yangi ID beradi
              if (err.migrateToChatId) {
                if (storedIds.has(chatId)) {
                  const title = storedGroups.find((g) => g.id === chatId)?.title;
                  await removeGroup(chatId).catch(() => {});
                  await addGroup(err.migrateToChatId, title).catch(() => {});
                } else {
                  console.warn(
                    `Chat ${chatId} yangi ID ga koʻchgan: ${err.migrateToChatId}. TELEGRAM_CHAT_ID ni yangilang.`
                  );
                }
                await deliverTo(err.migrateToChatId);
                return;
              }
              // Bot chiqarilgan yoki guruh oʻchirilgan boʻlsa roʻyxatdan olib tashlaymiz
              if (storedIds.has(chatId) && (err.code === 403 || /chat not found/i.test(err.message))) {
                await removeGroup(chatId).catch(() => {});
              }
              throw err;
            }
          })
        );

        const failed = results
          .map((r, i) => ({ r, chatId: chatIds[i] }))
          .filter(({ r }) => r.status === 'rejected');

        for (const { r, chatId } of failed) {
          console.error(`Chat ${chatId} ga yuborilmadi:`, r.reason?.message);
        }

        if (failed.length === chatIds.length) {
          throw new Error(failed[0].r.reason?.message || 'Telegramga yuborib boʻlmadi');
        }

        res.json({
          ok: true,
          message: 'Anketa yuborildi.',
          delivered: chatIds.length - failed.length,
          failed: failed.length,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({
          ok: false,
          error: err.message || 'Server xatosi',
        });
      }
    }
  );

  return app;
}
