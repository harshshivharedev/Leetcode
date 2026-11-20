import { submitCodeToJudge0, waitForJudge0Result } from "../../common/clients/judge0.client.js";
import { HiddenTestCase, VisibleTestCase } from "../problems/problem.types.js";



export const runSubmissionTestCase = async(
    sourceCode: string,
    languageId: number,
    testCase: HiddenTestCase,
) => {
    const judge0Token = await submitCodeToJudge0({
        sourceCode,
        languageId,
        stdin: testCase.input,
        expectedOutput: testCase.output,
    });

    const judge0Result = await waitForJudge0Result(judge0Token);

    return judge0Result;
}

export const runVisibleTestCases = async (
    sourceCode: string,
    languageId: number,
    testCases: VisibleTestCase[],
) => {
    const results = [];

    for (const [index, testCase] of testCases.entries()) {
        const judge0Result = await runSubmissionTestCase(
            sourceCode,
            languageId,
            testCase,
        );

        results.push({
            testCaseNumber: index + 1,
            status: judge0Result.status.description,
            passed: judge0Result.status.id === 3,
            input: testCase.input,
            expectedOutput: testCase.output,
            actualOutput: judge0Result.stdout,
            error:
                judge0Result.stderr ??
                judge0Result.compile_output ??
                judge0Result.message,
            runtime: judge0Result.time
                ? Number(judge0Result.time) * 1000
                : null,
            memory: judge0Result.memory,
        });
    }

    return results;
};
