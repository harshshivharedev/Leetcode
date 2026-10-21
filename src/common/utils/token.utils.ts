
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

export const generateAccessToken = (userId: string): string => {

    return jwt.sign(
        {
            userId,
        },
        env.JWT_SECRET,
        {
            expiresIn: "15m",
        }
    )
}

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    {
      userId,
    },
    env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

export const verifyRefreshToken = (token: string): string => {
  const decodedToken = jwt.verify(token, env.JWT_SECRET);

  if (
    typeof decodedToken === "string" ||
    !decodedToken ||
    typeof decodedToken.userId !== "string"
  ) {
    throw new Error("Invalid refresh token");
  }

  return decodedToken.userId;
};