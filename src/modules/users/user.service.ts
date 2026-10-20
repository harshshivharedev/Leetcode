
import { ApiError } from "../../common/errors/apiErrors.js";
import { User } from "./user.models.js";

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