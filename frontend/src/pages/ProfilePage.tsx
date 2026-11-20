import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import Navbar from "../components/layout/Navbar";
import { getCurrentUser } from "../services/auth.service";
import type { RootState } from "../store/store";

interface ProfileUser {
  _id: string;
  firstName: string;
  lastName?: string;
  username: string;
  email: string;
  role: "user" | "admin";
  problemsSolved?: string[];
  createdAt: string;
}

function ProfilePage() {
  const accessToken = useSelector(
    (state: RootState) => state.auth.accessToken,
  );
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      if (!accessToken) {
        setError("Please login to view your profile.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser(accessToken);
        setUser(data);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Failed to load profile",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [accessToken]);

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#d97706]">
            Account
          </p>
          <h1 className="mt-2 text-4xl font-bold text-gray-900">My Profile</h1>
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

        {!isLoading && !error && user && (
          <div className="space-y-6">
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-3xl font-bold text-[#d97706]">
                  {user.firstName.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user.firstName} {user.lastName ?? ""}
                  </h2>
                  <p className="text-gray-500">@{user.username}</p>
                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm capitalize text-gray-600 sm:ml-auto">
                  {user.role}
                </span>
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Email</p>
                <p className="mt-2 font-medium text-gray-900">{user.email}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Problems solved</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {user.problemsSolved?.length ?? 0}
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:col-span-2">
                <p className="text-sm text-gray-500">Member since</p>
                <p className="mt-2 font-medium text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </section>

            <Link
              to="/submissions"
              className="btn border-0 bg-[#ffa116] text-white hover:bg-[#e89000]"
            >
              View my submissions
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProfilePage;
