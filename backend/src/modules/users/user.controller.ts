import type { Request, Response } from "express";
import { ApiError } from "../../common/errors/apiErrors.js";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { getCurrentUser, updateProfile } from "./user.service.js";
import { updateProfileSchema } from "./user.validation.js";

export const getCurrentUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new ApiError(401, "Authentication required");
    }

    const user = await getCurrentUser(userId);

    res.status(200).json({
      success: true,
      message: "Current user fetched successfully",
      data: user,
    });
  },
);

export const updateProfileController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new ApiError(401, "Authentication required");
    }

    const parsedData = updateProfileSchema.safeParse(req.body);

    if (!parsedData.success) {
      throw new ApiError(
        400,
        "Invalid profile data",
        parsedData.error.issues,
      );
    }

    const user = await updateProfile(userId, parsedData.data);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  },
);


/*
Controller me sirf HTTP handling hoti hai:
- req se data lena
- Service ko call karna
- Service ka result lena
- res ke through response bhejna
*/
