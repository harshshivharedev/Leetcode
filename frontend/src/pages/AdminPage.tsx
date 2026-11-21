import { Link } from "react-router";
import { useSelector } from "react-redux";
import Navbar from "../components/layout/Navbar";
import type { RootState } from "../store/store";

function AdminPage() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#d97706]">
            Administration
          </p>
          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="mt-3 text-gray-600">
            Welcome back, {user?.username}. Manage CodeArena from here.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Link
            to="/admin/problems/new"
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-orange-100 text-xl text-[#d97706]">
              +
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Create problem
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Add a new coding problem with test cases and starter code.
            </p>
          </Link>

          <Link
            to="/problems"
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-xl text-blue-600">
              ◈
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Manage problems
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Review, edit, publish, or remove existing problems.
            </p>
          </Link>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-green-100 text-xl text-green-600">
              ✓
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Platform status
            </h2>
            <p className="mt-2 text-sm leading-6 text-green-600">
              All core services are operational.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminPage;
