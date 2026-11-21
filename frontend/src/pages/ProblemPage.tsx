import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import Navbar from "../components/layout/Navbar";
import type { RootState } from "../store/store";
import CodeEditor from "../components/editor/CodeEditor";
import {
  createSubmission,
  getSubmissionById,
  runCode,
  type RunCodeResult,
  type SubmissionResult,
} from "../services/submission.service";
import {
  getProblemBySlug,
  type Problem,
} from "../services/problem.service";

const supportedLanguages = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
];

function ProblemPage() {
  const { slug } = useParams<{ slug: string }>();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [activeLeftTab, setActiveLeftTab] = useState("Description");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] =
    useState<SubmissionResult | null>(null);
  const [runResults, setRunResults] = useState<RunCodeResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const accessToken = useSelector(
    (state: RootState) => state.auth.accessToken,
  );

  useEffect(() => {
    if (!submissionId) {
      return;
    }

    const finalStatuses = [
      "accepted",
      "wrong_answer",
      "runtime_error",
      "time_limit_exceeded",
      "compilation_error",
    ];

    let isPollingActive = true;

    const checkSubmissionStatus = async () => {
      if (!accessToken) {
        setSubmissionMessage("Please login before checking submission status.");
        return;
      }

      try {
        const submission = await getSubmissionById(
          submissionId,
          accessToken,
        );

        setSubmissionResult(submission);
        setSubmissionStatus(submission.status);

        if (finalStatuses.includes(submission.status)) {
          isPollingActive = false;
          window.clearInterval(pollingInterval);
        }
      } catch (pollingError) {
        isPollingActive = false;
        window.clearInterval(pollingInterval);
        setSubmissionMessage(
          pollingError instanceof Error
            ? pollingError.message
            : "Failed to fetch submission status",
        );
      }
    };

    const pollingInterval = window.setInterval(() => {
      if (isPollingActive) {
        checkSubmissionStatus();
      }
    }, 2000);

    checkSubmissionStatus();

    return () => {
      isPollingActive = false;
      window.clearInterval(pollingInterval);
    };
  }, [submissionId, accessToken]);

  useEffect(() => {
    const loadProblem = async () => {
      if (!slug) {
        setError("Problem slug is missing");
        setIsLoading(false);
        return;
      }

      try {
        const data = await getProblemBySlug(slug);
        setProblem(data);

        const firstStarterCode = data.starterCode?.find((starter) =>
          supportedLanguages.some((language) => language.value === starter.language),
        );

        if (firstStarterCode) {
          setSelectedLanguage(firstStarterCode.language);
          setCode(firstStarterCode.initialCode || "// Write your solution here\n");
        } else {
          setCode("// Write your solution here\n");
        }
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Failed to load problem",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProblem();
  }, [slug]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center bg-[#f7f7f8]">
          <span className="loading loading-spinner loading-lg text-[#ffa116]" />
        </main>
      </>
    );
  }

  if (error || !problem) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center bg-[#f7f7f8] px-4">
          <div className="alert alert-error max-w-md">
            <span>{error || "Problem not found"}</span>
          </div>
        </main>
      </>
    );
  }

  const handleLanguageChange = (language: string) => {
    const starter = problem.starterCode?.find(
      (item) => item.language === language,
    );

    setSelectedLanguage(language);
    setCode(starter?.initialCode || "// Write your solution here\n");
  };

  const handleSubmitSolution = async () => {
    if (!problem || !code.trim()) {
      setSubmissionMessage("Please write some code before submitting.");
      return;
    }

    if (!accessToken) {
      setSubmissionMessage("Please login before submitting your solution.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmissionMessage("");

      const result = await createSubmission({
        problemId: problem._id,
        code,
        language: selectedLanguage,
      }, accessToken);

      setSubmissionId(result.data._id);
      setSubmissionStatus(result.data.status);

      setSubmissionMessage(
        result.message || `Submission queued: ${result.data._id}`,
      );
    } catch (submissionError) {
      setSubmissionMessage(
        submissionError instanceof Error
          ? submissionError.message
          : "Submission failed",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRunCode = async () => {
    if (!problem || !code.trim()) {
      setSubmissionMessage("Please write some code before running.");
      return;
    }

    if (!accessToken) {
      setSubmissionMessage("Please login before running your code.");
      return;
    }

    try {
      setIsRunning(true);
      setSubmissionMessage("");
      setRunResults([]);

      const results = await runCode(
        {
          problemId: problem._id,
          code,
          language: selectedLanguage,
        },
        accessToken,
      );

      setRunResults(results);
    } catch (runError) {
      setSubmissionMessage(
        runError instanceof Error
          ? runError.message
          : "Code execution failed",
      );
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <Navbar />

      <main className="mx-auto max-w-[1600px] px-3 py-3 sm:px-5 lg:px-6">
        <div className="mb-3 flex items-center justify-between rounded-lg bg-[#282828] px-4 py-2.5 text-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="text-xl text-gray-400 hover:text-white" type="button">
              ‹
            </button>
            <span className="hidden text-sm font-semibold sm:inline">Problem List</span>
            <span className="text-gray-500">/</span>
            <span className="text-sm text-gray-300">{problem.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="btn btn-sm border-0 bg-[#3a3a3a] text-gray-200 hover:bg-[#4a4a4a]"
              type="button"
              onClick={handleRunCode}
              disabled={isRunning}
            >
              {isRunning ? "Running..." : "Run"}
            </button>
            <button
              className="btn btn-sm border-0 bg-[#2ea44f] text-white hover:bg-[#24863f]"
              type="button"
              onClick={handleSubmitSolution}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="h-fit overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm lg:h-[calc(100vh-155px)] lg:overflow-y-auto">
            <div className="flex items-center gap-5 border-b border-gray-200 px-4 pt-1 text-sm">
              {["Description", "Editorial", "Solutions", "Submissions"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveLeftTab(tab)}
                  className={`border-b-2 py-3 transition ${
                    activeLeftTab === tab
                      ? "border-[#ffa116] font-semibold text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="border-b border-gray-200 px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {problem.title}
                </h1>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold capitalize text-orange-700">
                  {problem.difficulty}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {problem.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-8 p-5 sm:p-7">
              {activeLeftTab === "Description" ? (
                <>
                  <section>
                    <h2 className="mb-3 text-lg font-semibold text-gray-900">
                      Description
                    </h2>
                    <p className="whitespace-pre-line leading-7 text-gray-700">
                      {problem.description}
                    </p>
                  </section>

                  {problem.visibleTestCases && problem.visibleTestCases.length > 0 && (
                    <section>
                      <h2 className="mb-4 text-lg font-semibold text-gray-900">
                        Examples
                      </h2>

                      <div className="space-y-4">
                        {problem.visibleTestCases.map((testCase, index) => (
                          <div key={index} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <p className="mb-3 font-semibold text-gray-800">Example {index + 1}</p>
                            <p className="text-sm text-gray-600"><strong>Input:</strong> {testCase.input}</p>
                            <p className="mt-1 text-sm text-gray-600"><strong>Output:</strong> {testCase.output}</p>
                            <p className="mt-1 text-sm text-gray-600"><strong>Explanation:</strong> {testCase.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </>
              ) : (
                <div className="rounded-lg bg-gray-50 p-6 text-sm text-gray-500">
                  {activeLeftTab} content will be available soon.
                </div>
              )}

              {runResults.length > 0 && (
                <div className="mt-4 space-y-3">
                  {runResults.map((result) => (
                    <div
                      key={result.testCaseNumber}
                      className="rounded-md border border-gray-700 p-3 text-xs"
                    >
                      <p
                        className={
                          result.passed ? "text-green-400" : "text-red-400"
                        }
                      >
                        Test case #{result.testCaseNumber}: {result.passed ? "Passed" : result.status}
                      </p>
                      <p className="mt-1 text-gray-400">Input: {result.input}</p>
                      <p className="text-gray-400">
                        Expected: {result.expectedOutput}
                      </p>
                      <p className="text-gray-400">
                        Output: {result.actualOutput ?? result.error ?? "No output"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section
            className="flex min-h-[680px] flex-col overflow-hidden rounded-lg border border-[#3d3d3d] shadow-sm lg:h-[calc(100vh-155px)] lg:min-h-[650px]"
            style={{ backgroundColor: "#1e1e1e" }}
          >
            <div
              className="flex items-center justify-between border-b border-[#3d3d3d] px-4 py-2.5"
              style={{ backgroundColor: "#282828" }}
            >
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
                <div className="ml-3 flex gap-4 text-sm">
                  <span className="border-b-2 border-[#ffa116] pb-2 text-white">Code</span>
                  <span className="pb-2 text-gray-500">Testcase</span>
                </div>
              </div>

              <select
                value={selectedLanguage}
                onChange={(event) => handleLanguageChange(event.target.value)}
                className="select select-xs border-gray-600 text-gray-200"
                style={{ backgroundColor: "#1e1e1e", color: "#d4d4d4" }}
              >
                {supportedLanguages.map((language) => (
                  <option key={language.value} value={language.value}>
                    {language.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="min-h-0 flex-1" style={{ backgroundColor: "#1e1e1e" }}>
              <CodeEditor
                code={code}
                language={selectedLanguage}
                onChange={setCode}
              />
            </div>

            <div
              className="border-t border-[#3d3d3d] px-4 py-3"
              style={{ backgroundColor: "#252525" }}
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                <span className="text-green-400">›_</span>
                Test Result
              </div>

              {!submissionResult ? (
                <p className="mt-2 text-xs text-gray-500">
                  {submissionMessage || "Run or submit your code to see the result here."}
                </p>
              ) : (
                <div className="mt-3 space-y-2 text-sm">
                  <p
                    className={`font-semibold capitalize ${
                      submissionStatus === "accepted"
                        ? "text-green-400"
                        : submissionStatus === "running" || submissionStatus === "pending"
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    {submissionResult.status.replaceAll("_", " ")}
                  </p>

                  <div className="flex gap-6 text-xs text-gray-400">
                    <span>Runtime: {submissionResult.runtime ?? "-"} ms</span>
                    <span>Memory: {submissionResult.memory ?? "-"} KB</span>
                  </div>

                  {submissionResult.failedTestCaseNumber && (
                    <p className="text-xs text-orange-300">
                      Failed on test case #{submissionResult.failedTestCaseNumber}
                    </p>
                  )}

                  {submissionResult.errorMessage && (
                    <p className="text-xs text-red-300">
                      {submissionResult.errorMessage}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div
              className="flex items-center justify-between border-t border-gray-700 px-4 py-3"
              style={{ backgroundColor: "#282828" }}
            >
              <span className="text-xs text-gray-400">
                {code.length} characters
              </span>
              <button
                type="button"
                className="btn btn-sm border-0 bg-[#ffa116] px-5 text-white hover:bg-[#e89000]"
                onClick={handleSubmitSolution}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit solution"}
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default ProblemPage;
