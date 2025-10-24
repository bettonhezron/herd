import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useLogin } from "@/hooks/useAuth";
import { LoginPayload } from "@/types/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    reValidateMode: "onChange",
  });

  // Auto-clear server error after 2.5 seconds
  useEffect(() => {
    if (form.formState.errors.root?.serverError) {
      const timer = setTimeout(() => {
        form.clearErrors("root.serverError");
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [form.formState.errors.root?.serverError, form]);

  async function onSubmit(values: SignInFormValues) {
    form.clearErrors("root.serverError");

    loginMutation.mutate(values as LoginPayload, {
      onError: (error) => {
        const errorMessage = error.message || "Login failed. Please try again.";

        form.setError("root.serverError", {
          type: "manual",
          message: errorMessage,
        });
      },
      onSuccess: () => {
        if (values.rememberMe) {
          localStorage.setItem("keepSignedIn", "true");
        } else {
          localStorage.removeItem("keepSignedIn");
        }
        navigate("/dashboard");
      },
    });
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-green-600">
      {/* Back Button */}
      <div className="pt-6 px-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-white text-lg font-bold hover:opacity-80 transition-opacity drop-shadow"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          BACK
        </button>
      </div>

      {/* Main Content - Form Area */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8 py-8">
        {/* Logo and Title - Use drop-shadow for visibility on the gradient */}
        <div className="text-center mb-8 w-full max-w-sm sm:max-w-md">
          <img
            src="/logo.png"
            alt="DHMS logo"
            className="mx-auto h-20 w-20 sm:h-24 sm:w-24 mb-6 rounded-2xl object-contain shadow-2xl bg-white p-3"
          />
          <h1 className="text-3xl font-bold text-white tracking-wide drop-shadow-lg mb-2">
            Sign In to your Account
          </h1>
          <p className="text-white text-md drop-shadow-lg">
            Access your dashboard below.
          </p>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-sm sm:max-w-md">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 sm:space-y-7"
            >
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormControl>
                      <Input
                        className="w-full bg-white/80 backdrop-blur-sm rounded-full py-5 sm:py-6 px-5 sm:px-6 text-gray-800 placeholder:text-gray-500 border-2 border-white/30 shadow-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white focus:border-white/60 h-auto transition-all"
                        placeholder="Email or Username"
                        type="email"
                        autoComplete="email"
                        disabled={loginMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-700 font-semibold text-sm bg-red-100/90 px-3 py-1 rounded-lg inline-block" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <div className="relative">
                      <FormControl>
                        <Input
                          className="w-full bg-white/80 backdrop-blur-sm rounded-full py-5 sm:py-6 px-5 sm:px-6 text-gray-800 placeholder:text-gray-500 border-2 border-white/30 shadow-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white focus:border-white/60 h-auto transition-all pr-[75px]"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          autoComplete="current-password"
                          disabled={loginMutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 h-full px-4 text-xs sm:text-sm font-bold text-sky-700 hover:text-sky-800 transition-colors hover:no-underline"
                      >
                        {showPassword ? "HIDE" : "SHOW"}
                      </Button>
                    </div>
                    <FormMessage className="text-red-700 font-semibold text-sm bg-red-100/90 px-3 py-1 rounded-lg inline-block" />
                  </FormItem>
                )}
              />

              {/* Keep Me Signed In + Forgot Password */}
              <div className="flex items-center justify-between pt-1 pb-2">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2.5 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="h-5 w-5 border-2 border-white shadow-md data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 data-[state=checked]:text-white transition-all"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-semibold text-white cursor-pointer drop-shadow-md select-none">
                        Keep me signed in
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <a
                  href="forgot-password"
                  className="text-sm font-bold text-white hover:text-gray-100 hover:underline transition-colors drop-shadow-md"
                >
                  Forgot password?
                </a>
              </div>

              {/* Server Error Message */}
              {form.formState.errors.root?.serverError && (
                <div className="bg-red-500/95 backdrop-blur-sm text-white px-4 py-3 rounded-xl text-center shadow-xl border-2 border-red-400">
                  <p className="text-sm font-semibold">
                    {form.formState.errors.root.serverError.message}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-white text-green-600 hover:bg-green-50 active:bg-gray-100 py-5 sm:py-6 h-auto rounded-full text-lg sm:text-xl font-bold uppercase tracking-wider shadow-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none border-2 border-white/50"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    SIGNING IN...
                  </>
                ) : (
                  "SIGN IN"
                )}
              </Button>
            </form>
          </Form>
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
