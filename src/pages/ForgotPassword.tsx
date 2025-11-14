import React, { useState, useEffect } from "react";
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { MdMarkEmailRead } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  useRequestPasswordReset,
  useVerifyPasswordResetCode,
  useResetPassword,
} from "@/hooks/usePassword";

type Step = "email" | "verify" | "reset" | "success";

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();

  const requestReset = useRequestPasswordReset();
  const verifyResetCode = useVerifyPasswordResetCode();
  const resetPasswordMutation = useResetPassword();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Step 1: Send OTP
  const handleSendCode = async (e: React.MouseEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      await requestReset.mutateAsync({ email });
      setIsLoading(false);
      setStep("verify");
      setTimer(60);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.response?.data?.error || "Failed to send verification code");
    }
  };

  // Step 2: Verify OTP
  const handleVerifyCode = async (e: React.MouseEvent) => {
    e.preventDefault();
    setError("");

    if (!code || code.length !== 6) {
      setError("Please enter the 6-digit verification code");
      return;
    }

    setIsLoading(true);
    try {
      await verifyResetCode.mutateAsync({ email, code });
      setIsLoading(false);
      setStep("reset");
    } catch (err: any) {
      setIsLoading(false);
      setError(err.response?.data?.error || "Incorrect verification code");
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    setError("");

    if (!newPassword || newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await resetPasswordMutation.mutateAsync({ email, newPassword });
      setIsLoading(false);
      setStep("success");
    } catch (err: any) {
      setIsLoading(false);
      setError(err.response?.data?.error || "Failed to reset password");
    }
  };

  const handleResendCode = async () => {
    if (timer > 0) return;
    setCode("");
    setError("");
    setIsLoading(true);
    try {
      await requestReset.mutateAsync({ email });
      setIsLoading(false);
      setTimer(60);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.response?.data?.error || "Failed to resend code");
    }
  };

  const handleBack = () => {
    if (step === "email") navigate("/signin");
    else setStep("email");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-green-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-left">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {step === "email" ? "Back to Sign In" : "Back"}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8 space-y-6">
          {/* Icon and header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto bg-green-600 rounded-full flex items-center justify-center shadow-lg">
              {step === "success" ? (
                <CheckCircle className="w-10 h-10 text-white" />
              ) : step === "reset" ? (
                <Lock className="w-10 h-10 text-white" />
              ) : (
                <MdMarkEmailRead className="w-10 h-10 text-white" />
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              {step === "email" && "Forgot Password?"}
              {step === "verify" && "Verify Code"}
              {step === "reset" && "Reset Password"}
              {step === "success" && "Success!"}
            </h2>
            <p className="text-gray-600">
              {step === "email" &&
                "Enter your email to receive a verification code"}
              {step === "verify" && `We sent a code to ${email}`}
              {step === "reset" && "Create your new password"}
              {step === "success" &&
                "Your password has been reset successfully"}
            </p>
          </div>

          {/* Step content */}
          {step === "email" && (
            <div className="space-y-5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300"
              />
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <button
                onClick={handleSendCode}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Send Verification Code"}
              </button>
            </div>
          )}

          {step === "verify" && (
            <div className="space-y-5">
              <input
                type="text"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                maxLength={6}
                placeholder="------"
                className="w-full px-4 py-3 border rounded-lg text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300"
              />
              <div className="text-center text-sm text-gray-600">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={timer > 0 || isLoading}
                  className={`font-medium ${
                    timer > 0 || isLoading
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-green-600 hover:text-green-700"
                  }`}
                >
                  {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
                </button>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <button
                onClick={handleVerifyCode}
                disabled={isLoading || code.length !== 6}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verify Code
              </button>
            </div>
          )}

          {step === "reset" && (
            <div className="space-y-5">
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleResetPassword}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md disabled:opacity-50"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          )}

          {step === "success" && (
            <div className="space-y-5 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
              <p className="text-gray-600">
                You can now sign in with your new password
              </p>
              <button
                onClick={() => navigate("/signin")}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md"
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
