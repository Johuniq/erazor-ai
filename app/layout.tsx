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
      "Erazor AI - AI Image Editor | Remove Backgrounds & Upscale Images Instantly",
    template: "%s | Erazor AI",
  },
  description:
    "Professional AI-powered image editing tools. Remove backgrounds, upscale images up to 4x, and enhance photos in seconds. Free trial - no credit card required. Trusted by 50,000+ designers, marketers, and e-commerce sellers.",
  keywords: [
    "AI image editor",
    "AI image tools",
    "AI photo editor",
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
    "enhance image quality",
    "AI image enhancement",
    "photo enhancement",
    "AI image editing",
    "photo editing",
    "product photography",
    "free background remover",
    "online image editor",
    "ecommerce photo editing",
    "image processing",
    "AI photo enhancement",
    "professional image editing",
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
    title: "Erazor AI - AI Image Editor | Remove Backgrounds & Upscale Images",
    description:
      "Professional AI-powered image editing suite. Remove backgrounds instantly and upscale images up to 4x resolution. Free trial available. Trusted by 50,000+ professionals worldwide.",
    type: "website",
    siteName: "Erazor AI",
    locale: "en_US",
    url: "https://www.erazor.app",
    images: [
      {
        url: "https://www.erazor.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Erazor AI - Professional AI Image Editor with Background Removal & Upscaling",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@erazorai",
    creator: "@erazorai",
    title: "Erazor AI - AI Image Editor | Background Removal & Upscaling",
    description:
      "Professional AI-powered image editing. Remove backgrounds and upscale images up to 4x in seconds. Free trial available.",
    images: {
      url: "https://www.erazor.app/og-image.jpg",
      alt: "Erazor AI - AI-Powered Image Editor",
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
  classification: "AI Image Editing Software",
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
                    "Professional AI-powered image editing suite. Remove backgrounds instantly, upscale images up to 4x resolution, and enhance photos with advanced AI technology.",
                  screenshot: "https://www.erazor.app/og-image.jpg",
                  featureList: [
                    "AI Background Removal",
                    "Image Upscaling up to 4x",
                    "AI Image Enhancement",
                    "Batch Processing",
                    "API Access",
                    "HD Downloads",
                    "Multiple Image Formats",
                    "Professional Quality Output",
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
