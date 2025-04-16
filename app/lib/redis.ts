import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_TLS_URL ?? process.env.REDIS_URL!, {
  tls: (process.env.REDIS_TLS_URL ?? process.env.REDIS_URL)?.startsWith(
    "rediss://"
  )
    ? {}
    : undefined,
  connectTimeout: 10000,
  maxRetriesPerRequest: 1,
});

export default redis;
