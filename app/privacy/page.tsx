import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - How We Protect Your Data | Erazor AI",
  description:
    "Learn how Erazor AI handles your data and protects your privacy. We are committed to transparency and security in processing your images.",
  openGraph: {
    title: "Privacy Policy | Erazor AI",
    description:
      "Learn how Erazor AI handles your data and protects your privacy.",
    url: "https://www.erazor.app/privacy",
    siteName: "Erazor AI",
    type: "website",
  },
  alternates: {
    canonical: "https://www.erazor.app/privacy",
  },
};

export default async function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="mt-4 text-muted-foreground">
            Last updated: December 2024
          </p>

          <div className="mt-8 space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                1. Information We Collect
              </h2>
              <p>
                When you use Erazor AI, we collect information you provide
                directly to us, including your email address, name, and payment
                information when you subscribe to a paid plan. We also collect
                images you upload for processing.
              </p>
              <p className="mt-3">
                For anonymous users (those who use our tools without signing
                up), we collect a browser fingerprint to track credit usage.
                This fingerprint does not contain personally identifiable
                information.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                2. How We Use Your Information
              </h2>
              <p>We use the information we collect to:</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>Provide, maintain, and improve our services</li>
                <li>Process your images using our AI technology</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Track anonymous usage to enforce credit limits</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                3. Image Processing & Storage
              </h2>
              <p>
                Images you upload are processed by our AI systems and stored
                temporarily. All uploaded images and processed results are
                automatically deleted from our servers within 24 hours of
                processing. We do not use your images to train our AI models.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                4. Data Security
              </h2>
              <p>
                We implement appropriate technical and organizational measures
                to protect your personal information. All data transmission is
                encrypted using SSL/TLS, and we use secure cloud infrastructure
                to store your data.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                5. Your Rights
              </h2>
              <p>
                You have the right to access, correct, or delete your personal
                information. You can manage your account settings or contact us
                to exercise these rights. You may also request a copy of your
                data or ask us to stop processing your information.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                6. Contact Us
              </h2>
              <p>
                If you have questions about this Privacy Policy, please contact
                us at{" "}
                <a
                  href="mailto:privacy@erazor.app"
                  className="text-primary hover:underline"
                >
                  privacy@erazor.app
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
