
import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import type { SubmissionJobData } from "../queue/submission.queue.ts";
import { connectDatabase } from "../config/database.js";
import { Submission } from "../modules/submissions/submission.model.js";
import { Problem } from "../modules/problems/problem.model.js";
import { ApiError } from "../common/errors/apiErrors.js";
import { submitCodeToJudge0, waitForJudge0Result } from "../common/clients/judge0.client.js";
import { judge0LanguageIds } from "../common/constants/judge0.languages.js";
import type { SubmissionStatus } from "../modules/submissions/submission.types.js";



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

        const judge0Result = await waitForJudge0Result(judge0Token);

        console.log("judge0 result:", judge0Result);

        const statusMap: Record<string, SubmissionStatus> = {
            Accepted: "accepted",
            "Wrong Answer": "wrong_answer",
            "Runtime Error": "runtime_error",
            "Time Limit Exceeded": "time_limit_exceeded",
            "Compilation Error": "runtime_error",
        };

        const judge0Status = judge0Result.status.description;

        const submissionStatus = statusMap[judge0Status];

        if(!submissionStatus){
            throw new ApiError(
                400,
                `Unsupported Judge0 status: ${judge0Status}`
            );
        }
        // submission status update and find runtime(miliseconds) , memory(bytes) 
        submission.status = submissionStatus;
        submission.runtime = judge0Result.time? Number(judge0Result.time) * 1000 : undefined;

        submission.memory = judge0Result.memory ?? undefined;

        // submission error message
        submission.errorMessage = 
            judge0Result.stderr ??
            judge0Result.compile_output ??
            judge0Result.message ??
            undefined;


        await submission.save();


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


