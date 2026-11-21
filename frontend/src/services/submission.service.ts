export interface CreateSubmissionPayload {
  problemId: string;
  code: string;
  language: string;
}

export interface SubmissionResult {
  _id: string;
  user: string;
  problem: string;
  code: string;
  language: string;
  status:
    | "pending"
    | "running"
    | "accepted"
    | "wrong_answer"
    | "runtime_error"
    | "time_limit_exceeded"
    | "compilation_error";
  runtime?: number;
  memory?: number;
  errorMessage?: string;
  failedTestCaseNumber?: number;
  createdAt: string;
  updatedAt: string;
}

export interface RunCodeResult {
  testCaseNumber: number;
  status: string;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string | null;
  error: string | null;
  runtime: number | null;
  memory: number | null;
}

export interface SubmissionPagination {
  page: number;
  limit: number;
  totalSubmissions: number;
  totalPages: number;
}

export const createSubmission = async (
  data: CreateSubmissionPayload,
  accessToken: string,
) => {
  const response = await fetch(`${API_BASE_URL}/submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if(!response.ok) {
    throw new Error(
        result.message || "Submission failed",
    );
  }

  return result;
};

export const getSubmissionById = async (
  submissionId: string,
  accessToken: string,
): Promise<SubmissionResult> => {
  const response = await fetch(
    `${API_BASE_URL}/submissions/${submissionId}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch submission");
  }

  return result.data;
};

export const runCode = async (
  data: CreateSubmissionPayload,
  accessToken: string,
): Promise<RunCodeResult[]> => {
  const response = await fetch(
    `${API_BASE_URL}/submissions/run`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
      body: JSON.stringify(data),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Code execution failed");
  }

  return result.data;
};

export const getMySubmissions = async (
  accessToken: string,
  page = 1,
  limit = 10,
  status?: string,
) => {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (status) {
    query.set("status", status);
  }

  const response = await fetch(
    `${API_BASE_URL}/submissions/me?${query.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch submissions");
  }

  return {
    submissions: result.data as SubmissionResult[],
    pagination: result.pagination as SubmissionPagination,
  };
};
import { API_BASE_URL } from "../config/api";

