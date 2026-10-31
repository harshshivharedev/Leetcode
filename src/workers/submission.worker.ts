
import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import type { SubmissionJobData } from "../queue/submission.queue.ts";
import { connectDatabase } from "../config/database.js";
import { Submission } from "../modules/submissions/submission.model.js";
import { Problem } from "../modules/problems/problem.model.js";
import { ApiError } from "../common/errors/apiErrors.js";
import { submitCodeToJudge0 } from "../common/clients/judge0.client.js";
import { judge0LanguageIds } from "../common/constants/judge0.languages.js";


await connectDatabase();
export const submissionWorker = new Worker(
    "submission-execution",                          // queeu name
    async (job) => {                                 // processor fuction
        const { submissionId } = job.data;           // when job come in queue function run 

        console.log(
            `Processing submission: ${submissionId}`,
        );
        // judge0 execution logic here

        const submission = await Submission.findById(submissionId);

        if(!submission){
            throw new ApiError(404, "Submission not found");
        }

        const problem = await Problem.findById(submission.problem)
            .select("+hiddenTestCases");

        if(!problem){
            throw new ApiError(404, "Problem not found");
        }

        submission.status = "running";

        await submission.save();

        console.log(
            `Submission ${submissionId} is now running`,
        );

        const languageId = judge0LanguageIds[submission.language];

        if(!languageId) {
            throw new ApiError(400, "Unsupported submission language");
        }

        const firstTestCase = problem.hiddenTestCases[0];
        if(!firstTestCase) {
            throw new ApiError(400, "Hidden test case not found");
        }

        const judge0Token = await submitCodeToJudge0({
            sourceCode: submission.code,
            languageId,
            stdin: firstTestCase.input,
            expectedOutput: firstTestCase.output,
        })


        console.log(
            `Judge0 submission token: ${judge0Token}`,
        )
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


