import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerUser } from "../services/auth.service";
import { useState } from "react";

// Signup form validation rules.
const signupSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(3, "First name must be at least 3 characters"),
  username: z.string().trim().min(3, "Username must be at least 3 characters"),
  email: z.string().trim().email("Please provide a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

interface SignupFormData {
  firstName: string;
  email: string;
  username: string;
  password: string;
}

function Signup() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setMessage("");

      await registerUser(data);

      setMessageType("success");
      setMessage("Account created successfully");
    } catch (error) {
      setMessageType("error");

      setMessage(
        error instanceof Error ? error.message : "Registration failed",
      );
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f8] px-4 py-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-[460px] rounded-xl border border-gray-200 bg-white p-8 shadow-sm"
      >
        <div className="mb-8 text-center">
          <div className="mb-4 text-3xl font-bold text-[#ffa116]">
            CodeArena
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Start practicing coding problems today.
          </p>
        </div>

        <label
          className="mb-2 block text-sm font-medium text-gray-700"
          htmlFor="firstName"
        >
          First name
        </label>
        <input
          id="firstName"
          {...register("firstName")}
          className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2.5 text-gray-800 outline-none transition focus:border-[#ffa116] focus:ring-2 focus:ring-orange-100"
          placeholder="Enter your first name"
        />
        {errors.firstName && (
          <p className="mb-2 text-error">{errors.firstName.message}</p>
        )}

        <label
          className="mb-2 mt-4 block text-sm font-medium text-gray-700"
          htmlFor="username"
        >
          Username
        </label>
        <input
          id="username"
          {...register("username")}
          className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2.5 text-gray-800 outline-none transition focus:border-[#ffa116] focus:ring-2 focus:ring-orange-100"
          placeholder="Choose a username"
        />
        {errors.username && (
          <p className="mb-2 text-error">{errors.username.message}</p>
        )}

        <label
          className="mb-2 mt-4 block text-sm font-medium text-gray-700"
          htmlFor="email"
        >
          Email
        </label>
        <input
          id="email"
          {...register("email")}
          className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2.5 text-gray-800 outline-none transition focus:border-[#ffa116] focus:ring-2 focus:ring-orange-100"
          placeholder="Enter your email"
          type="email"
        />
        {errors.email && (
          <p className="mb-2 text-error">{errors.email.message}</p>
        )}

        <label
          className="mb-2 mt-4 block text-sm font-medium text-gray-700"
          htmlFor="password"
        >
          Password
        </label>
        <input
          id="password"
          {...register("password")}
          className="mb-5 w-full rounded-md border border-gray-300 px-3 py-2.5 text-gray-800 outline-none transition focus:border-[#ffa116] focus:ring-2 focus:ring-orange-100"
          placeholder="Create a password"
          type="password"
        />
        {errors.password && (
          <p className="mb-4 text-error">{errors.password.message}</p>
        )}

        <button
          className="w-full rounded-md bg-[#ffa116] px-4 py-2.5 font-semibold text-white transition hover:bg-[#e89000]"
          type="submit"
        >
          Sign up
        </button>
        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              messageType === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a className="font-medium text-[#0a84ff]" href="/login">
            Log in
          </a>
        </p>
      </form>
    </main>
  );
}

export default Signup;
