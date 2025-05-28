"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

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
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/use-auth";
import {
  SendOtpSignInSchema,
  SendOtpSignUpSchema,
  VerifyOtpSchema,
  type SendOtpSignInFormValues,
  type SendOtpSignUpFormValues,
  type VerifyOtpFormValues,
} from "@/lib/validations/auth";
import { REGEXP_ONLY_DIGITS } from "input-otp";

interface PhoneOtpFlowFormProps {
  flowType: "signin" | "signup";
}

type CurrentSendOtpFormValues =
  | SendOtpSignInFormValues
  | SendOtpSignUpFormValues;

const PhoneOtpFlowForm: React.FC<PhoneOtpFlowFormProps> = ({ flowType }) => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {
    sendPhoneNumberOTP,
    loginWithPhoneNumberAndOtp,
    registerWithPhoneNumberAndOtp,
  } = useAuth();

  const currentSendOtpZodSchema =
    flowType === "signup" ? SendOtpSignUpSchema : SendOtpSignInSchema;

  const sendOtpForm = useForm<CurrentSendOtpFormValues>({
    resolver: zodResolver(currentSendOtpZodSchema),
    defaultValues: {
      phoneNumber: "",
      // Conditionally add privacyAccepted for signup
      ...(flowType === "signup" && { privacyAccepted: false }),
    },
  });

  const verifyOtpForm = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(VerifyOtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const handleSendOtpSubmit = async (values: CurrentSendOtpFormValues) => {
    setIsLoading(true);
    setCurrentPhoneNumber(values.phoneNumber);
    await sendPhoneNumberOTP({ phoneNumber: values.phoneNumber });
    setIsOtpSent(true);
    setIsLoading(false);
  };

  const handleVerifyOtpSubmit = async (values: VerifyOtpFormValues) => {
    setIsLoading(true);
    if (flowType === "signin") {
      await loginWithPhoneNumberAndOtp({
        phoneNumber: currentPhoneNumber,
        otp: values.otp,
      });
    } else {
      await registerWithPhoneNumberAndOtp({
        phoneNumber: currentPhoneNumber,
        otp: values.otp,
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOtpSent) {
      // Use a small timeout to ensure the DOM has fully rendered
      // and the InputOTP component is ready for focus.
      // This is often necessary with conditional rendering or animations.
      const timer = setTimeout(() => {
        verifyOtpForm.setFocus("otp");
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [isOtpSent, verifyOtpForm]);

  // ! field.value is becoming true after conditionally rendering it. So now initially the form exists but it is hidden.
  return (
    <div className="space-y-6">
      <Form {...sendOtpForm}>
        <form
          onSubmit={sendOtpForm.handleSubmit(handleSendOtpSubmit)}
          className="space-y-6"
          style={{ display: isOtpSent ? "none" : "block" }}
        >
          <FormField
            control={sendOtpForm.control}
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
          {flowType === "signup" && (
            <FormField
              control={sendOtpForm.control}
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

      <Form {...verifyOtpForm}>
        <form
          onSubmit={verifyOtpForm.handleSubmit(handleVerifyOtpSubmit)}
          className="space-y-6"
          style={{ display: isOtpSent ? "block" : "none" }}
        >
          <p className="text-muted-foreground text-sm">
            Enter the 6-digit code sent to {currentPhoneNumber}.
          </p>
          <FormField
            control={verifyOtpForm.control}
            name="otp"
            render={({ field }) => {
              return (
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
              );
            }}
          />
          <Button type="submit" className="w-full" loading={isLoading}>
            {flowType === "signin"
              ? "Verify & Sign In"
              : "Verify & Create Account"}
          </Button>
          <div className="flex justify-between text-sm">
            <Button
              type="button"
              variant="link"
              onClick={() =>
                handleSendOtpSubmit({ phoneNumber: currentPhoneNumber })
              }
              className="text-primary px-0"
              loading={isLoading}
            >
              Resend Code
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={() => {
                setIsOtpSent(false);
              }}
              className="px-0"
              loading={isLoading}
            >
              Change Phone Number
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PhoneOtpFlowForm;
