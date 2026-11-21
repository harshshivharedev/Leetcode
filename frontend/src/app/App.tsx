import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import HomePage from "../pages/HomePage";
import { Routes, Route } from "react-router";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import ProblemsPage from "../pages/ProblemsPage";
import ProblemPage from "../pages/ProblemPage";
import SubmissionsPage from "../pages/SubmissionsPage";
import SubmissionDetailPage from "../pages/SubmissionDetailPage";
import ProfilePage from "../pages/ProfilePage";
import AdminPage from "../pages/AdminPage";
import AdminRoute from "../components/auth/AdminRoute";
import CreateProblemPage from "../pages/admin/CreateProblemPage";
import ManageProblemsPage from "../pages/admin/ManageProblemsPage";
import EditProblemPage from "../pages/admin/EditProblemPage";
import { refreshAccessToken, getCurrentUser } from "../services/auth.service";
import { login as loginAction } from "../store/slices/authSlice";
import type { AppDispatch } from "../store/store";
import ProtectedRoute from "../components/auth/ProtectedRoute";

function App() {
    const dispatch = useDispatch<AppDispatch>();
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const accessToken = await refreshAccessToken();
                const user = await getCurrentUser(accessToken);

                dispatch(
                    loginAction({
                        accessToken,
                        user,
                    }),
                );
            } catch {
                // No valid refresh cookie means the user is logged out.
            } finally {
                setIsInitializing(false);
            }
        };

        restoreSession();
    }, [dispatch]);

    if (isInitializing) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#f7f7f8]">
                <span className="loading loading-spinner loading-lg text-[#ffa116]" />
            </main>
        );
    }

    return (
        <>
          <Routes>
            <Route path="/" element={<HomePage></HomePage>}></Route>
            <Route path="/login" element={<Login></Login>}></Route>
            <Route path="/signup" element={<Signup></Signup>}></Route>
            <Route path="/problems" element={<ProblemsPage />} />
            <Route path="/problems/:slug" element={<ProblemPage />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/submissions" element={<SubmissionsPage />} />
                <Route path="/submissions/:submissionId" element={<SubmissionDetailPage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/admin/problems/new" element={<CreateProblemPage />} />
                    <Route path="/admin/problems" element={<ManageProblemsPage />} />
                    <Route path="/admin/problems/:problemId/edit" element={<EditProblemPage />} />
                </Route>
            </Route>

          </Routes>
        </>
    );
}

export default App;
