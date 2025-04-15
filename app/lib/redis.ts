import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!, {
  tls: process.env.REDIS_URL?.startsWith("rediss://") ? {} : undefined,
  connectTimeout: 10000,
});

export default redis;
