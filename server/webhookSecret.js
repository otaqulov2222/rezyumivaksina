import { createHash } from 'crypto';

export function webhookSecret(botToken) {
  return createHash('sha256').update(`webhook:${botToken}`).digest('hex').slice(0, 48);
}
