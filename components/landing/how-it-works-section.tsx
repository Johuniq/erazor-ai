import { Download, Upload, Wand2 } from "lucide-react"

const steps = [
  {
    icon: Upload,
    step: "1",
    title: "Upload your image",
    description: "Drag and drop or select from your device. We support JPG, PNG, and WebP.",
  },
  {
    icon: Wand2,
    step: "2",
    title: "AI processes it",
    description: "Our advanced AI analyzes and transforms your image in seconds.",
  },
  {
    icon: Download,
    step: "3",
    title: "Download result",
    description: "Get your high-quality processed image instantly. Ready to use.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className=" py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary my-4">
            How it works
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Three simple steps</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Transform your images in seconds with our intuitive workflow.
          </p>
        </div>

        <div className="relative mt-16">
          {/* Connection line */}
          <div className="absolute left-0 right-0 top-16 hidden h-0.5 bg-border md:block" />

          <div className="grid gap-12 md:grid-cols-3 md:gap-8">
            {steps.map((item, index) => (
              <div key={item.title} className="relative text-center">
                <div className="relative mx-auto mb-6 flex h-32 w-32 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-background" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                    <item.icon className="h-8 w-8" />
                  </div>
                  <span className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background">
                    {item.step}
                  </span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                <p className="mx-auto max-w-xs text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
