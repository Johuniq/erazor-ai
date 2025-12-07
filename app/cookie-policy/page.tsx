
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy - AI Background Remover | Erazor AI',
  description:
    'Learn about how Erazor AI uses cookies and similar technologies to enhance your experience with our AI background removal service. Manage your cookie preferences and understand data collection.',
  keywords: [
    'cookie policy',
    'cookies',
    'web tracking',
    'data collection',
    'privacy settings',
    'cookie consent',
    'analytics cookies',
    'functional cookies',
    'marketing cookies',
    'third-party cookies',
    'browser settings',
    'cookie management',
    'GDPR cookies',
    'tracking technologies',
    'user preferences'
  ],
  openGraph: {
    title: 'Cookie Policy - AI Background Remover | Erazor AI',
    description:
      'Transparent cookie policy for Erazor AI. Learn how we use cookies to improve your experience and manage your preferences.',
    url: '/cookie-policy',
    siteName: 'Erazor AI',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Erazor AI Cookie Policy - Privacy and Preferences',
        type: 'image/jpeg'
      }
    ],
    type: 'website',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cookie Policy - AI Background Remover | Erazor AI',
    description:
      'Transparent cookie usage and privacy controls for AI background removal service. Manage your preferences easily.',
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
    canonical: '/cookie-policy'
  },
  other: {
    'cookie-types': 'Necessary, Analytics, Functional, Marketing',
    'consent-management': 'User-controlled preferences',
    'last-updated': 'September 15, 2025',
    'data-retention': 'Variable by cookie type'
  }
};

