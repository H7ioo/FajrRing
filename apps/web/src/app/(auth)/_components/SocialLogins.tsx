// src/app/(auth)/login/_components/SocialLogins.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth, type AuthProvider } from "@/hooks/use-auth"; // Corrected path
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";

const SocialLogins = () => {
  const { loginWithOAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await loginWithOAuth("google" as AuthProvider);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Separator />
        <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 transform justify-center">
          <span className="bg-card text-muted-foreground px-2 text-sm">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        onClick={handleGoogleSignIn}
        className="w-full"
        disabled={isLoading}
      >
        <FaGoogle />
        Sign in with Google
      </Button>
    </div>
  );
};

export default SocialLogins;
