import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "Contact Us - Get in Touch | Erazor AI",
  description:
    "Have questions about Erazor AI? Contact our team for support, enterprise inquiries, or general questions. We typically respond within 24 hours.",
  openGraph: {
    title: "Contact Erazor AI - Get in Touch",
    description:
      "Have questions about Erazor AI? Contact our team for support, enterprise inquiries, or general questions.",
    url: "https://www.erazor.app/contact",
    siteName: "Erazor AI",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact Erazor AI",
    description: "Have questions? Contact our team for support or inquiries.",
  },
  alternates: {
    canonical: "https://www.erazor.app/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
