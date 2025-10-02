import { apiFetch } from "@/lib/fetcher";
import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  User,
} from "@/types/auths";

// login
export async function login(data: LoginPayload): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// register
export async function register(
  data: RegisterPayload
): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// get logged-in user profile
export async function getMe(): Promise<User> {
  return apiFetch<User>("/auth/me");
}
