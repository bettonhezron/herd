import { useState } from "react";
import { ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";

export default function ForgotPassword() {
  // State to manage the flow: 1 (Enter Username/Email), 2 (Verify Code), 3 (Reset Password)
  const [step, setStep] = useState(1);

  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- Utility for Input Styling ---
  const inputStyle =
    "w-full bg-white/70 rounded-full py-6 px-6 text-gray-700 placeholder:text-gray-400 placeholder:italic border-none shadow-lg text-base focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-70";
  const buttonStyle =
    "w-full py-6 rounded-full text-xl font-bold uppercase tracking-wider shadow-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed";

  // --- Step 1: Send Code ---
  const handleSendCode = () => {
    setInfoMessage("");
    if (!username.trim()) {
      setError("Please enter your email or username!");
      return;
    }

    setError("");
    setIsLoading(true);

    // Simulation: API call to send verification code
    setTimeout(() => {
      setIsLoading(false);
      setStep(2); // Move to verification step
      setError("");
      setInfoMessage(`A verification code has been sent to ${username}.`);
      console.log("Verification code sent to:", username);
    }, 1500);
  };

  // --- Step 2: Verify Code ---
  const handleVerifyCode = () => {
    setInfoMessage("");
    if (!code.trim() || code.trim().length < 4) {
      setError("Please enter the 4-digit verification code.");
      return;
    }

    setError("");
    setIsLoading(true);

    // Simulation: API call to verify the code
    setTimeout(() => {
      setIsLoading(false);
      // Simulate success condition
      if (code === "1234") {
        setError("");
        setInfoMessage("Code verified. Please set your new password.");
        setStep(3);
      } else {
        setError("Invalid code. Please check the code and try again.");
      }
    }, 1500);
  };

  // --- Step 2: Resend Code ---
  const handleResendCode = () => {
    setCode(""); // Clear previous code input
    setInfoMessage("");
    setError("");
    setIsLoading(true);

    // Simulation: API call to resend the code
    setTimeout(() => {
      setIsLoading(false);
      setInfoMessage("Verification code resent successfully.");
    }, 1500);
  };

  // --- Step 3: Reset Password ---
  const handlePasswordReset = () => {
    setInfoMessage("");
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setIsLoading(true);

    // Simulation: API call to reset password
    setTimeout(() => {
      setIsLoading(false);

      // Reset flow to the start, but show a success message
      setStep(1);
      setUsername("");
      setCode("");
      setNewPassword("");
      setConfirmPassword("");

      // Show success message, which will appear in the infoMessage display area
      setInfoMessage(
        "Success! Your password has been reset. Please return to the Sign In page."
      );

      console.log(
        `Password reset for user ${username}. New password: ${newPassword}`
      );
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-green-600">
      {/* Back Button */}
      <div className="pt-6 px-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-white text-lg font-bold hover:opacity-80 transition-opacity drop-shadow"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          BACK
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-start px-6 pt-8">
        {/* Logo */}
        <div className="mb-8">
          <img
            src="/logo.png"
            alt="DHMS logo"
            className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-contain shadow-2xl bg-white p-3"
          />
        </div>

        {/* Title */}
        <h1 className="text-white text-2xl sm:text-3xl font-bold text-center mb-4 tracking-wide drop-shadow-lg">
          {step === 1
            ? "Enter Your Login Details"
            : step === 2
            ? "Verify Code"
            : "Set New Password"}
        </h1>

        {/* Instructions */}
        <div className="w-full max-w-md mb-6">
          <p className="text-white text-md text-center leading-relaxed drop-shadow">
            {step === 1
              ? "Enter your username or email address below to receive a password reset code."
              : step === 2
              ? `Enter the verification code sent to the email associated with ${username}.`
              : "Choose a strong, new password for your account."}
          </p>
        </div>

        {/* Form */}
        <div className="w-full max-w-md space-y-5">
          {/* --- Step 1: Send Code --- */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Username Field */}
              <div>
                <input
                  type="text"
                  placeholder="Email or Username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError(""); // Clear error on change
                  }}
                  className={inputStyle}
                  disabled={isLoading}
                />
              </div>

              {/* Send Verification Code Button */}
              <button
                type="button"
                onClick={handleSendCode}
                className={`${buttonStyle} bg-white text-red-600 hover:bg-gray-50`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    SENDING...
                  </span>
                ) : (
                  "SEND VERIFICATION CODE"
                )}
              </button>
            </div>
          )}

          {/* --- Step 2: Verify Code --- */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Code Input Field */}
              <div>
                <input
                  type="number"
                  placeholder="4-digit Verification Code (e.g., 1234)"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.slice(0, 4));
                    setError("");
                  }}
                  className={inputStyle}
                  disabled={isLoading}
                  maxLength={4}
                />
              </div>

              {/* Verify Code Button */}
              <button
                type="button"
                onClick={handleVerifyCode}
                className={`${buttonStyle} bg-red-600 text-white hover:bg-red-700`}
                disabled={isLoading || code.length !== 4}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    VERIFYING...
                  </span>
                ) : (
                  "VERIFY CODE"
                )}
              </button>

              {/* Resend Code Button */}
              <button
                type="button"
                onClick={handleResendCode}
                className={`${buttonStyle} bg-white/30 text-white hover:bg-white/40 text-lg`}
                disabled={isLoading}
              >
                RESEND CODE
              </button>
            </div>
          )}

          {/* --- Step 3: Reset Password --- */}
          {step === 3 && (
            <div className="space-y-5">
              {/* New Password Field */}
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password (min 6 characters)"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError("");
                  }}
                  className={inputStyle}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  className={inputStyle}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Reset Password Button */}
              <button
                type="button"
                onClick={handlePasswordReset}
                className={`${buttonStyle} bg-green-600 text-white hover:bg-green-700`}
                disabled={
                  isLoading ||
                  newPassword.length < 6 ||
                  newPassword !== confirmPassword
                }
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    RESETTING...
                  </span>
                ) : (
                  "RESET PASSWORD"
                )}
              </button>
            </div>
          )}

          {/* Error Message Display */}
          {(error || infoMessage) && (
            <div className="text-center pt-2">
              <p
                className={`${
                  error ? "text-red-600 font-semibold" : "text-white"
                } text-sm drop-shadow`}
              >
                {error || infoMessage}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cow Silhouettes at Bottom */}
      <div className="w-full px-6 pb-8 mt-auto">
        <div className="max-w-2xl mx-auto flex justify-between items-end">
          <img
            src="/cow-silhouette1.svg"
            alt="Cow"
            className="h-14 w-18 opacity-70"
          />
          <img
            src="/cow-silhouette1.svg"
            alt="Cow"
            className="h-12 w-16 opacity-70 scale-x-[-1]"
          />
          <img
            src="/cow-silhouette1.svg"
            alt="Cow"
            className="h-16 w-20 opacity-70"
          />
          <img
            src="/cow-silhouette1.svg"
            alt="Cow"
            className="h-12 w-16 opacity-70 scale-x-[-1]"
          />
        </div>
      </div>
    </div>
  );
}
