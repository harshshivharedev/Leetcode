import { useForm } from "react-hook-form";

interface SignupFormData {
    firstName: string;
    email: string;
    username: string;
    password: string;
}

function Signup() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormData>();

    const onSubmit = (data: SignupFormData) => {
        console.log(data);
    };

    return (
        <main className="flex min-h-screen items-center justify-center">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="card w-full max-w-md bg-base-200 p-6 shadow-xl"
            >
                <h1 className="mb-6 text-2xl font-bold">
                    Create Account
                </h1>

                <input
                    {...register("firstName", {
                        required: "First name is required",
                    })}
                    className="input input-bordered mb-2 w-full"
                    placeholder="First name"
                />
                {errors.firstName && (
                    <p className="mb-2 text-error">
                        {errors.firstName.message}
                    </p>
                )}

                <input
                    {...register("username", {
                        required: "Username is required",
                    })}
                    className="input input-bordered mb-2 w-full"
                    placeholder="Username"
                />

                <input
                    {...register("email", {
                        required: "Email is required",
                    })}
                    className="input input-bordered mb-2 w-full"
                    placeholder="Email"
                    type="email"
                />

                <input
                    {...register("password", {
                        required: "Password is required",
                        minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                        },
                    })}
                    className="input input-bordered mb-4 w-full"
                    placeholder="Password"
                    type="password"
                />

                <button className="btn btn-primary w-full" type="submit">
                    Sign up
                </button>
            </form>
        </main>
    );
}

export default Signup;