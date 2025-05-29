import { Footer } from "@/components/layout/footer";
import React from "react";
import { InfoHeader } from "./_components/info-header";

export default function InfoPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <InfoHeader />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
