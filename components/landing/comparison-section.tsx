"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, X } from "lucide-react"
import Link from "next/link"

const competitors = [
  {
    name: "Remove.bg",
    price: "$1.99/image",
    speed: "~10s",
    quality: "Good",
    freeCredits: "1",
    api: true,
    batch: false,
  },
  {
    name: "PhotoRoom",
    price: "$9.99/mo",
    speed: "~8s",
    quality: "Good",
    freeCredits: "3",
    api: true,
    batch: true,
  },
  {
    name: "Erazor AI",
    price: "Free to start",
    speed: "< 5s",
    quality: "Excellent",
    freeCredits: "3 (10 on signup)",
    api: true,
    batch: true,
    highlight: true,
  },
]

export function ComparisonSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
           <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary my-4">
             Why Choose Us
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">See how we compare</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Erazor AI delivers professional results at unbeatable value
          </p>
        </div>

        <div className="mt-16 overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-4 text-left text-sm font-medium text-muted-foreground">Feature</th>
                {competitors.map((comp) => (
                  <th
                    key={comp.name}
                    className={`pb-4 text-center text-sm font-medium ${comp.highlight ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {comp.highlight && <Badge className="mb-2 text-xs">Best Choice</Badge>}
                    <div className={comp.highlight ? "text-lg font-bold text-foreground" : ""}>{comp.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-4 text-sm font-medium">Pricing</td>
                {competitors.map((comp) => (
                  <td
                    key={comp.name}
                    className={`py-4 text-center text-sm ${comp.highlight ? "font-semibold text-primary" : ""}`}
                  >
                    {comp.price}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-4 text-sm font-medium">Processing Speed</td>
                {competitors.map((comp) => (
                  <td
                    key={comp.name}
                    className={`py-4 text-center text-sm ${comp.highlight ? "font-semibold text-primary" : ""}`}
                  >
                    {comp.speed}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-4 text-sm font-medium">Quality</td>
                {competitors.map((comp) => (
                  <td
                    key={comp.name}
                    className={`py-4 text-center text-sm ${comp.highlight ? "font-semibold text-primary" : ""}`}
                  >
                    {comp.quality}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-4 text-sm font-medium">Free Credits</td>
                {competitors.map((comp) => (
                  <td
                    key={comp.name}
                    className={`py-4 text-center text-sm ${comp.highlight ? "font-semibold text-primary" : ""}`}
                  >
                    {comp.freeCredits}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-4 text-sm font-medium">API Access</td>
                {competitors.map((comp) => (
                  <td key={comp.name} className="py-4 text-center">
                    {comp.api ? (
                      <Check className={`mx-auto h-5 w-5 ${comp.highlight ? "text-primary" : "text-green-500"}`} />
                    ) : (
                      <X className="mx-auto h-5 w-5 text-muted-foreground" />
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-4 text-sm font-medium">Batch Processing</td>
                {competitors.map((comp) => (
                  <td key={comp.name} className="py-4 text-center">
                    {comp.batch ? (
                      <Check className={`mx-auto h-5 w-5 ${comp.highlight ? "text-primary" : "text-green-500"}`} />
                    ) : (
                      <X className="mx-auto h-5 w-5 text-muted-foreground" />
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" asChild className="gap-2">
            <Link href="/tools/remove-background">
              Try It Free Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
