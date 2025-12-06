import { Logos } from "./scrolling-logo";

export function LogosSection() {
const data = {
  heading: "Trusted by these companies",
  logos: [
    {
      id: "logo-1",
      description: "Shopify",
      image: "https://cdn.worldvectorlogo.com/logos/shopify.svg",
      className: "h-6 sm:h-7 lg:h-8 w-auto",
    },
    {
      id: "logo-2",
      description: "Figma",
      image: "https://cdn.worldvectorlogo.com/logos/figma-icon.svg",
      className: "h-6 sm:h-7 lg:h-8 w-auto",
    },
    {
      id: "logo-3",
      description: "Adobe",
      image: "https://cdn.worldvectorlogo.com/logos/adobe-1.svg",
      className: "h-6 sm:h-7 lg:h-8 w-auto",
    },
    {
      id: "logo-5",
      description: "Slack",
      image: "https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg",
      className: "h-6 sm:h-7 lg:h-8 w-auto",
    },
    {
      id: "logo-6",
      description: "Stripe",
      image: "https://cdn.worldvectorlogo.com/logos/stripe-4.svg",
      className: "h-6 sm:h-7 lg:h-8 w-auto",
    },
    {
      id: "logo-7",
      description: "Dribbble",
      image: "https://cdn.worldvectorlogo.com/logos/dribbble-icon.svg",
      className: "h-6 sm:h-7 lg:h-8 w-auto",
    },
    {
      id: "logo-8",
      description: "Behance",
      image: "https://cdn.worldvectorlogo.com/logos/behance-1.svg",
      className: "h-6 sm:h-7 lg:h-8 w-auto",
    },
    {
      id: "logo-9",
      description: "WordPress",
      image: "https://cdn.worldvectorlogo.com/logos/wordpress-icon.svg",
      className: "h-6 sm:h-7 lg:h-8 w-auto",
    }
  ],
};
  return (
    <section className="py-8 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs sm:text-sm font-medium text-muted-foreground">Trusted by designers and teams at</p>
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-8 gap-y-4 sm:gap-y-6">
          <Logos {...data} />
        </div>
      </div>
    </section>
  )
}
