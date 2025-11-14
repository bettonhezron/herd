import { apiFetch } from "@/lib/apiFetch";
import {
  ResetPasswordRequest,
  VerifyCodeRequest,
  ResetPasswordAfterVerifyRequest,
} from "@/types/password";

// Step 1: Request password reset code
export async function requestPasswordReset(
  data: ResetPasswordRequest
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/password/reset/request", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Step 2: Verify code
export async function verifyPasswordResetCode(
  data: VerifyCodeRequest
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/password/reset/verify-code", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Step 3: Reset password after verification
export async function resetPassword(
  data: ResetPasswordAfterVerifyRequest
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/password/reset", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
