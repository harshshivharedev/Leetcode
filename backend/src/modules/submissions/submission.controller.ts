
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { ApiError } from "../../common/errors/apiErrors.js";
import { Request, Response } from "express";
import { createSubmissionSchema, runCodeSchema } from "./submission.validation.js";
import { createSubmission, getMySubmissions, getSubmissionById } from "./submission.service.js";
import { Problem } from "../problems/problem.model.js";
import { judge0LanguageIds } from "../../common/constants/judge0.languages.js";
import { runVisibleTestCases } from "./submission.execution.service.js";
import { SubmissionStatus } from "./submission.types.js";


export const createSubmissionController = asyncHandler(
    async (req:Request, res:Response) => {
        
        const userId = req.user?.userId;

        if(!userId) {
            throw new ApiError(401 , "Autentication required");
        }

        const parsedData = createSubmissionSchema.safeParse(req.body);

        if(!parsedData.success){
            throw new ApiError(
                400, 
                "invalid submission data",
                parsedData.error.issues
            );
        }

        const createdSubmission = await createSubmission(
            userId,
            parsedData.data
        )

        res.status(200).json(
            {
                success: true,
                message: "Submission created successfully",
                data: createdSubmission
            }
        )


    }
)

export const runCodeController = asyncHandler(
    async (req: Request, res: Response) => {
        if (!req.user?.userId) {
            throw new ApiError(401, "Authentication required");
        }

        const parsedData = runCodeSchema.safeParse(req.body);

        if (!parsedData.success) {
            throw new ApiError(
                400,
                "Invalid run code data",
                parsedData.error.issues,
            );
        }

        const problem = await Problem.findById(parsedData.data.problemId);

        if (!problem || !problem.isPublished) {
            throw new ApiError(404, "Published problem not found");
        }

        const languageId = judge0LanguageIds[parsedData.data.language];

        if (!languageId) {
            throw new ApiError(400, "Unsupported submission language");
        }

        const results = await runVisibleTestCases(
            parsedData.data.code,
            languageId,
            problem.visibleTestCases,
        );

        res.status(200).json({
            success: true,
            message: "Code executed successfully",
            data: results,
        });
    },
);

export const getSubmissionController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?.userId;

        if (!userId) {
            throw new ApiError(401, "Authentication required");
        }

        const submissionId = req.params.submissionId;

        if (
            typeof submissionId !== "string" ||
            submissionId.length === 0
        ) {
            throw new ApiError(
                400,
                "Submission ID is required",
            );
        }

        const submission = await getSubmissionById(
            submissionId,
            userId,
        );

        res.status(200).json({
            success: true,
            message: "Submission fetched successfully",
            data: submission,
        });
    },
);

export const getMySubmissionsController = asyncHandler(
    async(req:Request, res:Response) => {

        const userId = req.user?.userId;

        if(!userId) {
            throw new ApiError(401, "authentication required");
        }

        const pageParam = req.query.page;
        const limitParam = req.query.limit;
        const statusParam = req.query.status;

        const validStatuses = [
            "pending",
            "running",
            "accepted",
            "wrong_answer",
            "runtime_error",
            "time_limit_exceeded",
        ] as const;

        if(statusParam !== undefined && (
            typeof statusParam !== "string" ||
            !validStatuses.includes(
                statusParam as (typeof validStatuses)[number],
            )
        )) {
            throw new ApiError(
                400,
                "Invalid submission status",
            )
        }

        // default set if page and limit not given in url
        const page = Number(pageParam) || 1;
        const limit = Number(limitParam) || 10;

        // validate page and limit
        if(page < 1){
            throw new ApiError(400, "page must be at least 1");
        }

        if(limit < 1 || limit > 100){
            throw new ApiError(
                400,
                "Limit must be between 1 and 100",
            )
        }

        const result = await getMySubmissions(
            userId,
            page,
            limit,
            statusParam as SubmissionStatus | undefined
        )

        res.status(200).json({
            success: true,
            message: "Submissions fetched successfully",
            data: result.submissions,
            pagination: result.pagination,
        })
    }
)
