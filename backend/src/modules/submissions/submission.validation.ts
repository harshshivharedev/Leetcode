

import { z } from "zod";

export const createSubmissionSchema = z.object({
    problemId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid problem ID"),

    code: z
        .string()
        .trim()
        .min(1, "Code is required"),

    language: z.enum([
        "javascript",
        "python",
        "java",
        "cpp",
    ]),
});

export type CreateSubmissionInput = z.infer<
    typeof createSubmissionSchema
>;