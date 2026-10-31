
import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import type { SubmissionJobData } from "../queue/submission.queue.js";

export const submissionWorker = new Worker(
    "submission-execution",                          // queeu name
    async (job) => {                                 // processor fuction
        const { submissionId } = job.data;           // when job come in queue function run 

        console.log(
            `Processing submission: ${submissionId}`,
        );
        // judge0 execution logic here

    },
    {
        connection: redisConnection,                  // worker connect with redis 
    }
);

submissionWorker.on("completed", (job) => {
    console.log(`Job completed: ${job.id}`);
});

submissionWorker.on("failed", (job, error) => {
    console.error(
        `job failed: ${job?.id}`,
        error,
    );
});