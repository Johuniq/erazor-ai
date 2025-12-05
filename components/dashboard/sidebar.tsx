"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import type { Profile } from "@/lib/types"
import { cn } from "@/lib/utils"
import {
  ChevronRight,
  CreditCard,
  HelpCircle,
  History,
  ImageMinus,
  LayoutDashboard,
  Maximize2,
  Menu,
  Settings,
  Sparkles,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

interface DashboardSidebarProps {
  profile: Profile
}

const navigation = [
  { name: "Overview", href: "/dashboard/overview", icon: LayoutDashboard, description: "Dashboard summary" },
  { name: "Background Removal", href: "/dashboard", icon: ImageMinus, description: "Remove backgrounds" },
  { name: "Image Upscaling", href: "/dashboard/upscale", icon: Maximize2, description: "Enhance resolution" },
  { name: "History", href: "/dashboard/history", icon: History, description: "View past jobs" },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard, description: "Manage subscription" },
  { name: "Settings", href: "/dashboard/settings", icon: Settings, description: "Account settings" },
]

function SidebarContent({ profile, onNavigate }: { profile: Profile; onNavigate?: () => void }) {
  const pathname = usePathname()

  // Calculate credits percentage for progress bar
  const maxCredits = profile.plan === "enterprise" ? 2000 : profile.plan === "pro" ? 200 : 10
  const creditsPercentage = Math.min((profile.credits / maxCredits) * 100, 100)

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
        <Link href="/" className="flex items-center gap-2.5 group" onClick={onNavigate}>
          <Image src="/logo.png" alt="Erazor AI" width={30} height={30} className="rounded-xl shadow-sm transition-transform group-hover:scale-105" />
          <span className="text-lg font-bold tracking-tight">Erazor AI</span>
        </Link>
      </div>

      {/* Credits Display - Enhanced */}
      <div className="p-4">
        <div className="rounded-xl bg-gradient-to-br from-sidebar-accent to-sidebar-accent/50 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-sidebar-foreground">Credits</span>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "border-0 text-xs font-semibold capitalize",
                profile.plan === "pro" && "bg-primary/15 text-primary",
                profile.plan === "enterprise" && "bg-accent/15 text-accent",
                profile.plan === "free" && "bg-muted text-muted-foreground",
              )}
            >
              {profile.plan}
            </Badge>
          </div>
          <p className="text-3xl font-bold text-sidebar-foreground mb-2">{profile.credits}</p>
          <Progress value={creditsPercentage} className="h-1.5 mb-3" />
          <Link
            href="/dashboard/billing"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            onClick={onNavigate}
          >
            Get more credits
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Navigation - Enhanced with descriptions and better hover states */}
      <nav className="flex-1 px-3 py-2">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                    isActive
                      ? "bg-sidebar-primary-foreground/15"
                      : "bg-sidebar-accent group-hover:bg-sidebar-accent-foreground/10",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate">{item.name}</div>
                  <div
                    className={cn(
                      "text-xs truncate transition-colors",
                      isActive ? "text-sidebar-primary-foreground/70" : "text-sidebar-foreground/50",
                    )}
                  >
                    {item.description}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Help - Enhanced */}
      <div className="border-t border-sidebar-border p-3">
        <Link
          href="mailto:support@erazor.ai"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group"
          onClick={onNavigate}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-accent group-hover:bg-sidebar-accent-foreground/10 transition-colors">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <div>Help & Support</div>
            <div className="text-xs text-sidebar-foreground/50">Get assistance</div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export function DashboardSidebar({ profile }: DashboardSidebarProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-72 shrink-0 border-r border-border bg-sidebar lg:block">
        <SidebarContent profile={profile} />
      </aside>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="fixed left-4 top-4 z-50 lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 bg-sidebar">
          <SidebarContent profile={profile} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  )
}
