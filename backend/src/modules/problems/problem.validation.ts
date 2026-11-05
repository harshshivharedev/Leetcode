
import { z } from "zod";

const visibleTestCaseSchema = z.object({
  input: z.string().min(1, "Input is required"),
  output: z.string().min(1, "Output is required"),
  explanation: z.string().min(1, "Explanation is required"),
});

const hiddenTestCaseSchema = z.object({
  input: z.string().min(1, "Input is required"),
  output: z.string().min(1, "Output is required"),
});

const starterCodeSchema = z.object({
  language: z.string().min(1, "Language is required"),
  initialCode: z.string().min(1, "Initial code is required"),
});

const referenceSolutionSchema = z.object({
  language: z.string().min(1, "Language is required"),
  completeCode: z.string().min(1, "Complete code is required"),
});

export const createProblemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters"),

  slug: z
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),

  difficulty: z.enum(["easy", "medium", "hard"]),

  tags: z
    .array(z.string().trim().min(1))
    .min(1, "At least one tag is required"),

  visibleTestCases: z
    .array(visibleTestCaseSchema)
    .min(1, "At least one visible test case is required"),

  hiddenTestCases: z
    .array(hiddenTestCaseSchema)
    .min(1, "At least one hidden test case is required"),

  starterCode: z
    .array(starterCodeSchema)
    .min(1, "At least one starter code is required"),

  referenceSolution: z
    .array(referenceSolutionSchema)
    .min(1, "At least one reference solution is required"),
});


export const updateProblemSchema = z
  .object({
      title: z
          .string()
          .trim()
          .min(3, "Title must be at least 3 characters")
          .optional(),

      description: z
          .string()
          .trim()
          .min(10, "Description must be at least 10 characters")
          .optional(),

      difficulty: z
          .enum(["easy", "medium", "hard"])
          .optional(),

      tags: z
          .array(z.string().trim().min(1))
          .min(1, "At least one tag is required")
          .optional(),

      visibleTestCases: z
          .array(visibleTestCaseSchema)
          .min(1, "At least one visible test case is required")
          .optional(),

      hiddenTestCases: z
          .array(hiddenTestCaseSchema)
          .min(1, "At least one hidden test case is required")
          .optional(),

      starterCode: z
          .array(starterCodeSchema)
          .min(1, "At least one starter code is required")
          .optional(),
  })
  .refine(
      (data) => Object.keys(data).length > 0,
      {
          message: "At least one field is required to update",
      },
  );

export type UpdateProblemInput = z.infer<
  typeof updateProblemSchema
>;
