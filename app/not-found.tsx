import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Page Not Found | Erazor AI Image Editor",
  description: "The page you're looking for doesn't exist. Return to Erazor AI Image Editor to access our AI-powered image editing tools.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-8xl font-bold text-primary">404</h1>
          <h2 className="mt-4 text-2xl font-semibold">Page not found</h2>
          <p className="mt-2 text-muted-foreground">Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
