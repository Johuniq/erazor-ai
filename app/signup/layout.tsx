import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "Sign Up Free - Create Your Account | Erazor AI",
  description:
    "Create a free Erazor AI account and get 10 credits to use our AI image editing tools. Remove backgrounds, upscale images, and more. No credit card required.",
  openGraph: {
    title: "Sign Up Free for Erazor AI",
    description:
      "Create a free account and get 10 credits for AI-powered image editing. No credit card required.",
    url: "https://www.erazor.app/signup",
    siteName: "Erazor AI",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.erazor.app/signup",
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
