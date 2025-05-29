"use client";

import { Logo } from "@/components/logo";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const linkClassName =
    "text-sm text-muted-foreground hover:text-primary hover:underline transition-colors";

  return (
    <footer className="border-border bg-card border-t">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-1">
            <Logo size="md" showTagline className="mb-4" />
            <p className="text-muted-foreground text-sm">
              Your daily call to prayer, personalized to your location and
              preferences.
            </p>
          </div>

          <div className="col-span-1">
            <h4 className="text-foreground mb-4 text-base font-semibold">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy-policy" className={linkClassName}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className={linkClassName}>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="text-foreground mb-4 text-base font-semibold">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className={linkClassName}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className={linkClassName}>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="text-foreground mb-4 text-base font-semibold">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className={linkClassName}>
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-border mt-12 border-t pt-8">
          <p className="text-muted-foreground text-center text-sm">
            &copy; {currentYear} FajrRing. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
