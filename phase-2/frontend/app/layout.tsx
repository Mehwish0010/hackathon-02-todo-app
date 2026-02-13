import type { Metadata } from "next";
import "./globals.css";
import { BackgroundOrbs } from "@/components/ui/background-orbs";

export const metadata: Metadata = {
  title: "Todo App - Multi-user Task Management",
  description: "A secure, multi-user task management application with Better Auth and JWT authentication",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg-primary text-text-primary antialiased">
        {/* Animated background orbs for depth */}
        <BackgroundOrbs />

        {/* Main content */}
        <div className="relative">
          {children}
        </div>
      </body>
    </html>
  );
}
