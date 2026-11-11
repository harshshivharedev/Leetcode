import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Navbar from "../components/layout/Navbar";
import {
  getProblemBySlug,
  type Problem,
} from "../services/problem.service";

function ProblemPage() {
  const { slug } = useParams<{ slug: string }>();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
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

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-3xl font-bold text-gray-900">
              {problem.title}
            </h1>

            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold capitalize text-orange-700">
              {problem.difficulty}
            </span>
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            {problem.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>

          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            Description
          </h2>

          <p className="whitespace-pre-line leading-8 text-gray-700">
            {problem.description}
          </p>

          {problem.visibleTestCases && problem.visibleTestCases.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Examples
              </h2>

              <div className="space-y-4">
                {problem.visibleTestCases.map((testCase, index) => (
                  <div
                    key={index}
                    className="rounded-lg bg-gray-50 p-4"
                  >
                    <p className="font-semibold text-gray-800">
                      Example {index + 1}
                    </p>

                    <p className="mt-2 text-sm text-gray-600">
                      <strong>Input:</strong> {testCase.input}
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      <strong>Output:</strong> {testCase.output}
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      <strong>Explanation:</strong> {testCase.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default ProblemPage;
