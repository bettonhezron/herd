import { create } from "zustand";
import { getMe } from "@/api/authApi"; 

interface AuthState {
  user: any | null;
  token: string | null;
  login: (user: any, token: string) => void;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  login: (user, token) => {
    localStorage.setItem("token", token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

  initialize: async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const user = await getMe(); 
      set({ user, token });
    } catch (err) {
      console.error("Failed to rehydrate user", err);
      localStorage.removeItem("token");
      set({ user: null, token: null });
    }
  },
}));
