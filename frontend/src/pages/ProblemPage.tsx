
import { useEffect, useState } from "react";
import { Link } from "react-router";
import Navbar from "../components/layout/Navbar";
import {
  getPublishedProblems,
  type Problem,
} from "../services/problem.service";

function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProblems = async () => {
      try {
        const data = await getPublishedProblems();
        setProblems(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load problems",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProblems();
  }, []);

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

  if (error) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center bg-[#f7f7f8] px-4">
          <div className="alert alert-error max-w-md">
            <span>{error}</span>
          </div>
        </main>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#d97706]">
            Practice
          </p>

          <h1 className="text-4xl font-bold text-gray-900">
            Coding Problems
          </h1>

          <p className="mt-3 text-gray-600">
            Sharpen your problem-solving skills with curated challenges.
          </p>
        </div>

        {problems.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              No problems available
            </h2>

            <p className="mt-2 text-gray-600">
              Published problems will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {problems.map((problem, index) => (
              <Link
                key={problem._id}
                to={`/problems/${problem.slug}`}
                className="flex flex-col gap-4 border-b border-gray-100 p-5 transition last:border-b-0 hover:bg-orange-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <span className="w-7 pt-1 text-sm text-gray-400">
                    {index + 1}
                  </span>

                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {problem.title}
                    </h2>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {problem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-sm font-semibold capitalize ${
                    problem.difficulty === "easy"
                      ? "text-green-600"
                      : problem.difficulty === "medium"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {problem.difficulty}
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default ProblemsPage;