export interface CreateSubmissionPayload {
  problem: string;
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
  createdAt: string;
  updatedAt: string;
}

export const createSubmission = async (data: CreateSubmissionPayload) => {
  const response = await fetch("http://localhost:5000/api/v1/submissions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
): Promise<SubmissionResult> => {
  const response = await fetch(
    `http://localhost:5000/api/v1/submissions/${submissionId}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch submission");
  }

  return result.data;
};
