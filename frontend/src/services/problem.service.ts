



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

const API_BASE_URL = "http://localhost:5000/api/v1";
export const getPublishedProblems = async () => {
    const response = await fetch(`${API_BASE_URL}/problems`);

    const result: ProblemsResponse = await response.json();

    if(!response.ok){
        throw new Error(result.message || "Failed to fetch problems0");

    }


    return result.data;
}