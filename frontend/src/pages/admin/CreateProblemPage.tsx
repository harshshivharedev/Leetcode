import { Link } from "react-router";
import { useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../../components/layout/Navbar";
import { createProblem } from "../../services/problem.service";
import type { RootState } from "../../store/store";

interface VisibleTestCase {
  input: string;
  output: string;
  explanation: string;
}

interface HiddenTestCase {
  input: string;
  output: string;
}

interface StarterCode {
  language: string;
  initialCode: string;
}

interface ReferenceSolution {
  language: string;
  completeCode: string;
}

function CreateProblemPage() {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [visibleTestCases, setVisibleTestCases] = useState<VisibleTestCase[]>([
    { input: "", output: "", explanation: "" },
  ]);
  const [hiddenTestCases, setHiddenTestCases] = useState<HiddenTestCase[]>([
    { input: "", output: "" },
  ]);
  const [starterCodes, setStarterCodes] = useState<StarterCode[]>([
    { language: "javascript", initialCode: "" },
  ]);
  const [referenceSolutions, setReferenceSolutions] = useState<
    ReferenceSolution[]
  >([{ language: "javascript", completeCode: "" }]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [tags, setTags] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateVisibleTestCase = (
    index: number,
    field: keyof VisibleTestCase,
    value: string,
  ) => {
    setVisibleTestCases((current) =>
      current.map((testCase, testCaseIndex) =>
        testCaseIndex === index
          ? { ...testCase, [field]: value }
          : testCase,
      ),
    );
  };

  const updateHiddenTestCase = (
    index: number,
    field: keyof HiddenTestCase,
    value: string,
  ) => {
    setHiddenTestCases((current) =>
      current.map((testCase, testCaseIndex) =>
        testCaseIndex === index
          ? { ...testCase, [field]: value }
          : testCase,
      ),
    );
  };

  const updateStarterCode = (
    index: number,
    field: keyof StarterCode,
    value: string,
  ) => {
    setStarterCodes((current) =>
      current.map((starterCode, starterCodeIndex) =>
        starterCodeIndex === index
          ? { ...starterCode, [field]: value }
          : starterCode,
      ),
    );
  };

  const updateReferenceSolution = (
    index: number,
    field: keyof ReferenceSolution,
    value: string,
  ) => {
    setReferenceSolutions((current) =>
      current.map((solution, solutionIndex) =>
        solutionIndex === index ? { ...solution, [field]: value } : solution,
      ),
    );
  };
  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          to="/admin"
          className="text-sm font-medium text-[#d97706] hover:underline"
        >
          ← Back to dashboard
        </Link>

        <div className="mb-8 mt-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#d97706]">
            Administration
          </p>
          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Create Problem
          </h1>
          <p className="mt-3 text-gray-600">
            Add a new coding challenge to CodeArena.
          </p>
        </div>

        <form
          onSubmit={async (event) => {
            event.preventDefault();
            setFormMessage("");
            const problemPayload = {
              title: title.trim(),
              slug: slug.trim(),
              description: description.trim(),
              difficulty,
              tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
              visibleTestCases,
              hiddenTestCases,
              starterCode: starterCodes,
              referenceSolution: referenceSolutions,
            };

            const invalidVisibleCase = visibleTestCases.some(
              (testCase) => !testCase.input.trim() || !testCase.output.trim() || !testCase.explanation.trim(),
            );
            const invalidHiddenCase = hiddenTestCases.some(
              (testCase) => !testCase.input.trim() || !testCase.output.trim(),
            );
            const invalidStarterCode = starterCodes.some(
              (starterCode) => !starterCode.initialCode.trim(),
            );
            const invalidReferenceSolution = referenceSolutions.some(
              (solution) => !solution.completeCode.trim(),
            );

            if (
              title.trim().length < 3 ||
              slug.trim().length < 3 ||
              description.trim().length < 10 ||
              problemPayload.tags.length === 0 ||
              invalidVisibleCase ||
              invalidHiddenCase ||
              invalidStarterCode ||
              invalidReferenceSolution
            ) {
              setFormMessage("Please complete all required fields.");
              return;
            }

            if (!accessToken) {
              setFormMessage("Authentication required. Please log in again.");
              return;
            }

            try {
              setIsSubmitting(true);
              await createProblem(problemPayload, accessToken);
              setFormMessage("Problem created successfully.");
            } catch (error) {
              setFormMessage(
                error instanceof Error ? error.message : "Failed to create problem",
              );
            } finally {
              setIsSubmitting(false);
            }
          }}
          className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">
              Title
              <input
                className="input input-bordered mt-2 w-full border-gray-300 bg-white text-gray-800"
                placeholder="Two Sum"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>

            <label className="text-sm font-medium text-gray-700">
              Slug
              <input
                className="input input-bordered mt-2 w-full border-gray-300 bg-white text-gray-800"
                placeholder="two-sum"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-gray-700">
            Description
            <textarea
              className="textarea textarea-bordered mt-2 min-h-40 w-full border-gray-300 bg-white text-gray-800"
              placeholder="Describe the problem..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Difficulty
            <select
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value as "easy" | "medium" | "hard")}
              className="select select-bordered mt-2 w-full border-gray-300 bg-white text-gray-800"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Tags
            <input
              className="input input-bordered mt-2 w-full border-gray-300 bg-white text-gray-800"
              placeholder="array, hashmap, string"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
            />
            <span className="mt-1 block text-xs text-gray-500">
              Comma-separated tags.
            </span>
          </label>

          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-5">
            <h2 className="font-semibold text-gray-900">Test cases</h2>

            <div className="mt-5 space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  Visible test cases
                </h3>

                <div className="mt-3 space-y-4">
                  {visibleTestCases.map((testCase, index) => (
                    <div key={index} className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-700">
                          Example {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => setVisibleTestCases((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                          disabled={visibleTestCases.length === 1}
                          className="text-xs font-medium text-red-600 disabled:text-gray-400"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-3">
                        <input
                          value={testCase.input}
                          onChange={(event) => updateVisibleTestCase(index, "input", event.target.value)}
                          className="input input-bordered w-full border-gray-300 bg-white text-gray-800"
                          placeholder="Input"
                        />
                        <input
                          value={testCase.output}
                          onChange={(event) => updateVisibleTestCase(index, "output", event.target.value)}
                          className="input input-bordered w-full border-gray-300 bg-white text-gray-800"
                          placeholder="Output"
                        />
                        <textarea
                          value={testCase.explanation}
                          onChange={(event) => updateVisibleTestCase(index, "explanation", event.target.value)}
                          className="textarea textarea-bordered w-full border-gray-300 bg-white text-gray-800"
                          placeholder="Explanation"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setVisibleTestCases((current) => [...current, { input: "", output: "", explanation: "" }])}
                  className="btn btn-sm mt-3 border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                >
                  + Add visible testcase
                </button>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  Hidden test cases
                </h3>

                <div className="mt-3 space-y-4">
                  {hiddenTestCases.map((testCase, index) => (
                    <div key={index} className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-700">
                          Hidden case {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => setHiddenTestCases((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                          disabled={hiddenTestCases.length === 1}
                          className="text-xs font-medium text-red-600 disabled:text-gray-400"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <input
                          value={testCase.input}
                          onChange={(event) => updateHiddenTestCase(index, "input", event.target.value)}
                          className="input input-bordered w-full border-gray-300 bg-white text-gray-800"
                          placeholder="Input"
                        />
                        <input
                          value={testCase.output}
                          onChange={(event) => updateHiddenTestCase(index, "output", event.target.value)}
                          className="input input-bordered w-full border-gray-300 bg-white text-gray-800"
                          placeholder="Output"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setHiddenTestCases((current) => [...current, { input: "", output: "" }])}
                  className="btn btn-sm mt-3 border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                >
                  + Add hidden testcase
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-5">
            <h2 className="font-semibold text-gray-900">Starter code</h2>
            <p className="mt-1 text-sm text-gray-600">
              Add the initial code users will see for each language.
            </p>

            <div className="mt-5 space-y-4">
              {starterCodes.map((starterCode, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-white p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">
                      Language {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setStarterCodes((current) =>
                          current.filter((_, itemIndex) => itemIndex !== index),
                        )
                      }
                      disabled={starterCodes.length === 1}
                      className="text-xs font-medium text-red-600 disabled:text-gray-400"
                    >
                      Remove
                    </button>
                  </div>

                  <select
                    value={starterCode.language}
                    onChange={(event) =>
                      updateStarterCode(index, "language", event.target.value)
                    }
                    className="select select-bordered w-full border-gray-300 bg-white text-gray-800"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                  </select>

                  <textarea
                    value={starterCode.initialCode}
                    onChange={(event) =>
                      updateStarterCode(
                        index,
                        "initialCode",
                        event.target.value,
                      )
                    }
                    className="textarea textarea-bordered mt-3 min-h-40 w-full border-gray-300 bg-[#1e1e1e] font-mono text-sm text-gray-100"
                    placeholder="Write starter code..."
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                setStarterCodes((current) => [
                  ...current,
                  { language: "python", initialCode: "" },
                ])
              }
              className="btn btn-sm mt-3 border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
            >
              + Add language
            </button>
          </div>

          <div className="rounded-lg border border-dashed border-red-200 bg-red-50 p-5">
            <h2 className="font-semibold text-gray-900">Reference solution</h2>
            <p className="mt-1 text-sm text-gray-600">
              Private solution used by the judge to validate submissions.
            </p>

            <div className="mt-5 space-y-4">
              {referenceSolutions.map((solution, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-red-100 bg-white p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">
                      Solution {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setReferenceSolutions((current) =>
                          current.filter((_, itemIndex) => itemIndex !== index),
                        )
                      }
                      disabled={referenceSolutions.length === 1}
                      className="text-xs font-medium text-red-600 disabled:text-gray-400"
                    >
                      Remove
                    </button>
                  </div>

                  <select
                    value={solution.language}
                    onChange={(event) =>
                      updateReferenceSolution(index, "language", event.target.value)
                    }
                    className="select select-bordered w-full border-gray-300 bg-white text-gray-800"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                  </select>

                  <textarea
                    value={solution.completeCode}
                    onChange={(event) =>
                      updateReferenceSolution(index, "completeCode", event.target.value)
                    }
                    className="textarea textarea-bordered mt-3 min-h-48 w-full border-gray-300 bg-[#1e1e1e] font-mono text-sm text-gray-100"
                    placeholder="Write the trusted reference solution..."
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                setReferenceSolutions((current) => [
                  ...current,
                  { language: "python", completeCode: "" },
                ])
              }
              className="btn btn-sm mt-3 border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
            >
              + Add solution language
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn border-0 bg-[#ffa116] text-white hover:bg-[#e89000]"
          >
            {isSubmitting ? "Creating..." : "Create problem"}
          </button>

          {formMessage && (
            <p className="text-sm font-medium text-gray-800">{formMessage}</p>
          )}
        </form>
      </main>
    </div>
  );
}

export default CreateProblemPage;
