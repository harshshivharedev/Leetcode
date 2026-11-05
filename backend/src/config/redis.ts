

// import redis class ..
import { Redis } from "ioredis";
import { env } from "./env.js";

// create redis connection ..
export const redisConnection = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null,          // waiting for retry request for bullmq
});

redisConnection.on("connect", () => {
    console.log("Redis connected successfully");
})

redisConnection.on("error", (error) => {
    console.error("Redis connection error:", error);
})