import { ApiError } from "../../common/errors/apiErrors.js";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { createProblemSchema, updateProblemSchema } from "./problem.validation.js";
import { Request, Response } from "express";
import {
    createProblem,
    getPublishedProblems,
    getProblemBySlug,
    updateProblemPublishStatus,
    updateProblem,
} from "./problem.service.js";



export const createProblemController = asyncHandler( 
    async (req: Request, res: Response) => {
        
        const adminId = req.user?.userId;

        if(!adminId) {
            throw new ApiError(401, "Authentication required");
        }

        const parsedData = createProblemSchema.safeParse(req.body);

        if(!parsedData.success) {
            throw new ApiError(
                401,
                "Invalid problem data",
                parsedData.error.issues,
            );
        }
        // create problem from problemservice.ts
        const problem = await createProblem(
            parsedData.data,
            adminId,
        )

        res.status(201).json({
            success: true,
            message: "Problem created successfully",
            data: problem,
        });

    }
)

export const getProblemsController = asyncHandler( 
    async (req:Request, res:Response) => {
        const problems = await getPublishedProblems();

        res.status(200).json({
            success: true,
            message: "Problems fetched successfully",
            data: problems
        })
    }
)

export const getProblemBySlugController = asyncHandler(
    async (req: Request, res: Response) => {
        const problemSlug = req.params.slug;

        if (typeof problemSlug !== "string" || problemSlug.length === 0) {
            throw new ApiError(400, "Problem slug is required");
        }

        const problem = await getProblemBySlug(problemSlug);

        res.status(200).json({
            success: true,
            message: "Problem fetched successfully",
            data: problem,
        });
    },
);

export const updateProblemPublishStatusController = asyncHandler(
    async (req:Request, res:Response) => {
        
        const { problemId } = req.params;

        if(typeof problemId !== "string" || problemId.length === 0) {
            throw new ApiError(400, "Problem ID is required");
        }

        const isPublished = req.body.isPublished;

        if(typeof isPublished !== "boolean" ) {
            throw new ApiError(400, "isPublished must be a boolean");
        }
        
        const updatedProblem = await updateProblemPublishStatus(problemId, isPublished);

        res.status(200).json({
            success: "true",
            message: "Problem publish status updated successfully",
            data: updatedProblem,
        })
    }
)

export const updateProblemController = asyncHandler(
    async (req: Request, res: Response) => {
        const problemId = req.params.problemId;

        if (typeof problemId !== "string" || problemId.length === 0) {
            throw new ApiError(400, "Problem ID is required");
        }

        const parsedData = updateProblemSchema.safeParse(req.body);

        if (!parsedData.success) {
            throw new ApiError(
                400,
                "Invalid problem data",
                parsedData.error.issues,
            );
        }

        const updatedProblem = await updateProblem(
            problemId,
            parsedData.data,
        );

        res.status(200).json({
            success: true,
            message: "Problem updated successfully",
            data: updatedProblem,
        });
    },
);
