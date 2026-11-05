import { submitCodeToJudge0, waitForJudge0Result } from "../../common/clients/judge0.client.js";
import { HiddenTestCase } from "../problems/problem.types.js";



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