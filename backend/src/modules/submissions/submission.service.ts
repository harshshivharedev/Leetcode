

import { ApiError } from "../../common/errors/apiErrors.js";
import { submissionQueue } from "../../queue/submission.queue.js";
import { Problem } from "../problems/problem.model.js";
import { User } from "../users/user.models.js";
import { Submission } from "./submission.model.js";
import { SubmissionStatus } from "./submission.types.js";
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


export const getSubmissionById = async (
    submissionId: string,
    userId: string,
) => {
    const submission = await Submission.findOne({
        _id: submissionId,
        user: userId,
    });

    if (!submission) {
        throw new ApiError(
            404,
            "Submission not found",
        );
    }

    return submission;
};


export const getMySubmissions = async (
    userId: string,
    page: number,
    limit: number,
    status?: SubmissionStatus
) => {
    const skip = (page-1) * limit;

    const filter: {
        user: string;
        status?: SubmissionStatus;
    } = {
        user: userId,
    }

    if(status){
        filter.status = status;
    }

    const submissions = await Submission.find(filter)
    .sort({createdAt: -1})    // latest submissions first
    .skip(skip)               // previous pages skip
    .limit(limit);            // limited records in current page

    const totalSubmissions = await Submission.countDocuments(filter);

    const totalPages = Math.ceil(
        totalSubmissions/limit,
    )

    return {
        submissions,
        pagination: {
            page,
            limit,
            totalSubmissions,
            totalPages
        }
    }
}


