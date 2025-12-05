"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
   {
    id: '1',
    question: 'How accurate is the AI background removal?',
    answer:
      'Our AI achieves 99.9% accuracy in background removal. Using advanced neural networks, it can precisely identify subjects and remove backgrounds while preserving fine details like hair, fur, and complex edges.',
    category: 'technical'
  },
  {
    id: '2',
    question: 'What file formats are supported?',
    answer:
      'We support JPG, PNG, and WEBP formats for uploads. You can download your results as high-quality PNG files with transparency or add custom backgrounds.',
    category: 'technical'
  },
  {
    id: '3',
    question: 'How fast is the processing time?',
    answer:
      'Most images are processed in just 3 seconds! Our optimized AI models and cloud infrastructure ensure lightning-fast results without compromising quality.',
    category: 'general'
  },
  {
    id: '4',
    question: 'Is there a file size limit?',
    answer:
      'Free users can upload files up to 10MB. Pro users get higher limits up to 50MB, and can process 4K resolution images for professional quality output.',
    category: 'general'
  },
  {
    id: '5',
    question: 'What happens to my uploaded images?',
    answer:
      'Your privacy is our priority. Images are processed securely and automatically deleted from our servers after 24 hours. We never store or share your content.',
    category: 'support'
  },
  {
    id: '6',
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Yes! You can cancel your subscription at any time with no cancellation fees. Your plan remains active until the end of your billing period.',
    category: 'pricing'
  },
  {
    id: '7',
    question: 'Do unused credits roll over?',
    answer:
      'No, unused credits do not roll over to the next billing period. Credits reset monthly for all plans, so we recommend using your credits within the month to get the most value from your subscription.',
    category: 'pricing'
  },
  {
    id: '8',
    question: 'Can I use this for commercial purposes?',
    answer:
      'Absolutely! All our plans include commercial usage rights. You can use the processed images for business, e-commerce, marketing, and any commercial projects.',
    category: 'general'
  },
  {
    id: '9',
    question: 'How do I get started?',
    answer:
      'Simply upload your image, and our AI will automatically remove the background in seconds. No sign-up required for your first try! Create an account to access more features and credits.',
    category: 'general'
  },
  {
    id: '10',
    question: 'How do I contact support?',
    answer:
      'You can reach our support team through the contact form on our website, email us directly, or use the live chat feature. Pro users get priority support response.',
    category: 'support'
  }

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
