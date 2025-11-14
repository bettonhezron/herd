import { apiFetch } from "@/lib/apiFetch";
import { LoginPayload, LoginResponse, RegisterPayload, User } from "@/types/auths";

export const login = (payload: LoginPayload): Promise<LoginResponse> =>
  apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const register = (payload: RegisterPayload): Promise<LoginResponse> =>
  apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getMe = (): Promise<User> =>
  apiFetch("/auth/me");
