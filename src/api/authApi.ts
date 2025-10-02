import { apiFetch } from "@/lib/fetcher";
import { LoginPayload, LoginResponse, User } from "@/types/auth";

// login 
export async function login(data: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let errorDetail = "Invalid credentials";
    try {
      const errorData = await res.json();
      errorDetail = errorData.message || errorDetail;
    } catch (e) {
    }
    throw new Error(errorDetail);
  }

  return res.json();
}

// get profile
export async function getMe(): Promise<User> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  return apiFetch<User>("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}