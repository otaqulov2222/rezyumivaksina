import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildApplicationPdf } from './pdf.js';
import {
  sendPdfToTelegram,
  sendFileToTelegram,
  sendMessageToTelegram,
} from './telegram.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const PORT = Number(process.env.PORT) || 3001;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  const configured = Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
  res.json({ ok: true, telegramConfigured: configured });
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
      const chatId = process.env.TELEGRAM_CHAT_ID;

      if (!botToken || !chatId) {
        res.status(500).json({
          ok: false,
          error:
            'Telegram sozlanmagan. .env faylida TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID ni kiriting.',
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

      await sendMessageToTelegram({
        botToken,
        chatId,
        text: caption,
      });

      await sendPdfToTelegram({
        botToken,
        chatId,
        pdfBuffer,
        filename,
        caption: `PDF rezyume: ${data.fullName}`,
      });

      const files = req.files || {};
      const map = [
        ['passport', 'Pasport'],
        ['diploma', 'Diplom'],
        ['resume', 'Rezyume'],
      ];

      for (const [field, label] of map) {
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

      res.json({ ok: true, message: 'Anketa Telegramga yuborildi.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        ok: false,
        error: err.message || 'Server xatosi',
      });
    }
  }
);

const dist = path.join(root, 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(dist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    console.warn('⚠  TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID .env da yoʻq');
  }
});
