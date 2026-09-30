import { addGroup, removeGroup } from './chatStore.js';
import { leaveTelegramChat, sendMessageToTelegram } from './telegram.js';

const isGroup = (chat) => chat?.type === 'group' || chat?.type === 'supergroup';

const NOT_ALLOWED =
  'Bu botni faqat VAKSINA MED xodimlari guruhga qoʻsha oladi. Bot guruhdan chiqib ketadi.';
const REGISTERED = '✅ Bu guruhga endi yangi anketalar (PDF rezyume) keladi.';

async function reject(botToken, chatId) {
  await sendMessageToTelegram({ botToken, chatId, text: NOT_ALLOWED }).catch(() => {});
  await leaveTelegramChat({ botToken, chatId }).catch(() => {});
}

/**
 * @param {object} update Telegram Update
 * @param {{ botToken: string, adminIds: string[] }} ctx
 */
export async function handleTelegramUpdate(update, { botToken, adminIds }) {
  const isAdmin = (user) => Boolean(user) && adminIds.includes(String(user.id));

  const member = update.my_chat_member;
  if (member && isGroup(member.chat)) {
    const { chat } = member;
    const status = member.new_chat_member?.status;

    if (status === 'member' || status === 'administrator') {
      if (!isAdmin(member.from)) {
        await reject(botToken, chat.id);
        return;
      }
      await addGroup(chat.id, chat.title);
      await sendMessageToTelegram({ botToken, chatId: chat.id, text: REGISTERED }).catch(() => {});
    } else if (status === 'left' || status === 'kicked') {
      await removeGroup(chat.id);
    }
    return;
  }

  const msg = update.message;
  if (!msg || !isGroup(msg.chat)) return;

  if (msg.migrate_to_chat_id) {
    await removeGroup(msg.chat.id);
    await addGroup(msg.migrate_to_chat_id, msg.chat.title);
    return;
  }

  const command = msg.text?.split(/[\s@]/)[0];
  if (command === '/start' || command === '/anketa') {
    if (!isAdmin(msg.from)) {
      await reject(botToken, msg.chat.id);
      return;
    }
    await addGroup(msg.chat.id, msg.chat.title);
    await sendMessageToTelegram({ botToken, chatId: msg.chat.id, text: REGISTERED });
  }
}
