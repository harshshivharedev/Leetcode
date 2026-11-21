import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import Navbar from "../../components/layout/Navbar";
import type { RootState } from "../../store/store";
import { getAllProblemsForAdmin, updateProblem } from "../../services/problem.service";

type VisibleTestCase = { input: string; output: string; explanation: string };
type HiddenTestCase = { input: string; output: string };

function EditProblemPage() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [tags, setTags] = useState("");
  const [message, setMessage] = useState("");
  const [visibleTestCases, setVisibleTestCases] = useState<VisibleTestCase[]>([]);
  const [hiddenTestCases, setHiddenTestCases] = useState<HiddenTestCase[]>([]);

  useEffect(() => {
    const loadProblem = async () => {
      if (!accessToken || !problemId) return;
      try {
        const problems = await getAllProblemsForAdmin(accessToken);
        const problem = problems.find((item) => item._id === problemId);
        if (!problem) {
          setMessage("Problem not found");
          return;
        }
        setTitle(problem.title);
        setDescription(problem.description);
        setDifficulty(problem.difficulty);
        setTags(problem.tags.join(", "));
        setVisibleTestCases(problem.visibleTestCases ?? []);
        setHiddenTestCases(problem.hiddenTestCases ?? []);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Failed to load problem");
      }
    };
    void loadProblem();
  }, [accessToken, problemId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accessToken || !problemId) return;

    try {
      await updateProblem(problemId, {
        title: title.trim(),
        description: description.trim(),
        difficulty,
        tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        visibleTestCases,
        hiddenTestCases,
      }, accessToken);
      setMessage("Problem updated successfully.");
      setTimeout(() => navigate("/admin/problems"), 700);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to update problem");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link to="/admin/problems" className="text-sm font-medium text-[#d97706] hover:underline">← Back to problems</Link>
        <h1 className="mt-6 text-4xl font-bold text-gray-900">Edit Problem</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-700">Title
            <input value={title} onChange={(event) => setTitle(event.target.value)} className="input input-bordered mt-2 w-full border-gray-300 bg-white text-gray-800" />
          </label>
          <label className="block text-sm font-medium text-gray-700">Description
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} className="textarea textarea-bordered mt-2 min-h-40 w-full border-gray-300 bg-white text-gray-800" />
          </label>
          <label className="block text-sm font-medium text-gray-700">Difficulty
            <select value={difficulty} onChange={(event) => setDifficulty(event.target.value as typeof difficulty)} className="select select-bordered mt-2 w-full border-gray-300 bg-white text-gray-800">
              <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-gray-700">Tags
            <input value={tags} onChange={(event) => setTags(event.target.value)} className="input input-bordered mt-2 w-full border-gray-300 bg-white text-gray-800" />
          </label>
          <section className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-5">
            <h2 className="font-semibold text-gray-900">Visible test cases</h2>
            {visibleTestCases.map((testCase, index) => (
              <div key={index} className="space-y-2 rounded-lg border border-gray-200 bg-white p-4">
                <input value={testCase.input} onChange={(event) => setVisibleTestCases((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, input: event.target.value } : item))} className="input input-bordered w-full bg-white text-gray-800" placeholder="Input" />
                <input value={testCase.output} onChange={(event) => setVisibleTestCases((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, output: event.target.value } : item))} className="input input-bordered w-full bg-white text-gray-800" placeholder="Output" />
                <textarea value={testCase.explanation} onChange={(event) => setVisibleTestCases((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, explanation: event.target.value } : item))} className="textarea textarea-bordered w-full bg-white text-gray-800" placeholder="Explanation" />
                <button type="button" className="text-sm text-red-600" onClick={() => setVisibleTestCases((items) => items.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
              </div>
            ))}
            <button type="button" className="btn btn-sm bg-white text-gray-800" onClick={() => setVisibleTestCases((items) => [...items, { input: "", output: "", explanation: "" }])}>+ Add visible testcase</button>
          </section>
          <section className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-5">
            <h2 className="font-semibold text-gray-900">Hidden test cases</h2>
            {hiddenTestCases.map((testCase, index) => (
              <div key={index} className="space-y-2 rounded-lg border border-gray-200 bg-white p-4">
                <input value={testCase.input} onChange={(event) => setHiddenTestCases((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, input: event.target.value } : item))} className="input input-bordered w-full bg-white text-gray-800" placeholder="Input" />
                <input value={testCase.output} onChange={(event) => setHiddenTestCases((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, output: event.target.value } : item))} className="input input-bordered w-full bg-white text-gray-800" placeholder="Output" />
                <button type="button" className="text-sm text-red-600" onClick={() => setHiddenTestCases((items) => items.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
              </div>
            ))}
            <button type="button" className="btn btn-sm bg-white text-gray-800" onClick={() => setHiddenTestCases((items) => [...items, { input: "", output: "" }])}>+ Add hidden testcase</button>
          </section>
          <button type="submit" className="btn bg-[#ffa116] text-white hover:bg-[#e89000]">Save changes</button>
          {message && <p className="text-sm font-medium text-gray-800">{message}</p>}
        </form>
      </main>
    </div>
  );
}

export default EditProblemPage;
