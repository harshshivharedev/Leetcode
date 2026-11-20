import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useSelector } from "react-redux";
import Navbar from "../components/layout/Navbar";
import type { RootState } from "../store/store";
import {
  getSubmissionById,
  type SubmissionResult,
} from "../services/submission.service";

function SubmissionDetailPage() {
  const { submissionId } = useParams<{ submissionId: string }>();
  const accessToken = useSelector(
    (state: RootState) => state.auth.accessToken,
  );
  const [submission, setSubmission] = useState<SubmissionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSubmission = async () => {
      if (!submissionId || !accessToken) {
        setError("Please login to view this submission.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await getSubmissionById(submissionId, accessToken);
        setSubmission(data);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Failed to load submission",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadSubmission();
  }, [submissionId, accessToken]);

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          to="/submissions"
          className="text-sm font-medium text-[#d97706] hover:underline"
        >
          ← Back to submissions
        </Link>

        {isLoading && (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-[#ffa116]" />
          </div>
        )}

        {!isLoading && error && (
          <div className="alert alert-error mt-8">
            <span>{error}</span>
          </div>
        )}

        {!isLoading && !error && submission && (
          <div className="mt-8 space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Submission</p>
                  <h1 className="mt-1 text-2xl font-bold text-gray-900">
                    #{submission._id}
                  </h1>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${
                    submission.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : submission.status === "pending" || submission.status === "running"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {submission.status.replaceAll("_", " ")}
                </span>
              </div>

              <div className="mt-6 grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Language</p>
                  <p className="mt-1 font-medium capitalize text-gray-900">{submission.language}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Runtime</p>
                  <p className="mt-1 font-medium text-gray-900">{submission.runtime ?? "-"} ms</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Memory</p>
                  <p className="mt-1 font-medium text-gray-900">{submission.memory ?? "-"} KB</p>
                </div>
              </div>
            </div>

            {submission.failedTestCaseNumber && (
              <div className="rounded-xl border border-orange-200 bg-orange-50 p-5 text-orange-800">
                Failed on test case #{submission.failedTestCaseNumber}
              </div>
            )}

            {submission.errorMessage && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
                {submission.errorMessage}
              </div>
            )}

            <section className="overflow-hidden rounded-xl border border-gray-800 bg-[#1e1e1e] shadow-sm">
              <div className="border-b border-gray-700 bg-[#282828] px-5 py-3 text-sm font-medium text-gray-300">
                Submitted code
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-sm leading-7 text-gray-200">
                <code>{submission.code}</code>
              </pre>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default SubmissionDetailPage;
