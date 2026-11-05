

import { Types } from "mongoose";

export type ProblemDifficulty = "easy" | "medium" | "hard";

export interface VisibleTestCase {
  input: string;
  output: string;
  explanation: string;
}

export interface HiddenTestCase {
  input: string;
  output: string;
}

export interface StarterCode {
  language: string;
  initialCode: string;
}

export interface ReferenceSolution {
  language: string;
  completeCode: string;
}

export interface IProblem {
  title: string;
  slug: string;
  description: string;
  difficulty: ProblemDifficulty;
  tags: string[];
  visibleTestCases: VisibleTestCase[];
  hiddenTestCases: HiddenTestCase[];
  starterCode: StarterCode[];
  referenceSolution: ReferenceSolution[];
  problemCreator: Types.ObjectId;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}


// this is for admin to create problems
export interface CreateProblemInput {
  title : string;
  slug: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  visibleTestCases: VisibleTestCase[],
  hiddenTestCases: HiddenTestCase[],
  starterCode: StarterCode[];
  referenceSolution : ReferenceSolution[];
}
