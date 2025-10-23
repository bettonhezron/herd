import { useState } from "react";
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

  async function onSubmit(values: SignInFormValues) {
    form.clearErrors("root.serverError");
    // ... rest of the login logic
    loginMutation.mutate(values as LoginPayload, {
      onError: (error) => {
        form.setError("root.serverError", {
          type: "manual",
          message:
            error.message || "Login failed. Please check your credentials.",
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
            className="mx-auto h-20 w-20 sm:h-24 sm:w-24 mb-6 rounded-2xl object-contain shadow-2xl bg-white p-3" // Larger logo for emphasis
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
          {" "}
          {/* This acts as the new card area without borders */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 sm:space-y-7"
            >
              {/* Email Field - Styled for the blended look */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormControl>
                      <Input
                        className="w-full bg-white/70 rounded-full py-6 px-6 text-gray-700 placeholder:text-gray-400 placeholder:italic border-none shadow-lg text-base focus:outline-none focus:ring-2 focus:ring-white/50 h-auto"
                        placeholder="Email or Username"
                        type="email"
                        autoComplete="email"
                        disabled={loginMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600 drop-shadow" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <div className="relative">
                      <FormControl>
                        <Input
                          className="w-full bg-white/70 rounded-full py-6 px-6 text-gray-700 placeholder:text-gray-400 placeholder:italic border-none shadow-lg text-base focus:outline-none focus:ring-2 focus:ring-white/50 h-auto pr-[80px]" // Increased padding for Show/Hide
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
                        className="absolute inset-y-0 right-0 h-full px-4 text-sm font-bold text-sky-700 hover:text-sky-600 transition-colors hover:no-underline"
                      >
                        {showPassword ? "HIDE" : "SHOW"}
                      </Button>
                    </div>
                    <FormMessage className="text-red-600 drop-shadow" />
                  </FormItem>
                )}
              />

              {/* Keep Me Signed In + Forgot Password */}
              <div className="flex items-center justify-between pt-1 pb-2">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-white data-[state=checked]:bg-green-700 data-[state=checked]:text-white"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-medium text-white cursor-pointer drop-shadow">
                        Keep me signed in
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <a
                  href="forgot-password"
                  className="text-sm font-bold text-white hover:text-gray-200 hover:underline transition-colors drop-shadow"
                >
                  Forgot password?
                </a>
              </div>

              {/* Server Error Message */}
              {form.formState.errors.root?.serverError && (
                <p className="text-sm font-medium text-red-100 text-center drop-shadow-lg">
                  {form.formState.errors.root.serverError.message}
                </p>
              )}

              {/* Submit Button - Large, prominent, white button */}
              <Button
                type="submit"
                className="w-full bg-white text-green-600 hover:bg-gray-50 py-6 h-auto rounded-full text-xl font-bold uppercase tracking-wider shadow-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
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
