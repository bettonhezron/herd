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

    if (!res.ok) {
      let errorData: any = null;
      
      try {
        errorData = await res.json();
      } catch {
        // If response is not JSON, use status text
        throw new Error(`Request failed: ${res.statusText}`);
      }

      // Extract user-friendly message
      const errorMessage = errorData?.message || `Error: ${res.status}`;

      // Handle authentication errors
      if (res.status === 401) {
        const { logout } = useAuthStore.getState();
        logout();
        
        // Don't redirect if this is already a login attempt
        if (!endpoint.includes('/login')) {
          window.location.href = "/login";
        }
      }

      throw new Error(errorMessage);
    }

    if (res.status === 204) {
      return null as T;
    }

    return res.json();
  } catch (error: any) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error("Network error:", error);
      throw new Error("Unable to connect to the server. Please check your internet connection.");
    }
    throw error;
  }
}