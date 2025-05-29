"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface InfoPageHeaderProps {
  pageTitle?: string;
}

export function InfoHeader({ pageTitle }: InfoPageHeaderProps) {
  return (
    <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-14 items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="text-foreground hover:bg-accent hover:text-accent-foreground mr-2 lg:mr-4"
            aria-label="Go back to home"
          >
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <Link href="/" className="flex items-center space-x-2">
            <Logo size="sm" />
          </Link>
        </div>
        {pageTitle && (
          <div className="flex flex-1 justify-center">
            {/* Centering the title */}
            <h1 className="text-foreground text-lg font-semibold sm:text-xl">
              {pageTitle}
            </h1>
          </div>
        )}
        {/* Optional: Add a spacer if title is present to balance the back button space */}
        {pageTitle && <div className="w-10 lg:w-14"></div>}
      </div>
    </header>
  );
}
