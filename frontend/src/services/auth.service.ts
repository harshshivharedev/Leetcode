

export interface RegisterPayload {
    firstName: string;
    username: string;
    email: string;
    password: string;
}

const API_BASE_URL = "http://localhost:5000/api/v1";
export const registerUser = async(data: RegisterPayload) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    const result = await response.json();

    if(!response.ok) {
        throw new Error(result.message || "Registration failed");
    }

    return result;
}

export interface LoginPayload {
    email?: string;
    username?: string;
    password: string;
}

export const loginUser = async (data: LoginPayload)=> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data)
    })
    const result = await response.json();

    if(!response.ok) {
        throw new Error(result.message || "Login failed");
    }

    return result;
}