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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

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

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesDifficulty =
      selectedDifficulty === "all" ||
      problem.difficulty === selectedDifficulty;

    return matchesSearch && matchesDifficulty;
  });

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
        <h1 className="text-4xl font-bold text-gray-900">
          Coding Problems
        </h1>

        <p className="mt-3 text-gray-600">
          Sharpen your problem-solving skills with curated challenges.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search problems..."
            className="input input-bordered w-full border-gray-300 bg-white text-gray-800 placeholder:text-gray-400 sm:max-w-md"
          />

          <select
            value={selectedDifficulty}
            onChange={(event) => setSelectedDifficulty(event.target.value)}
            className="select select-bordered w-full border-gray-300 bg-white text-gray-800 sm:w-48"
          >
            <option value="all">All difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {filteredProblems.length === 0 ? (
          <div className="mt-10 rounded-xl border border-gray-200 bg-white p-10 text-center">
            No matching problems found.
          </div>
        ) : (
          <div className="mt-10 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {filteredProblems.map((problem, index) => (
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

                <span className="text-sm font-semibold capitalize text-gray-700">
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
