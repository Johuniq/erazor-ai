"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./footer";
import { Header } from "./header";
import { Banner } from "./landing/banner";

interface RootClientProps {
  children: React.ReactNode;
  isLoggedIn: boolean;
  userEmail?: string;
}

export function RootClient({ children, isLoggedIn, userEmail }: RootClientProps) {
  const pathname = usePathname();
  const inDashboard = pathname.startsWith("/dashboard");

  return (
    <>
      {!inDashboard && <Banner />}
      {!inDashboard && <Header isLoggedIn={isLoggedIn} userEmail={userEmail} />}
      {children}
      {!inDashboard && <Footer />}
    </>
  );
}
