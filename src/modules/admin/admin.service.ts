import { ApiError } from "../../common/errors/apiErrors.js";
import { User, type UserRole } from "../users/user.models.js";

export const updateUserRole = async (
  targetUserId: string,     // user id
  newRole: UserRole,
  actingUserId: string,     // admin id 
) => {
    // if admin change own role to user, so reject the request 
    if (targetUserId === actingUserId && newRole === "user") {
        throw new ApiError(400, "You cannot remove your own admin access");
    }

    const user = await User.findById(targetUserId);

    if(!user) {
        throw new ApiError(404, "User not found");
    }
    
    // if admins change into role so count the all admins 
    if (user.role === "admin" && newRole === "user") {
        const adminCount = await User.countDocuments({ role: "admin" });
        
        // if admin only one so rreject the request 
        if (adminCount <= 1) {
            throw new ApiError(400, "At least one admin must remain");
        }
    }

    user.role = newRole;

    const updatedUser = await user.save();

    const userObject = updatedUser.toObject();

    const {
        password: _password,
        refreshTokenHash: _refreshTokenHash,
        ...safeUser
    } = userObject;

    return safeUser;
};
