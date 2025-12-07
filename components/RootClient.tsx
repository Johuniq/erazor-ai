"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./footer";
import { Header } from "./header";
import { Banner } from "./landing/banner";

export function RootClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const inDashboard = pathname.startsWith("/dashboard");

  return (
    <>
      {!inDashboard && <Header />}
      {!inDashboard && <Banner />}
      {children}
      {!inDashboard && <Footer />}
    </>
  );
}
