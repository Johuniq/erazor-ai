import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy - 7-Day Money-Back Guarantee | Erazor AI Image Editor",
  description:
    "Erazor AI offers a hassle-free 7-day money-back guarantee on all paid plans. Learn about our refund policy, eligibility criteria, and how to request a refund for our AI image editing tools.",
  keywords: [
    "refund policy",
    "money-back guarantee",
    "7-day refund",
    "cancellation policy",
    "subscription refund",
    "payment terms",
    "refund eligibility",
    "customer satisfaction",
    "refund process",
    "billing policy",
    "subscription cancellation",
    "AI image editor refund",
    "service guarantee",
    "customer protection",
    "refund request"
  ],
  openGraph: {
    title: "Refund Policy - 7-Day Money-Back Guarantee | Erazor AI Image Editor",
    description:
      "Hassle-free 7-day money-back guarantee. Learn about our refund policy and how to request a refund for Erazor AI image editing services.",
    url: "https://www.erazor.app/refund",
    siteName: "Erazor AI Image Editor",
    images: [
      {
        url: "https://www.erazor.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Erazor AI Refund Policy - 7-Day Money-Back Guarantee",
        type: "image/jpeg",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Refund Policy - 7-Day Money-Back Guarantee | Erazor AI",
    description:
      "Hassle-free 7-day money-back guarantee for all Erazor AI paid plans. Customer satisfaction is our priority.",
    images: ["https://www.erazor.app/og-image.jpg"],
    creator: "@erazor_ai",
    site: "@erazor_ai",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.erazor.app/refund",
  },
  other: {
    "refund-period": "7 days",
    "processing-time": "3-5 business days",
    "last-updated": "December 7, 2025",
  },
};

export default function RefundPage() {
  return (
    <>
      {/* Structured Data for Refund Policy */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Refund Policy - Erazor AI",
            description: "Refund and cancellation policy for Erazor AI services",
            url: "https://www.erazor.app/refund",
            dateModified: "2025-12-07",
            publisher: {
              "@type": "Organization",
              name: "Erazor AI",
              url: "https://www.erazor.app",
            },
            mainEntity: {
              "@type": "Article",
              headline: "Refund Policy",
              datePublished: "2025-12-07",
              dateModified: "2025-12-07",
              author: {
                "@type": "Organization",
                name: "Erazor AI",
              },
            },
          }),
        }}
      />

      {/* FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is Erazor AI's refund policy?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Erazor AI offers a 7-day money-back guarantee on all paid subscription plans. If you're not satisfied with your purchase, you can request a full refund within 7 days of your initial subscription purchase or renewal.",
                },
              },
              {
                "@type": "Question",
                name: "How do I request a refund?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "To request a refund, email support@erazor.app with 'Refund Request' in the subject line and include your account email. We'll process your refund within 3-5 business days.",
                },
              },
              {
                "@type": "Question",
                name: "How long does it take to receive a refund?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Once your refund request is approved, it typically takes 3-5 business days to process. The refund will be issued to your original payment method, and it may take an additional 5-10 business days for the credit to appear in your account depending on your bank or payment provider.",
                },
              },
              {
                "@type": "Question",
                name: "Are used credits refundable?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No, credits that have already been used to process images are non-refundable. However, if you have technical issues preventing service usage, please contact support for assistance.",
                },
              },
              {
                "@type": "Question",
                name: "Can I get a refund after 7 days?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Refund requests made after the 7-day window are generally not eligible for refunds. However, if you experienced technical issues that prevented service usage, please contact our support team to discuss your situation.",
                },
              },
            ],
          }),
        }}
      />

      {/* Organization Contact Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Erazor AI",
            url: "https://www.erazor.app",
            contactPoint: [
              {
                "@type": "ContactPoint",
                email: "support@erazor.app",
                contactType: "Customer Support",
                availableLanguage: "English",
              },
              {
                "@type": "ContactPoint",
                email: "billing@erazor.app",
                contactType: "Billing Support",
                availableLanguage: "English",
              },
            ],
            sameAs: [
              "https://twitter.com/erazor_ai",
              "https://linkedin.com/company/erazor",
            ],
          }),
        }}
      />
        <div className='bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px]  border-b border-gray-200/50 pt-20 dark:border-gray-800/50 dark:from-orange-950/20 dark:to-purple-950/20'>
          <div className='container mx-auto px-6 py-16'>
            <div className='mx-auto max-w-4xl space-y-4 text-center'>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Refund Policy
          </h1>
              <p className="mt-4 text-muted-foreground">
            Last updated: December 07, 2025
          </p>
            </div>
          </div>
        </div>
      <main className="flex-1 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

          <div className="mt-8 space-y-8">
            {/* Overview */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Overview
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                At Erazor AI, we stand behind the quality of our AI-powered image
                processing services. We want you to be completely satisfied with
                your experience, which is why we offer a straightforward 7-day
                money-back guarantee on all paid subscription plans. This policy
                outlines the terms, conditions, and process for requesting refunds.
              </p>
            </section>

            {/* 7-Day Money-Back Guarantee */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                7-Day Money-Back Guarantee
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                We offer a full refund within 7 days of your subscription start
                date, no questions asked. This guarantee applies to:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li>First-time subscription purchases (Pro, Business, Enterprise plans)</li>
                <li>Annual subscription renewals within 7 days of the renewal date</li>
                <li>Monthly subscription renewals within 7 days of the renewal date</li>
                <li>Plan upgrades within 7 days of the upgrade date</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                If you're not completely satisfied with Erazor AI for any reason,
                simply contact us within 7 days and we'll process your refund
                promptly.
              </p>
            </section>

            {/* How to Request a Refund */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                How to Request a Refund
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Requesting a refund is simple and straightforward:
              </p>
              <ol className="mt-2 list-inside list-decimal space-y-2 text-muted-foreground">
                <li>
                  <strong>Send an email:</strong> Contact us at{" "}
                  <a href="mailto:support@erazor.app" className="text-primary hover:underline">
                    support@erazor.app
                  </a>{" "}
                  or{" "}
                  <a href="mailto:billing@erazor.app" className="text-primary hover:underline">
                    billing@erazor.app
                  </a>
                </li>
                <li>
                  <strong>Include key information:</strong> Use "Refund Request" in
                  the subject line and provide your account email address
                </li>
                <li>
                  <strong>Optional feedback:</strong> While not required, we
                  appreciate feedback on why you're requesting a refund to help us
                  improve
                </li>
                <li>
                  <strong>Receive confirmation:</strong> Our support team will
                  confirm receipt of your request within 24 hours
                </li>
                <li>
                  <strong>Refund processed:</strong> Once approved, refunds are
                  processed within 3-5 business days to your original payment method
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Note: Depending on your bank or payment provider, it may take an
                additional 5-10 business days for the refund to appear in your
                account.
              </p>
            </section>

            {/* Refund Eligibility */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Refund Eligibility Criteria
              </h2>
              
              <h3 className="mb-3 mt-4 text-lg font-semibold text-foreground">
                Eligible for Refund
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Refunds are available for the following situations:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li>First-time subscribers within 7 days of initial purchase</li>
                <li>Subscription renewals within 7 days of the renewal date</li>
                <li>Plan upgrades within 7 days of upgrade</li>
                <li>Technical issues that prevent service usage (documented with support)</li>
                <li>Billing errors or duplicate charges</li>
                <li>Service not meeting advertised capabilities</li>
                <li>Account suspended due to payment processing issues</li>
              </ul>

              <h3 className="mb-3 mt-4 text-lg font-semibold text-foreground">
                Not Eligible for Refund
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                The following are not eligible for refunds:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li>Credits or processing allowances that have already been used</li>
                <li>Refund requests made after the 7-day eligibility window</li>
                <li>Accounts terminated due to Terms of Service violations</li>
                <li>Pay-per-image purchases (one-time processing fees)</li>
                <li>API usage fees after images have been processed</li>
                <li>Promotional or discounted subscriptions (unless stated otherwise)</li>
                <li>Third-party integration or marketplace purchases</li>
              </ul>
            </section>

            {/* Subscription Cancellation */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Subscription Cancellation
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                You can cancel your subscription at any time:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li>
                  <strong>Cancel anytime:</strong> Go to your account settings →
                  Billing → Cancel Subscription
                </li>
                <li>
                  <strong>Access until period ends:</strong> You'll retain access to
                  paid features until the end of your current billing period
                </li>
                <li>
                  <strong>No automatic renewal:</strong> Your subscription won't
                  renew after cancellation
                </li>
                <li>
                  <strong>Unused credits:</strong> Any unused credits will expire at
                  the end of the billing period
                </li>
                <li>
                  <strong>Reactivation:</strong> You can reactivate your subscription
                  at any time
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                <strong>Important:</strong> Canceling your subscription is different
                from requesting a refund. If you cancel within the 7-day window and
                want a refund, you must explicitly request one via email.
              </p>
            </section>

            {/* Processing Time and Payment Methods */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Processing Time and Payment Methods
              </h2>
              
              <h3 className="mb-3 text-lg font-semibold text-foreground">
                Refund Processing Timeline
              </h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li>
                  <strong>Email response:</strong> Within 24 hours of your refund
                  request
                </li>
                <li>
                  <strong>Approval and processing:</strong> 3-5 business days after
                  approval
                </li>
                <li>
                  <strong>Bank/card processing:</strong> Additional 5-10 business
                  days depending on your financial institution
                </li>
              </ul>

              <h3 className="mb-3 mt-4 text-lg font-semibold text-foreground">
                Payment Method Specifics
              </h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li>
                  <strong>Credit/Debit Cards:</strong> Refunds are issued to the
                  original card used for payment
                </li>
                <li>
                  <strong>PayPal:</strong> Refunds are returned to your PayPal
                  account
                </li>
                <li>
                  <strong>Bank Transfers:</strong> Please provide bank details for
                  direct refund
                </li>
                <li>
                  <strong>Expired Cards:</strong> Contact your bank if your card has
                  expired; they can redirect the refund
                </li>
              </ul>
            </section>

            {/* Partial Refunds */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Partial Refunds and Pro-Rated Credits
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                In certain circumstances, we may offer partial refunds:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li>
                  <strong>Service Disruptions:</strong> If our service experiences
                  significant downtime, we may offer pro-rated credits or partial
                  refunds
                </li>
                <li>
                  <strong>Plan Downgrades:</strong> When downgrading mid-cycle, unused
                  time may be credited toward the lower-tier plan
                </li>
                <li>
                  <strong>Account Issues:</strong> Case-by-case evaluation for unique
                  circumstances
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Partial refunds are evaluated on a case-by-case basis. Please
                contact our support team to discuss your specific situation.
              </p>
            </section>

            {/* Special Circumstances */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Special Circumstances and Exceptions
              </h2>
              
              <h3 className="mb-3 text-lg font-semibold text-foreground">
                Technical Issues
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                If you experience technical problems that prevent you from using our
                service:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li>Contact our support team immediately to document the issue</li>
                <li>We'll work to resolve the problem as quickly as possible</li>
                <li>If the issue cannot be resolved, you may be eligible for a refund
                    regardless of the 7-day window</li>
                <li>Provide screenshots, error messages, and browser/system details to
                    expedite resolution</li>
              </ul>

              <h3 className="mb-3 mt-4 text-lg font-semibold text-foreground">
                Duplicate Charges or Billing Errors
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                If you notice duplicate charges or billing errors:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li>Report the issue to billing@erazor.app within 30 days</li>
                <li>Provide transaction details and proof of duplicate charges</li>
                <li>We'll investigate and process refunds for confirmed errors within
                    48 hours</li>
                <li>Duplicate charges are refunded regardless of the 7-day policy</li>
              </ul>

              <h3 className="mb-3 mt-4 text-lg font-semibold text-foreground">
                Unauthorized Charges
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                If you believe your account was charged without authorization, contact
                us immediately at support@erazor.app. We take security seriously and
                will investigate all claims of unauthorized access or charges.
              </p>
            </section>

            {/* Our Commitment */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Our Commitment to Customer Satisfaction
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                At Erazor AI, we're committed to providing exceptional service and
                value to our customers. Our refund policy reflects this commitment:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li>
                  <strong>Fair and Transparent:</strong> Clear terms with no hidden
                  conditions
                </li>
                <li>
                  <strong>Quick Processing:</strong> Fast turnaround on refund
                  requests
                </li>
                <li>
                  <strong>Customer-First Approach:</strong> We evaluate special
                  circumstances individually
                </li>
                <li>
                  <strong>Continuous Improvement:</strong> Your feedback helps us
                  improve our service
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                We believe in earning your business every day, not just on the day you
                subscribe. If we're not meeting your expectations, we want to know
                about it and make it right.
              </p>
            </section>

            {/* Changes to This Policy */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Changes to This Refund Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this refund policy from time to time to reflect changes
                in our services, legal requirements, or business practices. Any
                changes will be posted on this page with an updated "Last updated"
                date. Material changes will be communicated to active subscribers via
                email. Your continued use of our service after changes are posted
                constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Contact Us */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Questions or Concerns?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                If you have any questions about our refund policy or need assistance
                with a refund request, please don't hesitate to contact us:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:support@erazor.app" className="text-primary hover:underline">
                    support@erazor.app
                  </a>{" "}
                  (General inquiries)
                </li>
                <li>
                  <strong>Billing:</strong>{" "}
                  <a href="mailto:billing@erazor.app" className="text-primary hover:underline">
                    billing@erazor.app
                  </a>{" "}
                  (Refund requests)
                </li>
                <li>
                  <strong>Response Time:</strong> Within 24 hours (business days)
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Our support team is here to help ensure you have a positive experience
                with Erazor AI, whether that means helping you get the most out of our
                service or processing your refund request promptly and professionally.
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}