"use client"

import { usePathname } from "next/navigation"
import { Footer } from "./footer"
import { Header } from "./header"

export function RootClient({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
  return <>
  {
    pathname != "/dashboard/*" && <Header />
  }
  {children}
    {
    pathname != "/dashboard/*" && <Footer />
  }
  </>
}