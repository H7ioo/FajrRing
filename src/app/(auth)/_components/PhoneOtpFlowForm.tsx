"use client";

import { PhoneNumberForm } from "@/components/forms/PhoneNumberForm";
import { VerifyOtpForm } from "@/components/forms/VerifyOtpForm";
import { useAuth } from "@/hooks/use-auth";
import type {
  SendOtpSignInFormValues,
  SendOtpSignUpFormValues,
  VerifyOtpFormValues,
} from "@/lib/validations/auth";
import type { PhoneOtpFlowType } from "@/types";
import { useState } from "react";

type PhoneOtpFlowFormProps = {
  flowType: PhoneOtpFlowType;
  defaultPhoneNumber?: string;
  onSuccess?: (newPhoneNumber: string) => void;
  showPrivacyPolicy?: boolean;
};

export default function PhoneOtpFlowForm({
  flowType,
  defaultPhoneNumber = "",
  showPrivacyPolicy = true,
  onSuccess,
}: PhoneOtpFlowFormProps) {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    sendPhoneNumberOTP,
    loginWithPhoneNumberAndOtp,
    registerWithPhoneNumberAndOtp,
    changePhoneNumberWithOtp,
  } = useAuth();

  const handleSendOtpSubmit = async (
    values: SendOtpSignInFormValues | SendOtpSignUpFormValues,
    event?: React.BaseSyntheticEvent,
  ) => {
    if (flowType === "dialog" && event) event.stopPropagation();
    setIsLoading(true);
    try {
      setCurrentPhoneNumber(values.phoneNumber);
      await sendPhoneNumberOTP({ phoneNumber: values.phoneNumber });
      setIsOtpSent(true);
    } catch (error) {
      console.error("Failed to send OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtpSubmit = async (
    values: VerifyOtpFormValues,
    event?: React.BaseSyntheticEvent,
  ) => {
    if (flowType === "dialog" && event) event.stopPropagation();
    setIsLoading(true);
    try {
      if (flowType === "signin") {
        await loginWithPhoneNumberAndOtp({
          phoneNumber: currentPhoneNumber,
          otp: values.otp,
        });
        onSuccess?.(currentPhoneNumber);
      } else if (flowType === "signup") {
        await registerWithPhoneNumberAndOtp({
          phoneNumber: currentPhoneNumber,
          otp: values.otp,
        });
        onSuccess?.(currentPhoneNumber);
      } else if (flowType === "dialog") {
        await changePhoneNumberWithOtp({
          phoneNumber: currentPhoneNumber, // New phone number
          otp: values.otp,
        });
        onSuccess?.(currentPhoneNumber);
      }
    } catch (error) {
      console.error("Failed to verify OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (currentPhoneNumber) {
      await handleSendOtpSubmit({ phoneNumber: currentPhoneNumber });
    }
  };

  const handleChangePhoneNumber = () => {
    setIsOtpSent(false);
  };

  if (isOtpSent) {
    return (
      <VerifyOtpForm
        phoneNumber={currentPhoneNumber}
        isLoading={isLoading}
        onSubmit={handleVerifyOtpSubmit}
        onResend={handleResendCode}
        onChangePhone={handleChangePhoneNumber}
        flowType={flowType}
      />
    );
  }

  return (
    <PhoneNumberForm
      flowType={flowType}
      defaultPhoneNumber={defaultPhoneNumber}
      showPrivacyPolicy={showPrivacyPolicy}
      isLoading={isLoading}
      onSubmit={handleSendOtpSubmit}
    />
  );
}
