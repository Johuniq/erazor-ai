// This template requires the Embla Auto Scroll plugin to be installed:
//
// npm install embla-carousel-auto-scroll

"use client";

import AutoScroll from "embla-carousel-auto-scroll";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface Logo {
  id: string;
  description: string;
  image: string;
  className?: string;
}

interface LogosProps {
  heading?: string;
  logos?: Logo[];
  className?: string;
}

const Logos = ({
  heading = "Trusted by these companies",
  logos = [
    {
      id: "logo-1",
      description: "Shopify",
      image: "https://cdn.worldvectorlogo.com/logos/shopify.svg",
      className: "h-8 w-auto",
    },
    {
      id: "logo-2",
      description: "Figma",
      image: "https://cdn.worldvectorlogo.com/logos/figma-icon.svg",
      className: "h-8 w-auto",
    },
    {
      id: "logo-3",
      description: "Adobe",
      image: "https://cdn.worldvectorlogo.com/logos/adobe-1.svg",
      className: "h-8 w-auto",
    },
    {
      id: "logo-5",
      description: "Slack",
      image: "https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg",
      className: "h-8 w-auto",
    },
    {
      id: "logo-6",
      description: "Stripe",
      image: "https://cdn.worldvectorlogo.com/logos/stripe-4.svg",
      className: "h-8 w-auto",
    },
    {
      id: "logo-7",
      description: "Dribbble",
      image: "https://cdn.worldvectorlogo.com/logos/dribbble-icon.svg",
      className: "h-8 w-auto",
    },
    {
      id: "logo-8",
      description: "Behance",
      image: "https://cdn.worldvectorlogo.com/logos/behance-1.svg",
      className: "h-8 w-auto",
    },
    {
      id: "logo-9",
      description: "WordPress",
      image: "https://cdn.worldvectorlogo.com/logos/wordpress-icon.svg",
      className: "h-8 w-auto",
    },
  ],
}: LogosProps) => {
  return (
    <section className="">

      <div className="pt-6 sm:pt-8 md:pt-10 lg:pt-12">
        <div className="relative mx-auto flex items-center justify-center lg:max-w-5xl">
          <Carousel
            opts={{ loop: true }}
            plugins={[AutoScroll({ playOnInit: true })]}
          >
            <CarouselContent className="ml-0">
              {logos.map((logo) => (
                <CarouselItem
                  key={logo.id}
                  className="flex basis-1/2 justify-center pl-0 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                >
                  <div className="mx-6 sm:mx-8 md:mx-10 flex shrink-0 items-center justify-center">
                    <div>
                      <img
                        src={logo.image}
                        alt={logo.description}
                        className={logo.className}
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="absolute inset-y-0 left-0 w-8 sm:w-12 bg-linear-to-r from-background to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-8 sm:w-12 bg-linear-to-l from-background to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export { Logos };
