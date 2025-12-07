import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { createClient } from "@/lib/supabase/server";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - AI Background Remover | Erazor AI',
  description:
    'Learn how Erazor AI protects your privacy and handles your data when using our AI background removal service. GDPR compliant with secure image processing and automatic deletion.',
  keywords: [
    'privacy policy',
    'data protection',
    'AI background remover privacy',
    'image data security',
    'GDPR compliance',
    'CCPA privacy rights',
    'secure photo editing',
    'data handling policy',
    'image processing privacy',
    'background removal privacy',
    'AI photo editor security',
    'user data protection',
    'cookie policy',
    'data deletion',
    'privacy rights'
  ],
  openGraph: {
    title: 'Privacy Policy - AI Background Remover | Erazor AI',
    description:
      'Your privacy is our priority. Learn how we protect your data and images with secure processing, automatic deletion, and GDPR compliance.',
    url: '/privacy',
    siteName: 'Erazor AI',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Erazor AI Privacy Policy - Data Protection',
        type: 'image/jpeg'
      }
    ],
    type: 'website',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy - AI Background Remover | Erazor AI',
    description:
      'Secure AI background removal with GDPR compliance, automatic image deletion, and strong data protection.',
    images: ['/og-image.jpg'],
    creator: '@erazor_ai',
    site: '@erazor_ai'
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  alternates: {
    canonical: '/privacy'
  },
  other: {
    'data-retention': '24 hours for images',
    'compliance': 'GDPR, CCPA compliant',
    'last-updated': 'September 14, 2025'
  }
};

