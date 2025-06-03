"use client";

import { PhoneInput } from "@/components/phone-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  SendOtpSignInSchema,
  SendOtpSignUpSchema,
  type SendOtpSignInFormValues,
  type SendOtpSignUpFormValues,
} from "@/lib/validations/auth";
import type { PhoneOtpFlowType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

type PhoneNumberFormProps = {
  flowType: PhoneOtpFlowType;
  defaultPhoneNumber?: string;
  showPrivacyPolicy?: boolean;
  isLoading?: boolean;
  onSubmit: (
    values: SendOtpSignInFormValues | SendOtpSignUpFormValues,
    event?: React.BaseSyntheticEvent,
  ) => void;
};

export function PhoneNumberForm({
  flowType,
  defaultPhoneNumber = "",
  showPrivacyPolicy = true,
  isLoading = false,
  onSubmit,
}: PhoneNumberFormProps) {
  const schema =
    flowType === "signup" ? SendOtpSignUpSchema : SendOtpSignInSchema;

  const form = useForm<SendOtpSignInFormValues | SendOtpSignUpFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      phoneNumber: defaultPhoneNumber,
      ...(flowType === "signup" && { privacyAccepted: false }),
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          if (flowType === "dialog") e.stopPropagation();
          void form.handleSubmit((values) => onSubmit(values, e))(e);
        }}
        className="space-y-6"
      >
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
        {flowType === "signup" && showPrivacyPolicy && (
          <FormField
            control={form.control}
            name="privacyAccepted"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row items-center space-x-2 rounded-md border p-4 shadow-sm">
                  <FormControl>
                    <Checkbox
                      checked={field.value as boolean | undefined}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                      id="privacy-otp-signup"
                    />
                  </FormControl>
                  <FormLabel
                    className="relative inline-block leading-2"
                    htmlFor="privacy-otp-signup"
                  >
                    I agree to the{" "}
                    <Link
                      href="/privacy-policy"
                      className="text-primary hover:underline"
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" className="w-full" loading={isLoading}>
          Send Verification Code
        </Button>
      </form>
    </Form>
  );
}
