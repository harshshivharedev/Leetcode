

import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(3, "First name must be at least 3 characters")
    .max(20, "First name must not exceed 20 characters"),

  lastName: z
    .string()
    .trim()
    .min(3, "Last name must be at least 3 characters")
    .max(20, "Last name must not exceed 20 characters"),

  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must not exceed 30 characters"),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must not exceed 72 characters"),

  age: z.coerce
    .number()
    .int("Age must be an integer")
    .min(6, "Minimum age is 6")
    .max(80, "Maximum age is 80"),

  role: z
    .enum(["user", "admin"])
    .default("user"),

  problemsSolved: z
    .array(z.string())
    .default([]),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please provide a valid email"),

  password: z
    .string()
    .min(1, "Password is required"),
});