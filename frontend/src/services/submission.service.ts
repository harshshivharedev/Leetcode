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

export const createSubmission = async (
  data: CreateSubmissionPayload,
  accessToken: string,
) => {
  const response = await fetch("http://localhost:5000/api/v1/submissions", {
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
    `http://localhost:5000/api/v1/submissions/${submissionId}`,
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
    "http://localhost:5000/api/v1/submissions/run",
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
