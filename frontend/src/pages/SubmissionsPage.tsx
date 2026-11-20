import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import Navbar from "../components/layout/Navbar";
import type { RootState } from "../store/store";
import {
  getMySubmissions,
  type SubmissionPagination,
  type SubmissionResult,
} from "../services/submission.service";

const statuses = [
  "all",
  "accepted",
  "wrong_answer",
  "runtime_error",
  "time_limit_exceeded",
  "pending",
  "running",
];

function SubmissionsPage() {
  const accessToken = useSelector(
    (state: RootState) => state.auth.accessToken,
  );
  const [submissions, setSubmissions] = useState<SubmissionResult[]>([]);
  const [pagination, setPagination] = useState<SubmissionPagination | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSubmissions = async () => {
      if (!accessToken) {
        setError("Please login to view your submissions.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const result = await getMySubmissions(
          accessToken,
          page,
          10,
          selectedStatus === "all" ? undefined : selectedStatus,
        );

        setSubmissions(result.submissions);
        setPagination(result.pagination);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Failed to load submissions",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadSubmissions();
  }, [accessToken, page, selectedStatus]);

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#d97706]">
              Activity
            </p>
            <h1 className="text-4xl font-bold text-gray-900">
              My Submissions
            </h1>
            <p className="mt-3 text-gray-600">
              Review your attempts and track your progress.
            </p>
          </div>

          <select
            value={selectedStatus}
            onChange={(event) => handleStatusChange(event.target.value)}
            className="select select-bordered w-full border-gray-300 bg-white text-gray-800 sm:w-52"
          >
            {statuses.map((status) => (
              <option className="bg-white text-gray-800" key={status} value={status}>
                {status === "all" ? "All statuses" : status.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-[#ffa116]" />
          </div>
        )}

        {!isLoading && error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {!isLoading && !error && submissions.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              No submissions found
            </h2>
            <p className="mt-2 text-gray-600">
              Submit a solution to see it here.
            </p>
          </div>
        )}

        {!isLoading && !error && submissions.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="hidden grid-cols-[1fr_150px_130px_130px] gap-4 border-b border-gray-200 bg-gray-50 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 md:grid">
              <span>Submission</span>
              <span>Status</span>
              <span>Runtime</span>
              <span>Memory</span>
            </div>

            {submissions.map((submission) => (
              <Link
                key={submission._id}
                to={`/submissions/${submission._id}`}
                className="grid gap-3 border-b border-gray-100 px-5 py-5 transition last:border-b-0 hover:bg-orange-50 md:grid-cols-[1fr_150px_130px_130px] md:items-center md:gap-4"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    Submission #{submission._id.slice(-6)}
                  </p>
                  <p className="mt-1 text-sm capitalize text-gray-500">
                    {submission.language} · {new Date(submission.createdAt).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                    submission.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : submission.status === "pending" || submission.status === "running"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {submission.status.replaceAll("_", " ")}
                </span>

                <span className="text-sm text-gray-600">
                  {submission.runtime ?? "-"} ms
                </span>

                <span className="text-sm text-gray-600">
                  {submission.memory ?? "-"} KB
                </span>
              </Link>
            ))}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              className="btn btn-sm border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((currentPage) => currentPage - 1)}
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              className="btn btn-sm border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
              disabled={page >= pagination.totalPages || isLoading}
              onClick={() => setPage((currentPage) => currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default SubmissionsPage;
