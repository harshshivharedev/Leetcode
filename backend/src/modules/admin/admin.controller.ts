
import { Request, Response } from "express";
import { ApiError } from "../../common/errors/apiErrors.js";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { updateUserRole } from "./admin.service.js";

export const updateUserRoleController = asyncHandler(
    async (req: Request, res:Response) => {
        const { userId } = req.params;
        const { role } = req.body;
        const actingUserId = req.user?.userId;
        const targetUserId = Array.isArray(userId) ? userId[0] : userId;

        if (!targetUserId || !actingUserId) {
            throw new ApiError(400, "User ID is required");
        }

        if (role !== "user" && role !== "admin") {
            throw new ApiError(400, "Role must be either user or admin");
        }

        const user = await updateUserRole(
            targetUserId,
            role,
            actingUserId,
        );

        res.status(200).json({
            success: true,
            message: "User role updated successfully",
            data: user,
        });
    },
);
