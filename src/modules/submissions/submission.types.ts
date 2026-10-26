

import { Types } from "mongoose";

export type SubmissionLanguage =
    | "javascript"
    | "python"
    | "java"
    | "cpp";

export type SubmissionStatus =
    | "pending"
    | "running"
    | "accepted"
    | "wrong_answer"
    | "runtime_error"
    | "time_limit_exceeded";

export interface ISubmission {
    user: Types.ObjectId;
    problem: Types.ObjectId;
    code: string;
    language: SubmissionLanguage;
    status: SubmissionStatus;
    runtime?: number;
    memory?: number;
    errorMessage?: string;
    createdAt: Date;
    updatedAt: Date;
}