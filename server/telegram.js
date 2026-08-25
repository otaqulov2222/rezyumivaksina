import FormData from 'form-data';
import https from 'https';

function postForm(url, form) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = https.request(
      {
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        method: 'POST',
        headers: form.getHeaders(),
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const body = Buffer.concat(chunks).toString('utf8');
          let json;
          try {
            json = JSON.parse(body);
          } catch {
            reject(new Error(`Telegram javobi yaroqsiz: ${body.slice(0, 200)}`));
            return;
          }
          if (!json.ok) {
            reject(new Error(json.description || 'Telegram xatosi'));
            return;
          }
          resolve(json);
        });
      }
    );
    req.on('error', reject);
    form.pipe(req);
  });
}

export async function sendPdfToTelegram({ botToken, chatId, pdfBuffer, filename, caption }) {
  const form = new FormData();
  form.append('chat_id', String(chatId));
  form.append('caption', caption.slice(0, 1024));
  form.append('document', pdfBuffer, {
    filename,
    contentType: 'application/pdf',
  });

  const url = `https://api.telegram.org/bot${botToken}/sendDocument`;
  return postForm(url, form);
}

export async function sendFileToTelegram({ botToken, chatId, buffer, filename, caption }) {
  const form = new FormData();
  form.append('chat_id', String(chatId));
  if (caption) form.append('caption', caption.slice(0, 1024));
  form.append('document', buffer, { filename });

  const url = `https://api.telegram.org/bot${botToken}/sendDocument`;
  return postForm(url, form);
}

export async function sendMessageToTelegram({ botToken, chatId, text }) {
  const form = new FormData();
  form.append('chat_id', String(chatId));
  form.append('text', text.slice(0, 4096));
  form.append('parse_mode', 'HTML');

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  return postForm(url, form);
}
