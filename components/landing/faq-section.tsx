"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How many free credits do I get?",
    answer:
      "New users get 10 free credits upon signup. Anonymous users can try the tool with 3 free credits without creating an account.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "We support JPG, PNG, and WebP formats for uploads. All processed images are exported as high-quality PNG files with transparency support.",
  },
  {
    question: "How long are my images stored?",
    answer:
      "For privacy, all uploaded and processed images are automatically deleted from our servers within 24 hours. We recommend downloading your results immediately.",
  },
  {
    question: "Can I use Erazor AI for commercial projects?",
    answer:
      "Yes! All processed images are yours to use for any purpose, including commercial projects. You retain full rights to your images.",
  },
  {
    question: "What's the maximum image size I can upload?",
    answer:
      "Free users can upload images up to 10MB. Pro and Enterprise users can upload images up to 50MB. For best results, we recommend images with at least 1000 pixels on the longest side.",
  },
  {
    question: "Do credits expire?",
    answer:
      "Credits on the free plan never expire. For subscription plans, unused credits reset at the beginning of each billing cycle.",
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary my-4">
            FAQ
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Frequently asked questions</h2>
          <p className="mt-4 text-lg text-muted-foreground">Everything you need to know about Erazor AI.</p>
        </div>

        <Accordion type="single" collapsible className="mt-12">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-base font-medium">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
