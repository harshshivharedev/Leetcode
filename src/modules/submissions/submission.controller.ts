
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { ApiError } from "../../common/errors/apiErrors.js";
import { Request, Response } from "express";
import { createSubmissionSchema } from "./submission.validation.js";
import { createSubmission, getMySubmissions, getSubmissionById } from "./submission.service.js";


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
        )

        res.status(200).json({
            success: true,
            message: "Submissions fetched successfully",
            data: result.submissions,
            pegination: result.pagination,
        })
    }
)