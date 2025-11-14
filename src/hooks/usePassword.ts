import { useMutation } from "@tanstack/react-query";
import {
  requestPasswordReset,
  verifyPasswordResetCode,
  resetPassword,
} from "@/api/passwordApi";
import {
  ResetPasswordRequest,
  VerifyCodeRequest,
  ResetPasswordAfterVerifyRequest,
} from "@/types/password";

// Step 1: Request OTP
export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: (payload: ResetPasswordRequest) =>
      requestPasswordReset(payload),
  });
};

// Step 2: Verify OTP
export const useVerifyPasswordResetCode = () => {
  return useMutation({
    mutationFn: (payload: VerifyCodeRequest) =>
      verifyPasswordResetCode(payload),
  });
};

// Step 3: Reset password after verification
export const useResetPassword = () => {
  return useMutation({
    mutationFn: (payload: ResetPasswordAfterVerifyRequest) =>
      resetPassword(payload),
  });
};
