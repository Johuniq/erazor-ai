import { IconBrandFacebook, IconBrandGithub, IconBrandProducthunt, IconBrandX } from "@tabler/icons-react"
import { Eraser } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Eraser className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Erazor AI</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Professional AI-powered image processing for designers, marketers, and e-commerce sellers. Remove
              backgrounds and upscale images in seconds.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="https://twitter.com/johuniq"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Twitter"
              >
                <IconBrandX/>
              </a>
              <a
                href="https://github.com/johuniq/erazor-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="GitHub"
              >
                <IconBrandGithub/>
              </a>
              <a
                href="https://www.producthunt.com/products/erazor"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-[#da552f] hover:text-white"
                aria-label="Product Hunt"
              >
                <IconBrandProducthunt/>
              </a>
              <a
                href="https://www.facebook.com/johuniq"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-[#da552f] hover:text-white"
                aria-label="Product Hunt"
              >
                <IconBrandFacebook/>
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Tools</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/tools/remove-background" className="transition-colors hover:text-foreground">
                  Background Removal
                </Link>
              </li>
              <li>
                <Link href="/tools/upscale" className="transition-colors hover:text-foreground">
                  Image Upscaling
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="transition-colors hover:text-foreground">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Company</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="transition-colors hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <a href="mailto:support@johuniq.tech" className="transition-colors hover:text-foreground">
                  support@johuniq.tech
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="transition-colors hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund" className="transition-colors hover:text-foreground">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Erazor AI. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">Made with ❤️ for creators worldwide by <a href="https://johuniq.tech" className="underline">Johuniq</a></p>
        </div>
      </div>
    </footer>
  )
}
