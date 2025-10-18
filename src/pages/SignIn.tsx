import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useLogin } from "@/hooks/useAuth";
import { LoginPayload } from "@/types/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    },
    reValidateMode: "onChange",
  });

  async function onSubmit(values: SignInFormValues) {
    form.clearErrors("root.serverError");

    loginMutation.mutate(values as LoginPayload, {
      onError: (error) => {
        form.setError("root.serverError", {
          type: "manual",
          message:
            error.message || "Login failed. Please check your credentials.",
        });
      },
      onSuccess: () => {
        navigate("/");
      },
    });
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-sm sm:max-w-md border-green-200 shadow-xl rounded-2xl p-2 sm:p-4">
        <CardHeader className="text-center pb-4">
          <img
            src="/logo.png"
            alt="DHMS logo"
            className="mx-auto h-12 w-12 sm:h-14 sm:w-14 mb-3 rounded-xl object-contain"
          />
          <CardTitle className="text-2xl font-bold text-sky-800">
            Sign In to your Account
          </CardTitle>
          <CardDescription className="text-gray-600 text-sm mt-1">
            Please enter your credentials to access the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 sm:space-y-6"
            >
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className="py-2.5 px-4 h-auto focus-visible:ring-green-400 focus-visible:ring-offset-green-50"
                        placeholder="abc@example.com"
                        type="email"
                        autoComplete="email"
                        disabled={loginMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          className="py-2.5 px-4 h-auto focus-visible:ring-green-400 focus-visible:ring-offset-green-50 pr-[65px]"
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
                        className="absolute inset-y-0 right-0 h-full px-3 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors hover:no-underline"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Forgot Password Link */}
              <div className="text-right pt-1">
                <a
                  href="#"
                  className="text-sm font-medium text-sky-700 hover:text-sky-600 hover:underline transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              {/* Server Error Message */}
              {form.formState.errors.root?.serverError && (
                <p className="text-sm font-medium text-destructive text-center">
                  {form.formState.errors.root.serverError.message}
                </p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 mt-5 h-auto rounded-lg text-base font-semibold transition-colors"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
