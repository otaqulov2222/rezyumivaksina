import 'dotenv/config';
import { webhookSecret } from '../server/webhookSecret.js';

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error('.env da TELEGRAM_BOT_TOKEN yoʻq');
  process.exit(1);
}

const api = async (method, params = {}) => {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return res.json();
};

const arg = process.argv[2];

if (arg === '--delete') {
  const r = await api('deleteWebhook');
  console.log(r.ok ? 'Webhook oʻchirildi.' : `Xato: ${r.description}`);
} else if (arg) {
  const url = `${arg.replace(/\/+$/, '')}/api/telegram/webhook`;
  const r = await api('setWebhook', {
    url,
    secret_token: webhookSecret(token),
    allowed_updates: ['message', 'my_chat_member'],
  });
  console.log(r.ok ? `Webhook oʻrnatildi: ${url}` : `Xato: ${r.description}`);
}

const info = await api('getWebhookInfo');
const w = info.result || {};
console.log('\nHozirgi holat:');
console.log(`  URL:        ${w.url || '(yoʻq)'}`);
console.log(`  Kutilayotgan: ${w.pending_update_count ?? 0}`);
if (w.last_error_message) console.log(`  Oxirgi xato: ${w.last_error_message}`);

if (!arg) {
  console.log('\nFoydalanish:');
  console.log('  npm run webhook -- https://sayt.vercel.app   webhook oʻrnatish');
  console.log('  npm run webhook -- --delete                  webhook oʻchirish');
}
