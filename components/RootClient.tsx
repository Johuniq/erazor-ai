"use client";

import { useAuthStore } from "@/lib/store/auth-store";
import { usePathname } from "next/navigation";
import { Footer } from "./footer";
import { Header } from "./header";
import { Banner } from "./landing/banner";

export function RootClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const inDashboard = pathname.startsWith("/dashboard");
  const { user, isAuthenticated } = useAuthStore();

  return (
    <>
      {!inDashboard && <Banner />}
      {!inDashboard && <Header isLoggedIn={isAuthenticated} userEmail={user?.email} />}
      {children}
      {!inDashboard && <Footer />}
    </>
  );
}
