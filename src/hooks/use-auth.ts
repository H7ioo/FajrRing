"use client";

import {
  authClient,
  signIn,
  signOut,
  useSession,
} from "@/server/auth/auth-client";
import type { ErrorContext, SuccessContext } from "better-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export type AuthProvider = "google";

// ! Note that better-auth doesn't throw so no need to wrap in try catch
export function useAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refetch: refetchSession } = useSession();

  const createSuccessHandler = ({
    title,
    route,
    shouldRefetchSession = false,
  }: {
    title: string;
    route?: string;
    shouldRefetchSession?: boolean;
  }) => {
    return (_context: SuccessContext) => {
      toast.success(title);
      if (shouldRefetchSession) refetchSession();
      if (route) router.push(route);
    };
  };

  const createErrorHandler = ({ title }: { title: string }) => {
    return (context: ErrorContext) => {
      toast.error(title);
      console.error(context.error);
    };
  };

  const loginWithPhoneNumberAndPassword = async ({
    phoneNumber,
    password,
    rememberMe,
  }: {
    phoneNumber: string;
    password: string;
    rememberMe?: boolean;
  }) => {
    await signIn.phoneNumber({
      phoneNumber,
      password,
      rememberMe,
      fetchOptions: {
        onSuccess: createSuccessHandler({
          title: "Login Successful!",
          route: "/dashboard",
          shouldRefetchSession: true,
        }),
        onError: createErrorHandler({
          title: "Login Failed. Please check your credentials.",
        }),
      },
    });
  };

  const sendPhoneNumberOTP = async ({
    phoneNumber,
  }: {
    phoneNumber: string;
  }) => {
    await authClient.phoneNumber.sendOtp({
      phoneNumber,
      fetchOptions: {
        onSuccess: createSuccessHandler({
          title: "Verification code sent successfully!",
        }),
        onError: createErrorHandler({
          title: "Failed to send code. Please try again.",
        }),
      },
    });
  };

  const loginWithPhoneNumberAndOtp = async ({
    phoneNumber,
    otp,
  }: {
    phoneNumber: string;
    otp: string;
  }) => {
    await authClient.phoneNumber.verify({
      phoneNumber,
      code: otp,
      fetchOptions: {
        onSuccess: createSuccessHandler({
          title: "Login Successful!",
          route: "/dashboard",
          shouldRefetchSession: true,
        }),
        onError: createErrorHandler({
          title: "Login Failed. Please check the code.",
        }),
      },
    });
  };

  const registerWithPhoneNumberAndOtp = async ({
    phoneNumber,
    otp,
  }: {
    phoneNumber: string;
    otp: string;
  }) => {
    await authClient.phoneNumber.verify({
      phoneNumber,
      code: otp,
      fetchOptions: {
        onSuccess: createSuccessHandler({
          title: "Account Created & Verified!",
          route: "/dashboard",
          shouldRefetchSession: true,
        }),
        onError: createErrorHandler({
          title: "Registration Failed. Please check the code or try again.",
        }),
      },
    });
  };

  const loginWithOAuth = async (provider: AuthProvider) => {
    await signIn.social({
      provider,
      callbackURL: "/dashboard",
      fetchOptions: {
        onError: createErrorHandler({
          title: "OAuth Login Failed. Please try again.",
        }),
      },
    });
  };

  const logout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: createSuccessHandler({
          title: "Logged out successfully.",
          route: "/login",
        }),
        onError: createErrorHandler({
          title: "Logout Failed. Please try again.",
        }),
      },
    });
  };

  return {
    loginWithOAuth,
    loginWithPhoneNumberAndPassword,
    loginWithPhoneNumberAndOtp,
    sendPhoneNumberOTP,
    registerWithPhoneNumberAndOtp,
    logout,
  };
}
