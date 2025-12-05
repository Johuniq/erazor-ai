import { sampleLogos } from "@/constants/data"
import ScrollingLogos from "./scrolling-logo"

export function LogosSection() {

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-muted-foreground">Trusted by designers and teams at</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          <ScrollingLogos logos={sampleLogos} />
        </div>
      </div>
    </section>
  )
}
