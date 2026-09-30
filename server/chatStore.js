const KEY = 'anketa:groups';

function config() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

export function storeConfigured() {
  return Boolean(config());
}

async function redis(command) {
  const cfg = config();
  if (!cfg) throw new Error('Redis ulanmagan (KV_REST_API_URL / KV_REST_API_TOKEN yoʻq)');
  const res = await fetch(cfg.url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  const json = await res.json();
  if (json.error) throw new Error(`Redis: ${json.error}`);
  return json.result;
}

/** @returns {Promise<{ id: string, title: string }[]>} */
export async function listGroups() {
  if (!config()) return [];
  const flat = (await redis(['HGETALL', KEY])) || [];
  const groups = [];
  for (let i = 0; i < flat.length; i += 2) {
    groups.push({ id: flat[i], title: flat[i + 1] });
  }
  return groups;
}

export async function addGroup(id, title) {
  await redis(['HSET', KEY, String(id), title || '']);
}

export async function removeGroup(id) {
  await redis(['HDEL', KEY, String(id)]);
}
