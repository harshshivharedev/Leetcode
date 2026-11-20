import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/layout/Navbar";
import {
  getCurrentUser,
  updateProfile,
  type UpdateProfilePayload,
} from "../services/auth.service";
import { updateUser } from "../store/slices/authSlice";
import type { AppDispatch, RootState } from "../store/store";

interface ProfileUser {
  _id: string;
  firstName: string;
  lastName?: string;
  username: string;
  email: string;
  age?: number;
  role: "user" | "admin";
  problemsSolved?: string[];
  createdAt: string;
}

function ProfilePage() {
  const accessToken = useSelector(
    (state: RootState) => state.auth.accessToken,
  );
  const dispatch = useDispatch<AppDispatch>();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState<UpdateProfilePayload>({});

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
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName ?? "",
          username: data.username,
          age: data.age,
        });
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

  const handleInputChange = (field: keyof UpdateProfilePayload, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: field === "age" ? (value ? Number(value) : undefined) : value,
    }));
  };

  const handleProfileUpdate = async () => {
    if (!accessToken) return;

    try {
      setIsSaving(true);
      setMessage("");

      const updatedUser = await updateProfile(formData, accessToken);
      setUser(updatedUser);
      dispatch(updateUser(updatedUser));
      setIsEditing(false);
      setMessage("Profile updated successfully");
    } catch (updateError) {
      setMessage(
        updateError instanceof Error
          ? updateError.message
          : "Failed to update profile",
      );
    } finally {
      setIsSaving(false);
    }
  };

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

              <button
                type="button"
                onClick={() => setIsEditing((current) => !current)}
                className="btn btn-sm mt-6 border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
              >
                {isEditing ? "Cancel" : "Edit profile"}
              </button>
            </section>

            {isEditing && (
              <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900">
                  Edit profile
                </h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {(["firstName", "lastName", "username", "age"] as const).map((field) => (
                    <label key={field} className="text-sm font-medium capitalize text-gray-700">
                      {field}
                      <input
                        value={formData[field] ?? ""}
                        onChange={(event) => handleInputChange(field, event.target.value)}
                        type={field === "age" ? "number" : "text"}
                        className="input input-bordered mt-2 w-full border-gray-300 bg-white text-gray-800"
                      />
                    </label>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleProfileUpdate}
                  disabled={isSaving}
                  className="btn mt-5 border-0 bg-[#ffa116] text-white hover:bg-[#e89000]"
                >
                  {isSaving ? "Saving..." : "Save changes"}
                </button>
              </section>
            )}

            {message && (
              <p className="text-sm font-medium text-green-600">{message}</p>
            )}

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
