import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import Navbar from "../../components/layout/Navbar";
import type { RootState } from "../../store/store";
import {
  deleteProblem,
  getAllProblemsForAdmin,
  updateProblemPublishStatus,
  type Problem,
} from "../../services/problem.service";

function ManageProblemsPage() {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [message, setMessage] = useState("");

  const loadProblems = async () => {
    if (!accessToken) return;
    try {
      setProblems(await getAllProblemsForAdmin(accessToken));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load problems");
    }
  };

  useEffect(() => {
    void loadProblems();
  }, [accessToken]);

  const togglePublish = async (problem: Problem) => {
    if (!accessToken) return;
    try {
      const updatedProblem = await updateProblemPublishStatus(
        problem._id,
        !problem.isPublished,
        accessToken,
      );

      setProblems((current) =>
        current.map((item) =>
          item._id === updatedProblem._id ? updatedProblem : item,
        ),
      );
      setMessage(
        updatedProblem.isPublished
          ? "Problem published successfully."
          : "Problem unpublished successfully.",
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to update problem");
    }
  };

  const removeProblem = async (problemId: string) => {
    if (!accessToken || !window.confirm("Delete this problem?")) return;
    try {
      await deleteProblem(problemId, accessToken);
      await loadProblems();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to delete problem");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#d97706]">Administration</p>
            <h1 className="mt-2 text-4xl font-bold text-gray-900">Manage Problems</h1>
          </div>
          <Link to="/admin/problems/new" className="btn bg-[#ffa116] text-white">Create problem</Link>
        </div>

        {message && <p className="mb-4 text-sm text-red-600">{message}</p>}

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="table text-gray-800">
            <thead className="bg-gray-50 text-gray-700">
              <tr><th>Title</th><th>Difficulty</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody className="bg-white">
              {problems.map((problem) => (
                <tr key={problem._id}>
                  <td><div className="font-semibold">{problem.title}</div><div className="text-xs text-gray-500">{problem.slug}</div></td>
                  <td className="capitalize">{problem.difficulty}</td>
                  <td><span className={problem.isPublished ? "text-green-600" : "text-gray-500"}>{problem.isPublished ? "Published" : "Draft"}</span></td>
                  <td className="flex gap-2">
                    <Link to={`/admin/problems/${problem._id}/edit`} className="btn btn-sm border-gray-300 bg-white text-gray-800 hover:bg-gray-100">Edit</Link>
                    <button className="btn btn-sm border-gray-300 bg-white text-gray-800 hover:bg-gray-100" onClick={() => void togglePublish(problem)}>{problem.isPublished ? "Unpublish" : "Publish"}</button>
                    <button className="btn btn-sm btn-error text-white" onClick={() => void removeProblem(problem._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!problems.length && <p className="p-6 text-gray-500">No problems found.</p>}
        </div>
      </main>
    </div>
  );
}

export default ManageProblemsPage;
