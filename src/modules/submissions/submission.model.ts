import { Schema, model } from "mongoose";
import type { ISubmission } from "./submission.types.js";

const submissionSchema = new Schema<ISubmission>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
        },

        problem: {
            type: Schema.Types.ObjectId,
            ref: "Problem",
            required: [true, "Problem is required"],
        },

        code: {
            type: String,
            required: [true, "Code is required"],
            trim: true,
        },

        language: {
            type: String,
            enum: ["javascript", "python", "java", "cpp"],
            required: true,
        },

        status: {
            type: String,
            enum: [
                "pending",
                "running",
                "accepted",
                "wrong_answer",
                "runtime_error",
                "time_limit_exceeded",
            ],
            default: "pending",
            required: true,
        },

        runtime: {
            type: Number,
        },

        memory: {
            type: Number,
        },

        errorMessage: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    },
);

//  mongoDb indexes -> for queries fast, like user latest submission
submissionSchema.index({ user: 1, createdAt: -1 });
submissionSchema.index({ problem: 1, createdAt: -1 });

export const Submission = model<ISubmission>(
    "Submission",
    submissionSchema,
);