import { cn } from "@/lib/utils";
import Image from "next/image";
import { Marquee } from "../ui/marque";

 const reviews = [
  {
    name: 'Sarah Chen',
    username: '@sarahdesigns',
    body: 'Game changer for my e-commerce store! Background removal that used to take me hours now takes seconds. The quality is incredible.',
    img: '/user.png'
  },
  {
    name: 'Marcus Rodriguez',
    username: '@marcusphoto',
    body: "As a photographer, I'm blown away by the precision. It handles complex hair and edges better than expensive desktop software.",
    img: '/user.png'
  },
  {
    name: 'Emily Watson',
    username: '@emilycreates',
    body: 'Perfect for social media content creation. The AI is so smart - it even preserves fine details like jewelry and accessories.',
    img: '/user.png'
  },
  {
    name: 'David Park',
    username: '@davidstudio',
    body: 'I run a small design agency and this tool has 10x our productivity. Clients love the quick turnaround times.',
    img: '/user.png'
  },
  {
    name: 'Lisa Thompson',
    username: '@lisashop',
    body: 'Switched from expensive alternatives and never looked back. The batch processing feature saves me so much time for product photos.',
    img: '/user.png'
  },
  {
    name: 'Alex Kumar',
    username: '@alexmarketing',
    body: 'The API integration was seamless. We process thousands of images daily and the consistency is remarkable. Highly recommend!',
    img: '/user.png'
  },
  {
    name: 'Rachel Green',
    username: '@rachelcontent',
    body: 'Finally, a background removal tool that actually works on mobile! Perfect for creating content on the go.',
    img: '/user.png'
  },
  {
    name: 'Tom Wilson',
    username: '@tomdigital',
    body: "The before/after quality blew my mind. It's like having a professional photo editor in your pocket. Worth every penny.",
    img: '/user.png'
  },
  {
    name: 'Priya Patel',
    username: '@priyatech',
    body: 'Integrated this into our workflow and cut editing time by 80%. The AI handles complex backgrounds flawlessly.',
    img: '/user.png'
  },
  {
    name: 'Jake Morrison',
    username: '@jakecreative',
    body: 'Best investment for my freelance business. Clients are impressed with the lightning-fast delivery and professional results.',
    img: '/user.png'
  }
];

export function TestimonialsSection() {
    const firstRow = reviews.slice(0, reviews.length / 2);
  const secondRow = reviews.slice(reviews.length / 2);
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary my-4">
            Testimonials
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Loved by 50K+ creators</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See what designers, marketers, and businesses say about Erazor AI.
          </p>
        </div>

      <div className='relative mt-10 flex w-full flex-col items-center justify-center overflow-hidden'>
        <Marquee pauseOnHover className='[--duration:20s]'>
          {firstRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className='[--duration:20s]'>
          {secondRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <div className='from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r'></div>
        <div className='from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l'></div>
      </div>
      </div>
    </section>
  )
}

const ReviewCard = ({
  img,
  name,
  username,
  body
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        'relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4',
        // light styles
        'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
        // dark styles
        'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]'
      )}
    >
      <div className='flex flex-row items-center gap-2'>
        <Image
          className='rounded-full'
          width={32}
          height={32}
          alt={`${name} avatar`}
          src={img}
        />
        <div className='flex flex-col'>
          <figcaption className='text-sm font-medium dark:text-white'>
            {name}
          </figcaption>
          <p className='text-xs font-medium dark:text-white/40'>{username}</p>
        </div>
      </div>
      <blockquote className='mt-2 text-sm'>{body}</blockquote>
    </figure>
  );
};