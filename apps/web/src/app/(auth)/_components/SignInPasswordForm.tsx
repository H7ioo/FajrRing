"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { PhoneInput } from "@/components/phone-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import {
  SignInPasswordSchema,
  type SignInPasswordFormValues,
} from "@/lib/validations/auth";

const SignInPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithPhoneNumberAndPassword } = useAuth();

  const form = useForm<SignInPasswordFormValues>({
    resolver: zodResolver(SignInPasswordSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInPasswordFormValues) => {
    setIsLoading(true);
    await loginWithPhoneNumberAndPassword({
      phoneNumber: values.phoneNumber,
      password: values.password,
      rememberMe: false,
    });
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <PhoneInput
                  placeholder="+90 555 123 45 67"
                  international
                  defaultCountry="TR"
                  {...field}
                  disabled={isLoading}
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
            <FormItem>
              <FormLabel>Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...field}
                    disabled={isLoading}
                    className="pr-10"
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground absolute top-0 right-0 h-full px-3"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-primary text-sm font-medium hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" className="w-full" loading={isLoading}>
          Sign In
        </Button>
      </form>
    </Form>
  );
};

export default SignInPasswordForm;
