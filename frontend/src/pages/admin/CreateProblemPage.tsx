import { Link } from "react-router";
import Navbar from "../../components/layout/Navbar";

function CreateProblemPage() {
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

        <form className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">
              Title
              <input
                className="input input-bordered mt-2 w-full border-gray-300 bg-white text-gray-800"
                placeholder="Two Sum"
              />
            </label>

            <label className="text-sm font-medium text-gray-700">
              Slug
              <input
                className="input input-bordered mt-2 w-full border-gray-300 bg-white text-gray-800"
                placeholder="two-sum"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-gray-700">
            Description
            <textarea
              className="textarea textarea-bordered mt-2 min-h-40 w-full border-gray-300 bg-white text-gray-800"
              placeholder="Describe the problem..."
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Difficulty
            <select className="select select-bordered mt-2 w-full border-gray-300 bg-white text-gray-800">
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
            />
            <span className="mt-1 block text-xs text-gray-500">
              Comma-separated tags.
            </span>
          </label>

          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-5">
            <h2 className="font-semibold text-gray-900">Test cases</h2>
            <p className="mt-1 text-sm text-gray-600">
              Visible and hidden test case editors will be added next.
            </p>
          </div>

          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-5">
            <h2 className="font-semibold text-gray-900">Starter code</h2>
            <p className="mt-1 text-sm text-gray-600">
              Language-wise starter code editors will be added next.
            </p>
          </div>

          <button
            type="button"
            className="btn border-0 bg-[#ffa116] text-white hover:bg-[#e89000]"
          >
            Create problem
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateProblemPage;
