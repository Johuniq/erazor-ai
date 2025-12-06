"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import type { Profile } from "@/lib/types"
import { ChevronDown, CoinsIcon, CreditCard, LogOut, Settings, User, Zap } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface DashboardHeaderProps {
  profile: Profile
}

export function DashboardHeader({ profile }: DashboardHeaderProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success("Signed out successfully")
    router.push("/")
  }

  const initials = profile.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : profile.email?.[0]?.toUpperCase() || "U"

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <div className="w-10 lg:hidden" />

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        {/* Credits Badge - Enhanced */}
        <Link href="/dashboard/billing" className="hidden sm:block">
          <Badge
            variant="outline"
            className="gap-2 px-3 py-1.5 hover:bg-accent/50 transition-colors cursor-pointer border-border/60"
          >
            <CoinsIcon className="h-4 w-4 text-yellow-500" />
            <span className="font-semibold">{profile.credits}</span>
            <span className="text-muted-foreground">credits</span>
          </Badge>
        </Link>

        {/* User Dropdown - Enhanced */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2 hover:bg-accent/50">
              <Avatar className="h-8 w-8 ring-2 ring-border">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex items-center gap-1">
                <span className="text-sm font-medium max-w-[120px] truncate">
                  {profile.full_name || profile.email?.split("@")[0]}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{profile.full_name || "User"}</p>
                  <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* Mobile credits display */}
            <div className="px-2 py-2 sm:hidden">
              <div className="flex items-center justify-between rounded-lg bg-accent/10 px-3 py-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">{profile.credits} credits</span>
                </div>
                <Badge variant="outline" className="text-xs capitalize">
                  {profile.plan}
                </Badge>
              </div>
            </div>
            <DropdownMenuSeparator className="sm:hidden" />
            <DropdownMenuItem asChild className="py-2.5 cursor-pointer">
              <Link href="/dashboard/settings" className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">Profile</div>
                  <div className="text-xs text-muted-foreground">Manage your account</div>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="py-2.5 cursor-pointer">
              <Link href="/dashboard/billing" className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">Billing</div>
                  <div className="text-xs text-muted-foreground">Subscription & credits</div>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="py-2.5 cursor-pointer">
              <Link href="/dashboard/settings" className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                  <Settings className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">Settings</div>
                  <div className="text-xs text-muted-foreground">Preferences & security</div>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="py-2.5 text-destructive focus:text-destructive cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
                  <LogOut className="h-4 w-4" />
                </div>
                <span className="font-medium">Sign out</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
