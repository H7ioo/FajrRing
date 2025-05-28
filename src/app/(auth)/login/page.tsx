"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

import LogoHeader from "../_components/LogoHeader";
import PhoneOtpFlowForm from "../_components/PhoneOtpFlowForm";
import SignInPasswordForm from "../_components/SignInPasswordForm";
import SocialLogins from "../_components/SocialLogins";

export default function LoginPage() {
  const [activeMainTab, setActiveMainTab] = useState<"signin" | "signup">(
    "signin",
  );

  const [activeSignInMethodTab, setActiveSignInMethodTab] = useState<
    "password" | "otp"
  >("password");

  return (
    <div className="from-background via-muted/30 to-secondary/10 selection:bg-primary/20 selection:text-primary flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
      <div className="w-full max-w-md">
        <LogoHeader />

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">
              Welcome to FajrRing
            </CardTitle>
            <CardDescription>
              {activeMainTab === "signin"
                ? "Sign in to access your account."
                : "Create an account to get started."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs
              value={activeMainTab}
              onValueChange={(value) =>
                setActiveMainTab(value as "signin" | "signup")
              }
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Create Account</TabsTrigger>
              </TabsList>

              {/* SIGN IN TAB */}
              <TabsContent value="signin" className="pt-6">
                <Tabs
                  value={activeSignInMethodTab}
                  onValueChange={(value) =>
                    setActiveSignInMethodTab(value as "password" | "otp")
                  }
                  className="space-y-0" // Remove default space-y from inner Tabs
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="password">With Password</TabsTrigger>
                    <TabsTrigger value="otp">With One-Time Code</TabsTrigger>
                  </TabsList>
                  <TabsContent value="password" className="pt-6">
                    <SignInPasswordForm />
                  </TabsContent>
                  <TabsContent value="otp" className="pt-6">
                    <PhoneOtpFlowForm flowType="signin" />
                  </TabsContent>
                </Tabs>
              </TabsContent>

              {/* CREATE ACCOUNT TAB */}
              <TabsContent value="signup" className="pt-6">
                <PhoneOtpFlowForm flowType="signup" />
              </TabsContent>
            </Tabs>

            <SocialLogins />
          </CardContent>
        </Card>
        {/* TODO: */}
        {/* Consider adding a global footer component here or in your main layout */}
      </div>
    </div>
  );
}
