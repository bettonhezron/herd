import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => navigate("/dashboard"),
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-green-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <div className="mb-6 text-left">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="hover:bg-transparent hover:text-green-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto bg-green-600 rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002 2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-600">Sign in to manage your dairy herd</p>
          </div>

          {/* Form */}
          <form className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm mt-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-gray-700">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Error */}
            {loginMutation.isError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {loginMutation.error.message}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loginMutation.isPending}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200 flex items-center justify-center"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
