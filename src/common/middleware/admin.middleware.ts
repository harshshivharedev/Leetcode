import { ApiError } from "../errors/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../../modules/users/user.models.js";

/* 
  Admin middleware
  1 check user autenticated or not
  2 fetch user role from database
  3 check user role is admin or not

*/

export const adminMiddleware = asyncHandler(async (req, _res, next) => {
  // check user authenticated through authMiddleware 
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, "Authentication required");
  }
  
  // fetch user role
  const user = await User.findById(userId).select("role");

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  if (user.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }

  next();
});
