"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  VerifyOtpSchema,
  type VerifyOtpFormValues,
} from "@/lib/validations/auth";
import type { PhoneOtpFlowType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type VerifyOtpFormProps = {
  phoneNumber: string;
  isLoading?: boolean;
  onSubmit: (
    values: VerifyOtpFormValues,
    event?: React.BaseSyntheticEvent,
  ) => void;
  onResend: () => void;
  onChangePhone: () => void;
  flowType: PhoneOtpFlowType;
};

export function VerifyOtpForm({
  phoneNumber,
  isLoading = false,
  onSubmit,
  onResend,
  onChangePhone,
  flowType,
}: VerifyOtpFormProps) {
  const form = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(VerifyOtpSchema),
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      form.setFocus("otp");
    }, 50);
    return () => clearTimeout(timer);
  }, [form]);

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          if (flowType === "dialog") e.stopPropagation();
          void form.handleSubmit((values) => onSubmit(values, e))(e);
        }}
        className="space-y-6"
      >
        <p className="text-muted-foreground text-sm">
          Enter the 6-digit code sent to {phoneNumber}.
        </p>
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <InputOTP
                  pattern={REGEXP_ONLY_DIGITS}
                  maxLength={6}
                  disabled={isLoading}
                  {...field}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" loading={isLoading}>
          {flowType === "signup"
            ? "Verify & Create Account"
            : flowType === "dialog"
              ? "Verify & Update"
              : "Verify & Sign In"}
        </Button>
        <div className="flex justify-between text-sm">
          <Button
            type="button"
            variant="link"
            onClick={onResend}
            className="text-primary px-0"
            disabled={isLoading}
          >
            Resend Code
          </Button>
          <Button
            type="button"
            variant="link"
            onClick={onChangePhone}
            className="px-0"
            disabled={isLoading}
          >
            Change Phone Number
          </Button>
        </div>
      </form>
    </Form>
  );
}
