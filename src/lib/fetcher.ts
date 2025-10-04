import { useAuthStore } from "@/store/authStore"; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
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

    // handle network-level errors 
    if (!res.ok) {
      let errorMessage = `API error: ${res.status}`;
      let errorData: any = null;
      try {
        errorData = await res.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
      }

      // Only log out if token is invalid or expired 
      if (
        res.status === 401 &&
        (errorData?.message?.toLowerCase().includes("token") ||
         errorData?.message?.toLowerCase().includes("expired") ||
         errorData?.message?.toLowerCase().includes("invalid"))
      ) {
        const { logout } = useAuthStore.getState();
        logout();
        window.location.href = "/login";
      }

      throw new Error(errorMessage);
    }

    // no content
    if (res.status === 204) {
      return null as T;
    }

    return res.json();
  } catch (error: any) {
    // handle network issues (like "failed to fetch")
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error("Network error or server unreachable:", error);
      throw new Error("Unable to connect to the server. Please try again later.");
    }

    throw error;
  }
}
