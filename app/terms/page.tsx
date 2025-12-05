import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Usage Agreement | Erazor AI",
  description:
    "Read the terms and conditions for using Erazor AI services. Understand your rights and responsibilities when using our AI-powered image editing tools.",
  openGraph: {
    title: "Terms of Service | Erazor AI",
    description: "Read the terms and conditions for using Erazor AI services.",
    url: "https://www.erazor.app/terms",
    siteName: "Erazor AI",
    type: "website",
  },
  alternates: {
    canonical: "https://www.erazor.app/terms",
  },
};

export default async function TermsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col">
      <Header isLoggedIn={!!user} />
      <main className="flex-1 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-muted-foreground">
            Last updated: December 2024
          </p>

          <div className="mt-8 space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using Erazor AI, you agree to be bound by these
                Terms of Service. If you do not agree to these terms, please do
                not use our service.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                2. Description of Service
              </h2>
              <p>
                Erazor AI provides AI-powered image processing services
                including background removal and image upscaling. We reserve the
                right to modify, suspend, or discontinue any aspect of the
                service at any time.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                3. User Accounts
              </h2>
              <p>
                You are responsible for maintaining the confidentiality of your
                account credentials and for all activities that occur under your
                account. You must notify us immediately of any unauthorized use
                of your account.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                4. Anonymous Usage
              </h2>
              <p>
                Erazor AI allows anonymous users to try our services with
                limited free credits. Anonymous usage is tracked using browser
                fingerprinting to prevent abuse. By using our service
                anonymously, you consent to this tracking.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                5. Acceptable Use
              </h2>
              <p>You agree not to use Erazor AI to:</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>Upload illegal, harmful, or offensive content</li>
                <li>Violate any intellectual property rights</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use the service for any unlawful purpose</li>
                <li>Upload content that exploits minors</li>
                <li>
                  Circumvent credit limits or abuse the anonymous usage system
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                6. Credits & Payments
              </h2>
              <p>
                Credits are used to process images. Anonymous users receive 3
                free credits. Registered free users receive 10 credits. Unused
                credits do not roll over between billing periods for
                subscription plans. Refunds are provided at our discretion.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                7. Intellectual Property
              </h2>
              <p>
                You retain all rights to the images you upload. Erazor AI does
                not claim ownership of your content. The Erazor AI service,
                including its original content, features, and functionality, is
                owned by us and protected by copyright and trademark laws.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                8. Limitation of Liability
              </h2>
              <p>
                Erazor AI is provided &quot;as is&quot; without warranties of
                any kind. We are not liable for any indirect, incidental,
                special, or consequential damages arising from your use of the
                service.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                9. Contact
              </h2>
              <p>
                For questions about these Terms, contact us at{" "}
                <a
                  href="mailto:legal@erazor.app"
                  className="text-primary hover:underline"
                >
                  legal@erazor.app
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
