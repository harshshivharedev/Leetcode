



export interface Problem {
  _id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  starterCode: {
    language: string;
    initialCode: string;
  }[];
  visibleTestCases?: {
    input: string;
    output: string;
    explanation: string;
  }[];
  hiddenTestCases?: { input: string; output: string }[];
  problemCreator: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProblemsResponse {
  success: boolean;
  message: string;
  data: Problem[];
}

import { API_BASE_URL } from "../config/api";

export interface CreateProblemPayload {
  title: string;
  slug: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  visibleTestCases: {
    input: string;
    output: string;
    explanation: string;
  }[];
  hiddenTestCases: {
    input: string;
    output: string;
  }[];
  starterCode: {
    language: string;
    initialCode: string;
  }[];
  referenceSolution: {
    language: string;
    completeCode: string;
  }[];
}

export const createProblem = async (
  data: CreateProblemPayload,
  accessToken: string,
) => {
  const response = await fetch(`${API_BASE_URL}/problems`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create problem");
  }

  return result;
};

export const getAllProblemsForAdmin = async (accessToken: string) => {
  const response = await fetch(`${API_BASE_URL}/problems/admin/all`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch problems");
  return result.data as Problem[];
};

export const updateProblemPublishStatus = async (
  problemId: string,
  isPublished: boolean,
  accessToken: string,
) => {
  const response = await fetch(`${API_BASE_URL}/problems/${problemId}/publish`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ isPublished }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to update status");
  return result.data as Problem;
};

export const deleteProblem = async (problemId: string, accessToken: string) => {
  const response = await fetch(`${API_BASE_URL}/problems/${problemId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to delete problem");
};

export const updateProblem = async (
  problemId: string,
  data: Partial<Pick<Problem, "title" | "description" | "difficulty" | "tags" | "visibleTestCases" | "hiddenTestCases">>,
  accessToken: string,
) => {
  const response = await fetch(`${API_BASE_URL}/problems/${problemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to update problem");
  return result.data as Problem;
};

export const getPublishedProblems = async () => {
    const response = await fetch(`${API_BASE_URL}/problems`);

    const result: ProblemsResponse = await response.json();

    if(!response.ok){
        throw new Error(result.message || "Failed to fetch problems0");

    }


    return result.data;
}

interface ProblemResponse {
  success: boolean;
  message: string;
  data: Problem;
}

export const getProblemBySlug = async (
  slug: string,
): Promise<Problem> => {
  const response = await fetch(
    `${API_BASE_URL}/problems/${slug}`,
  );

  const result: ProblemResponse = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch problem");
  }

  return result.data;
};
