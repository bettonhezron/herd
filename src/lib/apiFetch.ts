import { useAuthStore } from "@/store/authStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().token;

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    });

    // 204 No Content
    if (res.status === 204) return null as T;

    const contentType = res.headers.get("Content-Type");
    let data: any = null;
    if (contentType?.includes("application/json")) {
      data = await res.json();
    }

    // Handle 401 Unauthorized
    if (res.status === 401) {
      const { logout } = useAuthStore.getState();

      // Only log out and redirect if user is already logged in
      if (token && !endpoint.includes("/auth/login") && !endpoint.includes("/auth/signin")) {
        logout();
        window.location.href = "/signin";
        return Promise.reject(new Error("Unauthorized, logging out..."));
      }

      // For login endpoints, just throw error (don't clear form)
      throw new Error(data?.message || data?.error || "Invalid credentials");
    }

    // Handle other HTTP errors
    if (!res.ok) {
      const message = data?.message || data?.error || res.statusText || `Error: ${res.status}`;
      throw new Error(message);
    }

    return data as T;
  } catch (error: any) {
    // Network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error("Network error:", error);
      throw new Error("Unable to connect to the server. Try again later.");
    }

    // Re-throw other errors
    throw error;
  }
}
