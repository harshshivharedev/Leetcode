
import { Request, Response} from "express";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { promoteUserToAdmin } from "./admin.service.js";



export const promoteUserController = asyncHandler(
    async (req: Request, res:Response) => {
        const { userId } = req.params;

        const user = await promoteUserToAdmin(userId as string);

        res.status(200).json({
            success: true,
            message: "User promoted to admin successfully",
            data: user,
        })
    }
)