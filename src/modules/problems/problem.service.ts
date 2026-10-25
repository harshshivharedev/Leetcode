

import { ApiError } from "../../common/errors/apiErrors.js";
import { Problem } from "./problem.model.js";
import { CreateProblemInput } from "./problem.types.js";
import type { UpdateProblemInput } from "./problem.validation.js";


//  for createing problems by admin
export const createProblem = async (
    data: CreateProblemInput,
    adminId: string,
) => {
    const existingProblem = await Problem.findOne({
        slug: data.slug,
    });

    if(existingProblem){
        throw new ApiError(409, "Problem with this slug already exists");
    }

    const problem = await Problem.create({
        ...data,
        problemCreator: adminId,
        isPublished: false,
    });

    return problem;
}

export const getPublishedProblems = async () => {
    const problems = await Problem.find({
        isPublished: true,
    })
    .select("-hiddenTestCases")
    .sort({ createdAt: -1});

    return problems;
}


export const getProblemBySlug = async(
    slug: string
) => {
    const problem = await Problem.findOne({
        slug,
        isPublished: true,
    }).select("-hiddenTestCases");

    if(!problem) {
        throw new ApiError(404, "Problem not found")
    }

    return problem;
}


export const updateProblemPublishStatus = async(
    problemId: string,
    isPublished: boolean
) => {
    const problem = await Problem.findById(problemId);

    if(!problem){
        throw new ApiError(404, "Problem not found")
    }

    problem.isPublished = isPublished;

    await problem.save();

    const updatedProblem = await Problem.findById(problemId)
        .select("-hiddenTestCases");

    return updatedProblem;
}


export const updateProblem = async(
    problemId: string,
    validatedUpdateData: UpdateProblemInput,
) => {
    const problem = await Problem.findById(problemId);

    if(!problem) {
        throw new ApiError(404, "Problem not found")
    }

    Object.assign(problem, validatedUpdateData);

    await problem.save();

    const upadatedProblem = await Problem.findById(
        problemId
    ).select("-hiddenTestCases");

    return upadatedProblem;
}



