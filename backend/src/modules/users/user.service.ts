
import { ApiError } from "../../common/errors/apiErrors.js";
import { User } from "./user.models.js";
import type { UpdateProfileInput } from "./user.validation.js";

export const getCurrentUser = async (userId: string) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userObject = user.toObject();

  const {
    _id,
    firstName,
    lastName,
    username,
    email,
    age,
    role,
    problemsSolved,
    createdAt,
    updatedAt,
  } = userObject;

  return {
    _id,
    firstName,
    lastName,
    username,
    email,
    age,
    role,
    problemsSolved,
    createdAt,
    updatedAt,
  };
};

export const updateProfile = async (
  userId: string,
  profileData: UpdateProfileInput,
) => {
  if (profileData.username) {
    const existingUser = await User.findOne({
      username: profileData.username,
      _id: { $ne: userId },
    });

    if (existingUser) {
      throw new ApiError(409, "Username is already taken");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: profileData },
    { new: true, runValidators: true },
  ).select("-password -refreshTokenHash");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return updatedUser;
};

/*
Service
Service me business aur database logic hota hai:
- User find karna
- Duplicate check karna
- Password hash/compare karna
- Database se data lana
- Errors throw karna
- Safe data return karna
*/


export const markProblemAsSolved = async (
  userId: string,
  problemId: string,
) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $addToSet: {
        problemsSolved: problemId,
      }
    },
    {
      new : true,
    }
  ).select("-password -refreshTokenHash");

  if(!updatedUser){
    throw new ApiError(
      404, 
      "User not found"
    );
  }
  return updatedUser;
}
