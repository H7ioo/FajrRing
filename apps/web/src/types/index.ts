import { type Session } from "@/server/auth/auth-client";
export type UserSession = Session["user"];

export type PhoneOtpFlowType = "signin" | "signup" | "dialog";
