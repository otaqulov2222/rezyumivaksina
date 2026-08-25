import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { buildApplicationPdf } from './pdf.js';
import {
  sendPdfToTelegram,
  sendFileToTelegram,
  sendMessageToTelegram,
} from './telegram.js';

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

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '2mb' }));

  app.get('/api/health', (_req, res) => {
    const chatIds = parseChatIds(process.env.TELEGRAM_CHAT_ID);
    res.json({
      ok: true,
      telegramConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN && chatIds.length),
      chatCount: chatIds.length,
    });
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
        const chatIds = parseChatIds(process.env.TELEGRAM_CHAT_ID);

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

        for (const chatId of chatIds) {
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
        }

        res.json({
          ok: true,
          message: `Anketa ${chatIds.length} ta chatga yuborildi.`,
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
