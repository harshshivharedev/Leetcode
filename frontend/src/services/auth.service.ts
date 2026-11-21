

export interface RegisterPayload {
    firstName: string;
    username: string;
    email: string;
    password: string;
}

import { API_BASE_URL } from "../config/api";
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

export const logoutUser = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Logout failed");
    }

    return result;
};

export const refreshAccessToken = async (): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Session expired");
    }

    return result.data.accessToken;
};

export const getCurrentUser = async (accessToken: string) => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to fetch current user");
    }

    return result.data;
};

export interface UpdateProfilePayload {
    firstName?: string;
    lastName?: string;
    username?: string;
    age?: number;
}

export const updateProfile = async (
    data: UpdateProfilePayload,
    accessToken: string,
) => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to update profile");
    }

    return result.data;
};
