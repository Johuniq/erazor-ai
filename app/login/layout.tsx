import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "Sign In - Access Your Account | Erazor AI",
  description:
    "Sign in to your Erazor AI account to access background removal, image upscaling, and manage your credits.",
  openGraph: {
    title: "Sign In to Erazor AI",
    description:
      "Sign in to access AI-powered background removal and image upscaling tools.",
    url: "https://www.erazor.app/login",
    siteName: "Erazor AI",
    type: "website",
  },
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://www.erazor.app/login",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
