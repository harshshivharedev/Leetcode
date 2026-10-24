import { ApiError } from "../../common/errors/apiErrors.js";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { createProblemSchema } from "./problem.validation.js";
import { Request, Response } from "express";
import { createProblem, getpublishedProblem } from "./problem.service.js";


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
        const problems = await getpublishedProblem();

        res.status(200).json({
            success: true,
            message: "Problems fetched successfully",
            data: problems
        })
    }
)