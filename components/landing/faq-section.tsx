"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Script from "next/script"

const faqs = [
  {
    id: '1',
    question: 'What can Erazor AI do?',
    answer:
      'Erazor AI offers two powerful features: AI Background Removal and Image Upscaling. Remove backgrounds from any image with 99.9% accuracy, or enhance your images up to 4x resolution with our AI upscaler.',
    category: 'general'
  },
  {
    id: '2',
    question: 'How accurate is the AI background removal?',
    answer:
      'Our AI achieves 99.9% accuracy in background removal. Using advanced neural networks, it can precisely identify subjects and remove backgrounds while preserving fine details like hair, fur, and complex edges.',
    category: 'technical'
  },
  {
    id: '3',
    question: 'How does image upscaling work?',
    answer:
      'Our AI upscaler uses deep learning to intelligently enhance image resolution. Free users get 2x upscaling, Pro users get 4x upscaling with HD quality export, perfect for printing or professional use.',
    category: 'technical'
  },
  {
    id: '4',
    question: 'What file formats are supported?',
    answer:
      'We support JPG, PNG, and WEBP formats for uploads. Background removal results are available as PNG with transparency, while upscaled images maintain their original format with enhanced quality.',
    category: 'technical'
  },
  {
    id: '5',
    question: 'How fast is the processing time?',
    answer:
      'Background removal takes just 3-5 seconds! Image upscaling typically takes 10-20 seconds depending on the image size and upscale factor. Pro users get priority processing for faster results.',
    category: 'general'
  },
  {
    id: '6',
    question: 'Is there a file size limit?',
    answer:
      'Yes, file size limits vary by plan: Free users can upload up to 2MB, Pro users up to 10MB, and Enterprise users up to 20MB. This ensures fast processing while maintaining quality.',
    category: 'general'
  },
  {
    id: '7',
    question: 'What happens to my uploaded images?',
    answer:
      'Your privacy is our priority. Images are processed securely and automatically deleted from our servers after 24 hours. We never store or share your content.',
    category: 'support'
  },
  {
    id: '8',
    question: 'How many credits do I get?',
    answer:
      'Free users get 10 credits to start. Pro Monthly gives you 100 credits/month, Pro Yearly gives 1300 credits/year. Enterprise Monthly provides 200 credits/month, and Enterprise Yearly offers 2500 credits/year.',
    category: 'pricing'
  },
  {
    id: '9',
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Yes! You can cancel your subscription at any time with no cancellation fees. Your plan remains active until the end of your billing period.',
    category: 'pricing'
  },
  {
    id: '10',
    question: 'Do unused credits roll over?',
    answer:
      'No, unused credits do not roll over to the next billing period. Credits reset monthly for all plans, so we recommend using your credits within the month to get the most value from your subscription.',
    category: 'pricing'
  },
  {
    id: '11',
    question: 'Can I use this for commercial purposes?',
    answer:
      'Absolutely! All our plans include commercial usage rights. You can use the processed images for business, e-commerce, marketing, and any commercial projects.',
    category: 'general'
  },
  {
    id: '12',
    question: 'How do I get started?',
    answer:
      'Simply sign up for a free account and get 10 credits instantly. Upload your image and choose either background removal or upscaling. Our AI handles the rest in seconds!',
    category: 'general'
  }
]

export function FAQSection() {
  // Generate FAQPage JSON-LD schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  return (
    <section id="faq" className="py-24 sm:py-32">
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary my-4">
            FAQ
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Frequently asked questions</h2>
          <p className="mt-4 text-lg text-muted-foreground">Everything you need to know about Erazor AI.</p>
        </div>

        <Accordion type="single" collapsible className="mt-12">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={`item-${faq.id}`}>
              <AccordionTrigger className="text-left text-base font-medium">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
