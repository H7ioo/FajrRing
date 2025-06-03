import { Footer } from "@/components/layout/footer";
import React from "react";
import { InfoHeader } from "./_components/info-header";

export default function InfoPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <InfoHeader />
      <div className="flex-grow">
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
