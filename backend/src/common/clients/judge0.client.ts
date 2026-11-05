
// Purpose --> Judge0 api ko code bejna 
import { env } from "../../config/env.js";

export interface SubmitCodeInput {
    sourceCode: string;
    languageId: number;
    stdin?: string;              // Program input
    expectedOutput?: string;
}

export interface Judge0SubmitResponse {
    token: string;
}

export const submitCodeToJudge0 = async (
    input: SubmitCodeInput,
) => {
    const response = await fetch (
        `${env.JUDGE0_BASE_URL}/submissions?base64_encoded=false&wait=false`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",     // body json format
            },
            body: JSON.stringify({
                source_code: input.sourceCode,
                language_id: input.languageId,
                stdin: input.stdin,
                expected_output: input.expectedOutput,
            })
        }
    )
    if(!response.ok){
        const errorText = await response.text();

        throw new Error(
            `Judge0 submission failed: ${response.status} ${errorText}`,
        )
    }

    const data = (await response.json()) as Judge0SubmitResponse;

    return data.token;
}



export interface Judge0SubmissionResult {
    token: string;
    stdout: string | null;              //  program output
    stderr: string | null;              //  runtime error
    compile_output: string | null;      //  compilation error
    message: string | null;             
    time: string | null;                //  execution time
    memory: number | null;              //  memory usage
    status : {                          //  status like accepted
        id: number;
        description: string;
    }
}
export const getSubmissionResultFromJudge0 = async (token: string) => {
    
    const response = await fetch(
        `${env.JUDGE0_BASE_URL}/submissions/${token}?base64_encoded=false`
    );

    if(!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Judge0 result fetch failed: ${response.status} ${errorText}`,
        )
    }

    const data = (await response.json()) as Judge0SubmissionResult;

    return data;
}


//  polling reusable function for every queue 

export const waitForJudge0Result = async(token: string) => {
    const maxAttemps = 10;
    const delayInMilliSeconds = 1000;

    for(let attempt = 1; attempt <= maxAttemps; attempt++){
        const result = await getSubmissionResultFromJudge0(token);

        const isProcessing = 
            result.status.id === 1 ||
            result.status.id === 2;
        
        if(!isProcessing) {
            return result;
        }

        await new Promise((resolve) => {
            setTimeout(resolve, delayInMilliSeconds);
        })
    }
    throw new Error(
        "Judge0 execution timed out while for result",
    )
}