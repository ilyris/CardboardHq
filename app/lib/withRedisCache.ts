import redis from "./redis";

export async function withRedisCache<T>(
  key: string,
  ttlSeconds: number,
  fetchFn: () => Promise<T>
): Promise<T> {
  try {
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (err) {
    console.error("[REDIS ERROR - get]", err);
  }

  const data = await fetchFn();

  try {
    await redis.set(key, JSON.stringify(data), "EX", ttlSeconds);
  } catch (err) {
    console.error("[REDIS ERROR - set]", err);
  }

  return data;
}
