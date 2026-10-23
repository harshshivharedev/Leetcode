// make token and verify tokens


import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

export const generateAccessToken = (userId: string): string => {

    return jwt.sign(
        {
            userId,
            type: "access",
        },
        env.JWT_ACCESS_SECRET,
        {
            expiresIn: "15m",
        }
    )
}

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    {
      userId,
      type: "refresh",
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

export const verifyRefreshToken = (token: string): string => {
  const decodedToken = jwt.verify(token, env.JWT_REFRESH_SECRET);

  if (
    typeof decodedToken === "string" ||
    !decodedToken ||
    typeof decodedToken.userId !== "string" ||
    decodedToken.type !== "refresh"
  ) {
    throw new Error("Invalid refresh token");
  }

  return decodedToken.userId;
};
