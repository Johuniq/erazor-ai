/**
 * Schema.org JSON-LD Markup for SEO
 * Helps search engines understand the content better
 */

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Erazor AI",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "12547",
      "bestRating": "5",
      "worstRating": "1"
    },
    "description": "AI-powered image editing tools for removing backgrounds and upscaling images",
    "url": "https://www.erazor.app",
    "author": {
      "@type": "Organization",
      "name": "Erazor AI",
      "url": "https://www.erazor.app"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Erazor AI",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.erazor.app/logo.png"
      }
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function BackgroundRemoverSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "AI Background Remover - Erazor AI",
    "description": "Remove background from images instantly using AI. Free, automatic, no signup required.",
    "url": "https://www.erazor.app/tools/remove-background",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Automatic background removal",
      "AI-powered precision",
      "Transparent PNG output",
      "Batch processing for Pro users",
      "No watermarks",
      "Instant results"
    ],
    "screenshot": "https://www.erazor.app/og-bg-remover.jpg"
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ImageUpscalerSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "AI Image Upscaler - Erazor AI",
    "description": "Upscale images up to 4x resolution using AI while preserving quality. Free online image upscaler.",
    "url": "https://www.erazor.app/tools/upscale",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "4x image upscaling",
      "AI-powered enhancement",
      "Quality preservation",
      "Multiple format support",
      "Batch processing for Pro users",
      "Instant processing"
    ],
    "screenshot": "https://www.erazor.app/og-upscaler.jpg"
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function FAQSchema({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function HowToSchema({ 
  name, 
  description, 
  steps 
}: { 
  name: string
  description: string
  steps: Array<{ name: string; text: string }> 
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
