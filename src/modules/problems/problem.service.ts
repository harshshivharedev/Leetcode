

import { ApiError } from "../../common/errors/apiErrors.js";
import { Problem } from "./problem.model.js";
import { CreateProblemInput } from "./problem.types.js";


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

export const getpublishedProblem = async () => {
    const problems = await Problem.find({
        isPublished: true,
    })
    .select("-hiddenTestCases")
    .sort({ createdAt: -1});

    return problems;
}


