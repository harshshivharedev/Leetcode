import { z } from "zod";

export const updateProfileSchema = z
  .object({
    firstName: z.string().trim().min(3).max(20).optional(),
    lastName: z.string().trim().min(3).max(20).optional(),
    username: z.string().trim().min(3).max(30).optional(),
    age: z.coerce.number().int().min(6).max(80).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one profile field is required",
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
