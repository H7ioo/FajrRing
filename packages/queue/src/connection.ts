import IORedis from "ioredis";
import { env } from "./env";

const redisUrl = env.REDIS_DATABASE_URL || "redis://localhost:6379";

// Producer connection (default retry settings)
export const producerConnection = new IORedis(redisUrl);

// Consumer/worker connection (must set maxRetriesPerRequest: null)
export const workerConnection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
});
