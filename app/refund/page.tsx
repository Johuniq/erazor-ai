import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy - 7-Day Money-Back Guarantee | Erazor AI",
  description:
    "Erazor AI offers a 7-day money-back guarantee on all paid plans. Learn about our refund policy and how to request a refund.",
  openGraph: {
    title: "Refund Policy - 7-Day Money-Back Guarantee | Erazor AI",
    description:
      "Erazor AI offers a 7-day money-back guarantee on all paid plans.",
    url: "https://www.erazor.app/refund",
    siteName: "Erazor AI",
    type: "website",
  },
  alternates: {
    canonical: "https://www.erazor.app/refund",
  },
};

export default function RefundPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Refund Policy
          </h1>
          <p className="mt-4 text-muted-foreground">
            Last updated: December 5, 2025
          </p>

          <div className="prose prose-neutral mt-12 max-w-none dark:prose-invert">
            <h2>7-Day Money-Back Guarantee</h2>
            <p>
              We want you to be completely satisfied with Erazor AI. If you're
              not happy with your purchase, we offer a full refund within 7 days
              of your subscription start date, no questions asked.
            </p>

            <h2>How to Request a Refund</h2>
            <p>To request a refund:</p>
            <ol>
              <li>
                Email us at{" "}
                <a href="mailto:support@erazor.app">support@erazor.app</a> with
                your account email
              </li>
              <li>Include "Refund Request" in the subject line</li>
              <li>We'll process your refund within 3-5 business days</li>
            </ol>

            <h2>Eligibility</h2>
            <p>Refunds are available for:</p>
            <ul>
              <li>First-time subscribers within 7 days of purchase</li>
              <li>Annual plans within 7 days of renewal</li>
              <li>Technical issues that prevent service usage</li>
            </ul>

            <h2>Non-Refundable Items</h2>
            <p>The following are not eligible for refunds:</p>
            <ul>
              <li>Credits that have already been used</li>
              <li>Requests made after 7 days</li>
              <li>Accounts with policy violations</li>
            </ul>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about our refund policy, please contact
              us at <a href="mailto:support@erazor.app">support@erazor.app</a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
