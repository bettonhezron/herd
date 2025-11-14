// Step 1: Request password reset
export interface ResetPasswordRequest {
    email: string;
  }
  
  // Step 2: Verify OTP
  export interface VerifyCodeRequest {
    email: string;
    code: string;
  }
  
  // Step 3: Reset password after verification
  export interface ResetPasswordAfterVerifyRequest {
    email: string;
    newPassword: string;
  }
  