export default async function CookiePolicyPage() {
  return (
    <div>
      
      {/* Structured Data for Cookie Policy */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Cookie Policy - Erazor AI',
            description: 'Cookie policy explaining how Erazor AI uses cookies and tracking technologies',
            url: 'https://erazor.app/cookie-policy',
            dateModified: '2025-09-15',
            publisher: {
              '@type': 'Organization',
              name: 'Erazor AI',
              url: 'https://erazor.app'
            },
            mainEntity: {
              '@type': 'Article',
              headline: 'Cookie Policy',
              datePublished: '2025-09-15',
              dateModified: '2025-09-15',
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

      {/* Cookie Categories Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: 'Cookie Usage and Categories',
            description: 'Detailed explanation of cookie types and usage on Erazor AI',
            author: {
              '@type': 'Organization',
              name: 'Erazor AI'
            },
            publisher: {
              '@type': 'Organization',
              name: 'Erazor AI'
            },
            datePublished: '2025-09-15',
            dateModified: '2025-09-15',
            about: [
              {
                '@type': 'Thing',
                name: 'Necessary Cookies',
                description: 'Essential cookies for website functionality'
              },
              {
                '@type': 'Thing',
                name: 'Analytics Cookies',
                description: 'Cookies for tracking website usage and performance'
              },
              {
                '@type': 'Thing',
                name: 'Functional Cookies',
                description: 'Cookies for enhanced functionality and personalization'
              },
              {
                '@type': 'Thing',
                name: 'Marketing Cookies',
                description: 'Cookies for advertising and marketing campaigns'
              }
            ]
          })
        }}
      />

      {/* FAQ Structured Data for Cookies */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What cookies does Erazor AI use?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Erazor AI uses four types of cookies: Necessary cookies for essential functionality, Analytics cookies for usage tracking, Functional cookies for enhanced features, and Marketing cookies for advertising campaigns.'
                }
              },
              {
                '@type': 'Question',
                name: 'How can I manage my cookie preferences?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'You can manage cookie preferences through our cookie consent tool, browser settings, or by contacting us. You can accept all, reject non-essential, or customize preferences for different cookie types.'
                }
              },
              {
                '@type': 'Question',
                name: 'Are cookies necessary for the website to work?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Some cookies are essential for basic functionality like authentication and security. However, analytics and marketing cookies are optional and can be disabled without affecting core features.'
                }
              },
              {
                '@type': 'Question',
                name: 'How long are cookies stored?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Cookie storage varies by type: Session cookies are deleted when you close your browser, authentication cookies last 30 days, preference cookies last 1 year, analytics cookies last 2 years, and marketing cookies last 90 days.'
                }
              },
              {
                '@type': 'Question',
                name: 'What third-party services use cookies on your site?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'We use Google Analytics for website analytics, Chatwoot for customer support, Stripe and PayPal for payments, and various marketing tools. Each service has its own cookie policy.'
                }
              }
            ]
          })
        }}
      />

      {/* Privacy Organization Schema */}
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
              contactType: 'Privacy and Cookie Support',
              availableLanguage: 'English'
            },
            sameAs: [
              'https://twitter.com/erazor_ai',
              'https://linkedin.com/company/erazor'
            ],
            privacyPolicy: 'https://erazor.app/privacy',
            cookiePolicy: 'https://erazor.app/cookie-policy'
          })
        }}
      />
        <div className='bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px]  border-b border-gray-200/50 pt-20 dark:border-gray-800/50 dark:from-orange-950/20 dark:to-purple-950/20'>
          <div className='container mx-auto px-6 py-16'>
            <div className='mx-auto max-w-4xl space-y-4 text-center'>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Cookie Policy
          </h1>
              <p className="mt-4 text-muted-foreground">
            Last updated: December 07, 2025
          </p>
            </div>
          </div>
        </div>
      <main className="flex-1 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

          <div className="mt-8 space-y-8">{/* Content */}
            {/* Introduction */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                What Are Cookies?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                  Cookies are small text files that are stored on your device
                  when you visit our website. They help us provide you with a
                  better experience by remembering your preferences, analyzing
                  site usage, and enabling certain features of our AI background
                  removal service.
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                This Cookie Policy explains how Erazor AI (&ldquo;we,&rdquo;
                &ldquo;our,&rdquo; or &ldquo;us&rdquo;) uses cookies and
                similar technologies on our website at erazor.app (the
                &ldquo;Service&rdquo;).
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                By continuing to use our Service, you consent to our use of
                cookies in accordance with this Cookie Policy.
              </p>
            </section>

            {/* Types of Cookies */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Types of Cookies We Use
              </h2>

              <h3 className="mb-3 text-lg font-semibold text-foreground">
                Necessary Cookies
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                These cookies are essential for the website to function
                properly and cannot be disabled.
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li>
                  <strong>Authentication:</strong> Remember your login
                  status and keep you signed in
                </li>
                <li>
                  <strong>Security:</strong> Protect against cross-site
                  request forgery and other security threats
                </li>
                <li>
                  <strong>Session Management:</strong> Maintain your session
                  while using the service
                </li>
                <li>
                  <strong>Cookie Preferences:</strong> Remember your cookie
                  consent choices
                </li>
              </ul>

              <h3 className="mb-3 mt-6 text-lg font-semibold text-foreground">
                Analytics Cookies
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                These cookies help us understand how visitors interact with
                our website and improve our service.
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li>
                  <strong>Google Analytics:</strong> Tracks website usage,
                  page views, and user behavior
                </li>
                <li>
                  <strong>Performance Monitoring:</strong> Helps us identify
                  and fix technical issues
                </li>
                <li>
                  <strong>Feature Usage:</strong> Shows us which features
                  are most popular
                </li>
                <li>
                  <strong>Error Tracking:</strong> Helps us improve service
                  reliability
                </li>
              </ul>

              <h3 className="mb-3 mt-6 text-lg font-semibold text-foreground">
                Functional Cookies
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                These cookies enable enhanced functionality and
                personalization features.
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li>
                  <strong>Chat Support:</strong> Enable the customer support
                  chat widget (Chatwoot)
                </li>
                <li>
                  <strong>Theme Preferences:</strong> Remember your
                  dark/light mode preference
                </li>
                <li>
                  <strong>Language Settings:</strong> Store your preferred
                  language
                </li>
                <li>
                  <strong>User Interface:</strong> Remember your layout and
                  display preferences
                </li>
              </ul>

              <h3 className="mb-3 mt-6 text-lg font-semibold text-foreground">
                Marketing Cookies
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                These cookies are used to deliver relevant advertisements
                and track marketing campaign effectiveness.
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li>
                  <strong>Google Ads:</strong> Show you relevant
                  advertisements on other websites
                </li>
                <li>
                  <strong>Facebook Pixel:</strong> Track conversions from
                  social media campaigns
                </li>
                <li>
                  <strong>Retargeting:</strong> Show you ads for our service
                  on other websites
                </li>
                <li>
                  <strong>Campaign Tracking:</strong> Measure the
                  effectiveness of our marketing efforts
                </li>
              </ul>
            </section>

            {/* Third-Party Cookies */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Third-Party Cookies and Services
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We use several third-party services that may set their own
                cookies. These services help us provide better functionality
                and understand how our service is used.
              </p>

              <h3 className="mb-3 mt-4 text-lg font-semibold text-foreground">
                Analytics and Performance
              </h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li>
                  <strong>Google Analytics:</strong> Web analytics service
                  that tracks and reports website traffic
                </li>
                <li>
                  <strong>Vercel Analytics:</strong> Performance monitoring
                  and web vitals tracking
                </li>
                <li>
                  <strong>Sentry:</strong> Error tracking and performance
                  monitoring
                </li>
              </ul>

              <h3 className="mb-3 mt-4 text-lg font-semibold text-foreground">
                Support and Communication
              </h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li>
                  <strong>Chatwoot:</strong> Customer support chat widget for
                  real-time assistance
                </li>
                <li>
                  <strong>Mailchimp:</strong> Email marketing and newsletter
                  services
                </li>
              </ul>

              <h3 className="mb-3 mt-4 text-lg font-semibold text-foreground">
                Payment Processing
              </h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li>
                  <strong>Stripe:</strong> Secure payment processing for
                  subscriptions and purchases
                </li>
                <li>
                  <strong>PayPal:</strong> Alternative payment method with its
                  own cookie policy
                </li>
              </ul>
            </section>

            {/* Cookie Management */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Managing Your Cookie Preferences
              </h2>

              <h3 className="mb-3 text-lg font-semibold text-foreground">
                Our Cookie Consent Tool
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                When you first visit our website, you&apos;ll see a cookie
                consent banner that allows you to:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li>Accept all cookies for the best experience</li>
                <li>Reject all non-essential cookies</li>
                <li>
                  Customize your preferences for different types of cookies
                </li>
                <li>
                  Change your preferences at any time using the cookie
                  settings
                </li>
              </ul>

              <h3 className="mb-3 mt-4 text-lg font-semibold text-foreground">
                Browser Settings
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                You can also manage cookies through your browser settings.
                Most browsers allow you to:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground mb-3">
                <li>View and delete existing cookies</li>
                <li>Block all cookies or cookies from specific websites</li>
                <li>Set preferences for cookie acceptance</li>
                <li>Clear cookies when you close your browser</li>
              </ul>

              <p className="text-muted-foreground leading-relaxed">
                <strong>Note:</strong> Disabling necessary cookies may
                affect the functionality of our website. Some features may
                not work properly without these cookies.
              </p>
            </section>

            {/* Browser-Specific Instructions */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Browser-Specific Cookie Management
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Here&apos;s how to manage cookies in popular browsers:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li><strong>Google Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
                <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                <li><strong>Microsoft Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
              </ul>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Cookie Data Retention
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Different types of cookies are stored for different periods:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Authentication Cookies:</strong> 30 days</li>
                <li><strong>Preference Cookies:</strong> 1 year</li>
                <li><strong>Analytics Cookies:</strong> 2 years</li>
                <li><strong>Marketing Cookies:</strong> 90 days</li>
              </ul>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Your Rights and Choices
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                You have several rights regarding cookies and your personal
                data:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground mb-3">
                <li>
                  <strong>Right to Object:</strong> You can object to the use
                  of non-essential cookies
                </li>
                <li>
                  <strong>Right to Withdraw Consent:</strong> You can change
                  your cookie preferences at any time
                </li>
                <li>
                  <strong>Right to Access:</strong> You can request
                  information about the data we collect
                </li>
                <li>
                  <strong>Right to Delete:</strong> You can request deletion
                  of your personal data
                </li>
              </ul>

              <p className="text-muted-foreground leading-relaxed">
                For more information about your privacy rights, please see our{' '}
                <a
                  href='/privacy'
                  className='text-primary underline hover:text-primary/80'
                >
                  Privacy Policy
                </a>
                .
              </p>
            </section>

            {/* Updates to Policy */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Updates to This Cookie Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We may update this Cookie Policy from time to time to reflect
                changes in our practices or for other operational, legal, or
                regulatory reasons.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                When we make material changes to this policy, we will notify
                you by updating the &ldquo;Last updated&rdquo; date at the top
                of this page and, where appropriate, provide additional notice
                on our website.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Contact Us About Cookies
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                If you have questions about our use of cookies or this Cookie
                Policy, please contact us:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li><strong>Email:</strong> privacy@erazor.app</li>
                <li><strong>Support:</strong> support@erazor.app</li>
                <li><strong>Subject Line:</strong> Cookie Policy Inquiry</li>
              </ul>
            </section>

            {/* Related Policies */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Related Policies
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                For more information about how we handle your data and our
                service terms, please review:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li>
                  <a href='/privacy' className='text-primary underline hover:text-primary/80'>
                    Privacy Policy
                  </a> - Learn how we collect, use, and protect your personal information
                </li>
                <li>
                  <a href='/terms' className='text-primary underline hover:text-primary/80'>
                    Terms of Service
                  </a> - Read the terms and conditions for using our AI background removal service
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}