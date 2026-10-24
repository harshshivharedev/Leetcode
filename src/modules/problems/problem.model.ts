

import { Schema, model } from "mongoose";
import type { IProblem } from "./problem.types.js";

const problemSchema = new Schema<IProblem>(
  {
    title: {
      type: String,
      required: [true, "Problem title is required"],
      trim: true,
      maxlength: 150,
    },

    slug: {
      type: String,
      required: [true, "Problem slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: [true, "Problem description is required"],
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: [true, "Problem difficulty is required"],
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    visibleTestCases: [
      {
        input: {
          type: String,
          required: true,
        },
        output: {
          type: String,
          required: true,
        },
        explanation: {
          type: String,
          required: true,
        },
      },
    ],

    hiddenTestCases: {
      type: [
        {
          input: {
            type: String,
            required: true,
          },
          output: {
            type: String,
            required: true,
          },
        },
      ],
      select: false,
    },

    starterCode: [
      {
        language: {
          type: String,
          required: true,
        },
        initialCode: {
          type: String,
          required: true,
        },
      },
    ],

    problemCreator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Problem creator is required"],
    },

    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Problem = model<IProblem>("Problem", problemSchema);