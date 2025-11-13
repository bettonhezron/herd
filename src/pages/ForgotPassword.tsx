import React, { useState, useEffect } from "react";
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { MdMarkEmailRead } from "react-icons/md";
import { useNavigate } from "react-router-dom";

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
  const [generatedCode, setGeneratedCode] = useState("");

  const navigate = useNavigate();

  // Countdown timer for resend code
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Simulate sending verification code
  const handleSendCode = (e: React.MouseEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      console.log("Verification code:", code); // In real app, this would be sent via email
      setIsLoading(false);
      setStep("verify");
      setTimer(60); // Start 60 second countdown
    }, 1500);
  };

  // Simulate verifying code
  const handleVerifyCode = (e: React.MouseEvent) => {
    e.preventDefault();
    setError("");

    if (!code || code.length !== 6) {
      setError("Please enter the 6-digit verification code");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (code === generatedCode) {
        setIsLoading(false);
        setStep("reset");
      } else {
        setIsLoading(false);
        setError("Invalid verification code. Please try again.");
      }
    }, 1000);
  };

  // Resend verification code
  const handleResendCode = () => {
    if (timer > 0) return;

    setError("");
    setCode("");
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      console.log("New verification code:", code);
      setIsLoading(false);
      setTimer(60);
    }, 1000);
  };

  // Simulate resetting password
  const handleResetPassword = (e: React.MouseEvent) => {
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

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep("success");
    }, 1500);
  };

  const handleBack = () => {
    if (step === "email") {
      navigate("/signin"); // go back to sign-in page
    } else {
      // go to previous step in forgot password flow
      navigate(-1); // or handle step logic if using local state
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-green-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back Button */}
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
          {/* Header */}
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

          {/* Step 1: Email Input */}
          {step === "email" && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSendCode(e as any)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300"
                  placeholder="you@example.com"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleSendCode}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Send Verification Code"}
              </button>
            </div>
          )}

          {/* Step 2: Verify Code */}
          {step === "verify" && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    code.length === 6 &&
                    handleVerifyCode(e as any)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Check console for the generated code
                </p>
              </div>

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
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </button>
            </div>
          )}

          {/* Step 3: Reset Password */}
          {step === "reset" && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 pr-12"
                    placeholder="Enter new password"
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleResetPassword(e as any)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 pr-12"
                    placeholder="Confirm new password"
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
              </div>

              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
                Password must be at least 8 characters long
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleResetPassword}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          )}

          {/* Step 4: Success */}
          {step === "success" && (
            <div className="space-y-5">
              <div className="text-center py-4">
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <p className="text-gray-600 mb-6">
                  You can now sign in with your new password
                </p>
              </div>

              <button
                onClick={() => navigate("/signin")}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200"
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
