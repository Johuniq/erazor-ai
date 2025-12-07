import { AuthProvider } from "@/components/auth-provider";
import { CookieConsent } from "@/components/cookie-consent";
import { RootClient } from "@/components/RootClient";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import type React from "react";
import "./globals.css";

const space = Space_Grotesk({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default:
      "Erazor AI - Remove Backgrounds & Upscale Images Instantly | Free AI Tool",
    template: "%s | Erazor AI",
  },
  description:
    "Remove backgrounds and upscale images in seconds with AI. Try free - no signup required. Perfect for e-commerce, designers, and marketers. Trusted by 50,000+ users.",
  keywords: [
    "background removal",
    "remove background",
    "remove background from image",
    "background remover",
    "remove bg",
    "background eraser",
    "transparent background",
    "image upscaling",
    "upscale image",
    "AI image upscaler",
    "image enhancer",
    "increase image resolution",
    "AI image editing",
    "photo editing",
    "product photography",
    "AI photo editor",
    "free background remover",
    "online background remover",
    "ecommerce photo editing",
  ],
  authors: [{ name: "Erazor AI", url: "https://www.erazor.app" }],
  creator: "Erazor AI",
  publisher: "Erazor AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Erazor AI - Remove Backgrounds & Upscale Images Instantly",
    description:
      "Free AI-powered image processing. Remove backgrounds and upscale images in seconds. No signup required. Trusted by 50,000+ users worldwide.",
    type: "website",
    siteName: "Erazor AI",
    locale: "en_US",
    url: "https://www.erazor.app",
    images: [
      {
        url: "https://www.erazor.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Erazor AI - AI-Powered Background Removal & Image Upscaling",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@erazorai",
    creator: "@erazorai",
    title: "Erazor AI - Remove Backgrounds & Upscale Images Instantly",
    description:
      "Free AI-powered image processing. Remove backgrounds and upscale images in seconds. No signup required.",
    images: {
      url: "https://www.erazor.app/og-image.jpg",
      alt: "Erazor AI - AI-Powered Background Removal & Image Upscaling",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL("https://www.erazor.app"),
  alternates: {
    canonical: "https://www.erazor.app",
    languages: {
      "en-US": "https://www.erazor.app",
    },
  },
  category: "technology",
  classification: "Image Editing Software",
  referrer: "origin-when-cross-origin",
  verification: {
    google: "-vDPvwoV59xNhbusZ7ukVdea6H0u2K0bgqYbO3TjlKQ",
    yandex: "c054bf5b69da36f3",
    me: "117FCF20377F6D1208898A5975FB202C",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f14" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="msvalidate.01" content="117FCF20377F6D1208898A5975FB202C" />
        <meta name="yandex-verification" content="c054bf5b69da36f3" />
        <meta name="google-adsense-account" content="ca-pub-1826178787116871" />
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link rel="preconnect" href="https://app.chatwoot.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        {/* DNS prefetch for better performance */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//googletagmanager.com" />
        <link rel="dns-prefetch" href="//vercel-analytics.com" />

        {/* Preload critical resources */}
        <link rel="preload" href="/logo.png" as="image" />
        <link rel="preload" href="/assets/favicon.ico.png" as="image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://www.erazor.app/#organization",
                  name: "Erazor AI",
                  url: "https://www.erazor.app",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://www.erazor.app/logo.png",
                    width: 512,
                    height: 512,
                  },
                  sameAs: [
                    "https://twitter.com/erazorai",
                    "https://www.producthunt.com/products/erazor-ai",
                  ],
                  contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "customer support",
                    email: "support@erazor.app",
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.erazor.app/#website",
                  url: "https://www.erazor.app",
                  name: "Erazor AI",
                  publisher: { "@id": "https://www.erazor.app/#organization" },
                  potentialAction: {
                    "@type": "SearchAction",
                    target:
                      "https://www.erazor.app/search?q={search_term_string}",
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://www.erazor.app/#software",
                  name: "Erazor AI",
                  applicationCategory: "MultimediaApplication",
                  operatingSystem: "Web Browser",
                  offers: [
                    {
                      "@type": "Offer",
                      name: "Free",
                      price: "0",
                      priceCurrency: "USD",
                    },
                    {
                      "@type": "Offer",
                      name: "Pro",
                      price: "12",
                      priceCurrency: "USD",
                      priceValidUntil: "2025-12-31",
                    },
                    {
                      "@type": "Offer",
                      name: "Enterprise",
                      price: "29",
                      priceCurrency: "USD",
                      priceValidUntil: "2025-12-31",
                    },
                  ],
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: "4.9",
                    ratingCount: "50000",
                    bestRating: "5",
                    worstRating: "1",
                  },
                  description:
                    "AI-powered background removal and image upscaling tool. Remove backgrounds and upscale images instantly.",
                  screenshot: "https://www.erazor.app/og-image.jpg",
                  featureList: [
                    "AI Background Removal",
                    "Image Upscaling up to 4x",
                    "Batch Processing",
                    "API Access",
                    "HD Downloads",
                  ],
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`${space.variable} font-sans antialiased`}>
        <AuthProvider>
          <RootClient>
            {children}
          </RootClient>
        </AuthProvider>
        <Toaster position="top-center" richColors />
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  );
}
