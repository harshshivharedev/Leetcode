

import { ApiError } from "../../common/errors/apiErrors.js";
import { submissionQueue } from "../../queue/submission.queue.js";
import { Problem } from "../problems/problem.model.js";
import { Submission } from "./submission.model.js";
import type { CreateSubmissionInput } from "./submission.validation.js";

export const createSubmission = async (
    userId: string,
    submissionData: CreateSubmissionInput,
) => {
    const problem = await Problem.findById(submissionData.problemId);

    if (!problem) {
        throw new ApiError(404, "Problem not found");
    }

    if (!problem.isPublished) {
        throw new ApiError(
            400,
            "Cannot submit solution for an unpublished problem",
        );
    }

    const submission = await Submission.create({
        user: userId,
        problem: problem._id,
        code: submissionData.code,
        language: submissionData.language,
        status: "pending",
    });

    await submissionQueue.add(
        "execute-submission",
        {
            submissionId: submission._id.toString(),
        }
    )

    return submission;
};