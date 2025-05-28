import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

// Re-usable base types
const basePhoneNumberSchema = z.string().refine(isValidPhoneNumber, {
  message: "Invalid phone number",
});

const basePrivacyAcceptedSchema = z
  .boolean()
  .refine((value) => value === true, {
    message: "You must accept the Privacy Policy.",
  });

// --- Schemas for Sign In ---
export const SignInPasswordSchema = z.object({
  phoneNumber: basePhoneNumberSchema,
  password: z.string().min(1, "Password is required."),
});
export type SignInPasswordFormValues = z.infer<typeof SignInPasswordSchema>;

// Schema for sending OTP when the purpose is purely to sign in (no privacy policy needed)
export const SendOtpSignInSchema = z.object({
  phoneNumber: basePhoneNumberSchema,
});
export type SendOtpSignInFormValues = z.infer<typeof SendOtpSignInSchema>;

// --- Schemas for Sign Up / Registration ---
// Schema for sending OTP when the purpose is to sign up (requires privacy policy)
export const SendOtpSignUpSchema = z.object({
  phoneNumber: basePhoneNumberSchema,
  privacyAccepted: basePrivacyAcceptedSchema,
});
export type SendOtpSignUpFormValues = z.infer<typeof SendOtpSignUpSchema>;

// --- Schema for OTP Verification (common for both sign-in and sign-up) ---
export const VerifyOtpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits."),
});
export type VerifyOtpFormValues = z.infer<typeof VerifyOtpSchema>;

// --- Schema for Sign Up with Password (IF you decide to use it) ---
// This schema is defined as per your input but will not be used in the UI
// if the requirement is "register with only OTP".
export const SignUpPasswordSchema = z
  .object({
    phoneNumber: basePhoneNumberSchema,
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(100, "Password is too long."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
    privacyAccepted: basePrivacyAcceptedSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
export type SignUpPasswordFormValues = z.infer<typeof SignUpPasswordSchema>;
