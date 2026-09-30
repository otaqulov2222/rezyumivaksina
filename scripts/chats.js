import 'dotenv/config';

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error('.env da TELEGRAM_BOT_TOKEN yoʻq');
  process.exit(1);
}

const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
const json = await res.json();
if (!json.ok) {
  console.error('Telegram xatosi:', json.description);
  process.exit(1);
}

const chats = new Map();
for (const u of json.result) {
  const chat =
    u.message?.chat ||
    u.channel_post?.chat ||
    u.my_chat_member?.chat ||
    u.chat_member?.chat;
  if (!chat) continue;
  const status = u.my_chat_member?.new_chat_member?.status;
  chats.set(chat.id, {
    id: chat.id,
    type: chat.type,
    name: chat.title || [chat.first_name, chat.last_name].filter(Boolean).join(' ') || chat.username || '',
    botStatus: status || chats.get(chat.id)?.botStatus || '',
  });
}

if (chats.size === 0) {
  console.log(
    'Hech qanday chat topilmadi. Botni guruhga qoʻshing va guruhda biror xabar yozing, soʻng qayta ishga tushiring.'
  );
  process.exit(0);
}

console.log('Bot koʻrgan chatlar (oxirgi 24 soat):\n');
for (const c of chats.values()) {
  const removed = c.botStatus === 'left' || c.botStatus === 'kicked' ? '  (bot chiqarilgan)' : '';
  console.log(`${String(c.id).padEnd(16)} ${c.type.padEnd(11)} ${c.name}${removed}`);
}

const ids = [...chats.values()]
  .filter((c) => c.botStatus !== 'left' && c.botStatus !== 'kicked')
  .map((c) => c.id);
console.log(`\nTELEGRAM_CHAT_ID uchun tayyor qiymat:\n${ids.join(',')}`);