export default async function PrivacyPolicyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header isLoggedIn={!!user} userEmail={user?.email} />
        <main className="flex-1 py-16">

        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-muted-foreground">
            Last updated: September 14, 2025
          </p>

          <div className="mt-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                  Erazor AI (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or
                  &ldquo;us&rdquo;) is committed to protecting your privacy.
                  This Privacy Policy explains how we collect, use, disclose,
                  and safeguard your information when you use our AI-powered
                  background removal service available at erazor.com (the
                  &ldquo;Service&rdquo;).
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                  By using our Service, you agree to the collection and use of
                  information in accordance with this Privacy Policy. If you do
                  not agree with our policies and practices, please do not use
                  our Service.
                </p>
              </section>

            {/* Information We Collect */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Information We Collect
              </h2>

              <h3 className="mb-3 text-lg font-semibold text-foreground">
                Personal Information
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                  We may collect personal information that you voluntarily
                  provide to us when you:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                  <li>Create an account or register for our Service</li>
                  <li>Upload images for background removal</li>
                  <li>
                    Subscribe to our newsletter or marketing communications
                  </li>
                  <li>Contact us for customer support</li>
                <li>Make a purchase or payment</li>
              </ul>

              <p className="mt-3 text-muted-foreground leading-relaxed mb-2">
                This information may include:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                  <li>Name and email address</li>
                  <li>Billing and payment information</li>
                  <li>Account credentials</li>
                  <li>Communication preferences</li>
                <li>Images you upload for processing</li>
              </ul>

              <h3 className="mb-3 mt-4 text-lg font-semibold text-foreground">
                Automatically Collected Information
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                  When you use our Service, we may automatically collect certain
                  information:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                  <li>IP address and location data</li>
                  <li>Browser type and version</li>
                  <li>Device information and operating system</li>
                  <li>Usage patterns and preferences</li>
                  <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                How We Use Your Information
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                  We use the information we collect for various purposes:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                  <li>
                    <strong>Service Provision:</strong> To provide, maintain,
                    and improve our background removal service
                  </li>
                  <li>
                    <strong>Image Processing:</strong> To process your uploaded
                    images using our AI technology
                  </li>
                  <li>
                    <strong>Account Management:</strong> To manage your account
                    and provide customer support
                  </li>
                  <li>
                    <strong>Billing:</strong> To process payments and manage
                    subscriptions
                  </li>
                  <li>
                    <strong>Communication:</strong> To send service-related
                    notifications and updates
                  </li>
                  <li>
                    <strong>Improvement:</strong> To analyze usage patterns and
                    improve our Service
                  </li>
                  <li>
                    <strong>Legal Compliance:</strong> To comply with legal
                    obligations and protect our rights
                  </li>
                </ul>
              </section>

            {/* Image Data Handling */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Image Data Handling
              </h2>
              <h3 className="mb-3 text-lg font-semibold text-foreground">
                Important: Your Images
              </h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                    <li>
                      <strong>Temporary Storage:</strong> Uploaded images are
                      temporarily stored for processing only
                    </li>
                    <li>
                      <strong>Automatic Deletion:</strong> Images are
                      automatically deleted from our servers within 24 hours
                    </li>
                    <li>
                      <strong>No Training Data:</strong> Your images are never
                      used to train our AI models
                    </li>
                    <li>
                      <strong>Secure Processing:</strong> All image processing
                      occurs in secure, encrypted environments
                    </li>
                    <li>
                      <strong>No Human Access:</strong> Our staff cannot access
                      your uploaded images
                    </li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Information Sharing and Disclosure
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                  We do not sell, trade, or otherwise transfer your personal
                  information to third parties, except in the following
                  circumstances:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                  <li>
                    <strong>Service Providers:</strong> We may share information
                    with trusted third-party service providers who assist in
                    operating our Service
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> We may disclose
                    information when required by law or to protect our rights
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> Information may be
                    transferred in connection with a merger, acquisition, or
                    asset sale
                  </li>
                  <li>
                    <strong>Consent:</strong> We may share information when you
                    have given explicit consent
                  </li>
                </ul>
              </section>

            {/* Data Security */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Data Security
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                  We implement appropriate technical and organizational security
                  measures to protect your information:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                  <li>SSL/TLS encryption for data transmission</li>
                  <li>Encrypted storage of sensitive information</li>
                  <li>Regular security audits and assessments</li>
                  <li>Access controls and authentication measures</li>
                <li>Employee training on data protection</li>
              </ul>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                  However, no method of transmission over the internet or
                  electronic storage is 100% secure. We cannot guarantee
                  absolute security but strive to use commercially acceptable
                  means to protect your information.
                </p>
              </section>

            {/* Your Rights */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Your Privacy Rights
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                  Depending on your location, you may have the following rights
                  regarding your personal information:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                  <li>
                    <strong>Access:</strong> Request access to your personal
                    information
                  </li>
                  <li>
                    <strong>Correction:</strong> Request correction of
                    inaccurate information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your personal
                    information
                  </li>
                  <li>
                    <strong>Portability:</strong> Request a copy of your
                    information in a portable format
                  </li>
                  <li>
                    <strong>Objection:</strong> Object to certain processing of
                    your information
                  </li>
                  <li>
                    <strong>Restriction:</strong> Request restriction of
                    processing in certain circumstances
                </li>
              </ul>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                  To exercise these rights, please contact us using the
                  information provided in the &ldquo;Contact Us&rdquo; section
                  below.
                </p>
              </section>

            {/* Cookies */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Cookies and Tracking
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                  We use cookies and similar tracking technologies to enhance
                  experience:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                  <li>
                    <strong>Essential Cookies:</strong> Required for the Service
                    to function properly
                  </li>
                  <li>
                    <strong>Analytics Cookies:</strong> Help us understand how
                    you use our Service
                  </li>
                  <li>
                    <strong>Preference Cookies:</strong> Remember your settings
                    and preferences
                </li>
              </ul>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                You can control cookies through your browser settings.
                However, disabling certain cookies may affect the
                functionality of our Service. For more information, see our{' '}
                <a href="/cookie-policy" className="text-primary underline hover:text-primary/80">
                  Cookie Policy
                </a>
                .
              </p>
            </section>

            {/* Third-Party Services */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Third-Party Services
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                  Our Service may contain links to third-party websites or
                  integrate with third-party services. We are not responsible
                  for the privacy practices of these third parties. We encourage
                  you to review their privacy policies.
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed mb-2">
                Third-party services we may use include:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                  <li>Payment processors (Stripe, PayPal)</li>
                  <li>Analytics services (Google Analytics)</li>
                  <li>Customer support tools</li>
                  <li>Cloud storage providers</li>
                </ul>
              </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Children&apos;s Privacy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                  Our Service is not intended for children under 13 years of
                  age. We do not knowingly collect personal information from
                  children under 13. If we become aware that we have collected
                  personal information from a child under 13, we will take steps
                  to delete such information.
                </p>
              </section>

            {/* International Transfers */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                International Data Transfers
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                  Your information may be transferred to and processed in
                  countries other than your country of residence. We ensure that
                  such transfers comply with applicable data protection laws and
                  implement appropriate safeguards to protect your information.
                </p>
              </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Changes to This Privacy Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. We will
                  notify you of any material changes by posting the new Privacy
                  Policy on our website and updating the &ldquo;Last
                  updated&rdquo; date. Your continued use of the Service after
                  such changes constitutes acceptance of the updated Privacy
                  Policy.
                </p>
              </section>

            {/* Contact Information */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                  If you have any questions about this Privacy Policy or our
                  privacy practices, please contact us:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li><strong>Email:</strong> privacy@erazor.app</li>
                <li><strong>Support:</strong> support@erazor.app</li>
                <li><strong>Response Time:</strong> We will respond to privacy inquiries within 30 days</li>
              </ul>
            </section>

            {/* GDPR/CCPA Compliance */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Regional Privacy Rights
              </h2>

              <h3 className="mb-3 text-lg font-semibold text-foreground">
                European Union (GDPR)
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                  If you are located in the European Union, you have additional
                  rights under the General Data Protection Regulation (GDPR),
                  including the right to lodge a complaint with a supervisory
                  authority.
              </p>

              <h3 className="mb-3 mt-4 text-lg font-semibold text-foreground">
                California (CCPA)
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                  California residents have specific rights under the California
                  Consumer Privacy Act (CCPA), including the right to know what
                  personal information is collected and the right to delete
                  personal information.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>

    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Privacy Policy - Erazor AI',
          description: 'Privacy policy for Erazor AI background removal service',
          url: 'https://erazor.app/privacy',
          dateModified: '2025-09-14',
          publisher: {
            '@type': 'Organization',
            name: 'Erazor AI',
            url: 'https://erazor.app'
          },
          mainEntity: {
            '@type': 'Article',
            headline: 'Privacy Policy',
            datePublished: '2025-09-14',
            dateModified: '2025-09-14',
            author: {
              '@type': 'Organization',
              name: 'Erazor AI'
            },
            publisher: {
              '@type': 'Organization',
              name: 'Erazor AI',
              logo: {
                '@type': 'ImageObject',
                url: 'https://erazor.app/logo.png'
              }
            }
          }
        })
      }}
    />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'How long do you store uploaded images?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Uploaded images are automatically deleted from our servers within 24 hours after processing. We do not permanently store your images.'
              }
            },
            {
              '@type': 'Question',
              name: 'Do you use my images to train your AI models?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'No, we never use your uploaded images to train our AI models. Your images are processed for background removal only and then automatically deleted.'
              }
            },
            {
              '@type': 'Question',
              name: 'Is Erazor AI GDPR compliant?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, Erazor AI is fully GDPR compliant. We respect your privacy rights including access, correction, deletion, and data portability rights.'
              }
            },
            {
              '@type': 'Question',
              name: 'How can I delete my personal data?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'You can request deletion of your personal data by contacting us at privacy@erazor.app. We will respond within 30 days and delete your data as required by law.'
              }
            },
            {
              '@type': 'Question',
              name: 'What data do you collect about me?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'We collect minimal data including your email address for account creation, payment information for subscriptions, and usage analytics. We do not collect or store your processed images permanently.'
              }
            }
          ]
        })
      }}
    />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Erazor AI',
          url: 'https://erazor.app',
          contactPoint: {
            '@type': 'ContactPoint',
            email: 'privacy@erazor.app',
            contactType: 'Privacy Officer',
            availableLanguage: 'English'
          },
          sameAs: [
            'https://twitter.com/erazor_ai',
            'https://linkedin.com/company/erazor'
          ],
          privacyPolicy: 'https://erazor.app/privacy'
        })
      }}
    />
    </>
  )
}