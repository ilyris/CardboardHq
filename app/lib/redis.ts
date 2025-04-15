// lib/redis.ts
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!); // Use Upstash or local Redis
export default redis;
