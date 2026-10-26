
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { ApiError } from "../../common/errors/apiErrors.js";
import { Request, Response } from "express";
import { createSubmissionSchema } from "./submission.validation.js";
import { createSubmission } from "./submission.service.js";


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