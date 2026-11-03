
import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import type { SubmissionJobData } from "../queue/submission.queue.js";
import { connectDatabase } from "../config/database.js";
import { Submission } from "../modules/submissions/submission.model.js";
import { Problem } from "../modules/problems/problem.model.js";
import { ApiError } from "../common/errors/apiErrors.js";
import { judge0LanguageIds } from "../common/constants/judge0.languages.js";
import type { SubmissionStatus } from "../modules/submissions/submission.types.js";
import { runSubmissionTestCase } from "../modules/submissions/submission.execution.service.js";
import { markProblemAsSolved } from "../modules/users/user.service.js";


await connectDatabase();
export const submissionWorker = new Worker<SubmissionJobData>(
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

        let finalJudge0Result;

        for (const [index, testCase] of problem.hiddenTestCases.entries()) {
            const judge0Result = await runSubmissionTestCase(
                submission.code,
                languageId,
                testCase,
            );

            finalJudge0Result = judge0Result;

            console.log(
                `Test case ${index + 1} result:`,
                judge0Result.status.description,
            );

            if (judge0Result.status.id !== 3) {
                console.log(
                    `Submission failed on test case ${index + 1}`,
                );

                break;
            }
        }

        if (!finalJudge0Result) {
            throw new ApiError(400, "No hidden test cases found");
        }


        const statusMap: Record<string, SubmissionStatus> = {
            Accepted: "accepted",
            "Wrong Answer": "wrong_answer",
            "Runtime Error": "runtime_error",
            "Time Limit Exceeded": "time_limit_exceeded",
            "Compilation Error": "runtime_error",
        };

        const judge0Status = finalJudge0Result.status.description;
        const submissionStatus = statusMap[judge0Status];

        if(!submissionStatus){
            throw new ApiError(
                400,
                `Unsupported Judge0 status: ${judge0Status}`
            );
        }
        // submission status update and find runtime(miliseconds) , memory(bytes) 
        submission.status = submissionStatus;
        submission.runtime = finalJudge0Result.time
            ? Number(finalJudge0Result.time) * 1000
            : undefined;

        submission.memory = finalJudge0Result.memory ?? undefined;

        // submission error message
        submission.errorMessage = 
            finalJudge0Result.stderr ??
            finalJudge0Result.compile_output ??
            finalJudge0Result.message ??
            undefined;


        await submission.save();

        // check problem accepted or not
        if(submissionStatus === "accepted") {
            await markProblemAsSolved(
                submission.user.toString(),
                submission.problem.toString(),
            )
        }

        console.log(
            `Submission ${submissionId} completed with status: ${submissionStatus}`,
        );
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





