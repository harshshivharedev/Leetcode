
// purpose ->> submission execution job add in redis 

import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

export interface SubmissionJobData {
    submissionId: string;
}

export const submissionQueue = new Queue (
    "submission-execution",    // queue name
    {
        connection: redisConnection,
        defaultJobOptions: {
            removeOnComplete: 100,
            removeOnFail: 100,
            attempts: 3
        }
    }
)