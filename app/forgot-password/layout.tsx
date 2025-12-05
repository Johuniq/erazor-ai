import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "Reset Password | Erazor AI",
  description:
    "Reset your Erazor AI account password. Enter your email to receive a password reset link.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://www.erazor.app/forgot-password",
  },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
