import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginUser } from "../services/auth.service";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { login as loginAction } from "../store/slices/authSlice";
import { useNavigate } from "react-router";

const loginSchema = z.object({
  emailOrUsername: z
    .string()
    .trim()
    .min(3, "Email or username is required"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

interface LoginFormData {
  emailOrUsername: string;
  password: string;
}

function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState<"success" | "error">("success");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setMessage("");

      const loginData = data.emailOrUsername.includes("@")
        ? {
            email: data.emailOrUsername,
            password: data.password,
          }
        : {
            username: data.emailOrUsername,
            password: data.password,
          };

      const result = await loginUser(loginData);

      dispatch(
        loginAction({
          user: result.data.user,
          accessToken: result.data.accessToken,
        }),
      );

      navigate("/");

      setMessageType("success");
      setMessage("Login successful");
    } catch (error) {
      setMessageType("error");

      setMessage(
        error instanceof Error ? error.message : "Login failed",
      );
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f8] px-4 py-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-115 rounded-xl border border-gray-200 bg-white p-8 shadow-sm"
      >
        <div className="mb-8 text-center">
          <div className="mb-4 text-3xl font-bold text-[#ffa116]">
            CodeArena
          </div>

          <h1 className="text-2xl font-semibold text-gray-800">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Log in to continue solving problems.
          </p>
        </div>

        <label
          className="mb-2 block text-sm font-medium text-gray-700"
          htmlFor="emailOrUsername"
        >
          Email or username
        </label>

        <input
          id="emailOrUsername"
          {...register("emailOrUsername")}
          className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2.5 text-gray-800 outline-none transition focus:border-[#ffa116] focus:ring-2 focus:ring-orange-100"
          placeholder="Enter email or username"
        />

        {errors.emailOrUsername && (
          <p className="mb-4 text-sm text-red-600">
            {errors.emailOrUsername.message}
          </p>
        )}

        <label
          className="mb-2 block text-sm font-medium text-gray-700"
          htmlFor="password"
        >
          Password
        </label>

        <input
          id="password"
          type="password"
          {...register("password")}
          className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2.5 text-gray-800 outline-none transition focus:border-[#ffa116] focus:ring-2 focus:ring-orange-100"
          placeholder="Enter your password"
        />

        {errors.password && (
          <p className="mb-5 text-sm text-red-600">
            {errors.password.message}
          </p>
        )}

        <button
          className="w-full rounded-md bg-[#ffa116] px-4 py-2.5 font-semibold text-white transition hover:bg-[#e89000]"
          type="submit"
        >
          Log in
        </button>

        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              messageType === "success"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <a className="font-medium text-[#0a84ff]" href="/signup">
            Sign up
          </a>
        </p>
      </form>
    </main>
  );
}

export default Login;
