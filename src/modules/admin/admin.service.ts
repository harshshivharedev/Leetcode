import { ApiError } from "../../common/errors/apiErrors.js";
import { User } from "../users/user.models.js"



export const promoteUserToAdmin = async (userId: string) => {
    const user = await User.findById(userId);

    if(!user) {
        throw new ApiError(404, "User not found");
    }

    user.role = "admin";

    const updatedUser = await user.save();

    const userObject = updatedUser.toObject();

    const {
        password: _password,
        refreshTokenHash: _refreshTokenHash,
        ...safeUser
    } = userObject;

    return safeUser;

    return safeUser;
}