import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({
    message: "Enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
  rememberMe: z.boolean().optional().default(false),
});

type SignInFormValues = z.infer<typeof formSchema>;

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    reValidateMode: "onChange",
  });

  async function onSubmit(values: SignInFormValues) {
    setError("");
    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      console.log("Login values:", values);
    }, 1500);
  }

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
        <h1 className="text-white text-3xl sm:text-4xl font-bold text-center mb-8 tracking-wide uppercase drop-shadow-lg">
          SIGN IN TO YOUR
          <br />
          ACCOUNT
        </h1>

        {/* Form */}
        <div className="w-full max-w-md">
          <div className="space-y-5">
            {/* Email/Username Field */}
            <div>
              <input
                type="email"
                placeholder="Username"
                className="w-full bg-white rounded-full py-6 px-6 text-gray-700 placeholder:text-gray-400 placeholder:italic border-none shadow-lg text-base focus:outline-none focus:ring-2 focus:ring-white/50"
                disabled={isLoading}
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-white text-sm ml-4 mt-1 drop-shadow">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full bg-white rounded-full py-6 px-6 pr-14 text-gray-700 placeholder:text-gray-400 placeholder:italic border-none shadow-lg text-base focus:outline-none focus:ring-2 focus:ring-white/50"
                  disabled={isLoading}
                  {...form.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-white text-sm ml-4 mt-1 drop-shadow">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-center">
              <a
                href="/forgot-password"
                className="text-white text-base underline hover:opacity-80 transition-opacity italic drop-shadow"
              >
                Forgot your password?
              </a>
            </div>

            {/* Keep Me Signed In */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="rememberMe"
                className="h-5 w-5 rounded border-2 border-white bg-transparent checked:bg-white checked:border-white cursor-pointer"
                {...form.register("rememberMe")}
              />
              <label
                htmlFor="rememberMe"
                className="text-white text-base font-medium cursor-pointer italic drop-shadow"
              >
                Keep me signed in
              </label>
            </div>

            {/* Server Error Message */}
            {error && (
              <p className="text-sm font-medium text-white text-center bg-red-600/50 py-2 px-4 rounded-full drop-shadow">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                className="w-full bg-white text-green-700 hover:bg-green-50 py-6 rounded-full text-xl font-bold uppercase tracking-wider shadow-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    SIGNING IN...
                  </span>
                ) : (
                  "SIGN IN"
                )}
              </button>
            </div>
          </div>
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
          <img
            src="/cow-silhouette1.svg"
            alt="Cow"
            className="h-14 w-18 opacity-70"
          />
        </div>
      </div>
    </div>
  );
}
