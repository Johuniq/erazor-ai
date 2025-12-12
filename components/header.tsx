"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/lib/store/auth-store"
import { ChevronDown, LayoutDashboard, LogOut, Menu, Settings, User, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

interface HeaderProps {
  isLoggedIn?: boolean
  userEmail?: string
}

export function Header({ isLoggedIn = false, userEmail }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { signOut } = useAuthStore()

  const handleSignOut = async () => {
    if (signingOut) return // prevent double click spam

    try {
      console.log('Header signOut clicked')
      setSigningOut(true)
      
      // Close mobile menu and dropdown if open
      setMobileMenuOpen(false)
      setDropdownOpen(false)

      toast.success("Signing out...")
      await signOut()
    } catch (error) {
      console.error('Header signOut error:', error)
      toast.error("Failed to sign out")
      setSigningOut(false)
    }
  }

  const getInitials = (email?: string) => {
    if (!email) return "U"
    return email[0].toUpperCase()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="Erazor AI" width={30} height={30} className="rounded-lg" />
          <span className="text-lg font-bold tracking-tight">Erazor AI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-1">
                Tools
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link href="/tools">All Tools</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/tools/remove-background">Background Removal</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/tools/upscale">Image Upscaling</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/tools/face-swap">Face Swap</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" asChild>
            <Link href="/use-cases">Use Cases</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="#features">Features</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="#pricing">Pricing</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="#faq">FAQ</Link>
          </Button>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src="/user.png" />
                    <AvatarFallback className="text-xs">{getInitials(userEmail)}</AvatarFallback>
                  </Avatar>
                  <span className="max-w-[100px] truncate">{userEmail?.split('@')[0] || 'Account'}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">My Account</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {userEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={signingOut}
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onSelect={(e) => {
                    e.preventDefault()
                    handleSignOut()
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {signingOut ? "Signing out..." : "Sign out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="flex flex-col gap-1 p-4">
            <p className="px-3 py-2 text-xs font-medium text-muted-foreground">Tools</p>
            <Link
              href="/tools"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              All Tools
            </Link>
            <Link
              href="/tools/remove-background"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Background Removal
            </Link>
            <Link
              href="/tools/upscale"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Image Upscaling
            </Link>
            <Link
              href="/tools/face-swap"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Face Swap
            </Link>
            <div className="my-2 h-px bg-border" />
            <Link
              href="/use-cases"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Use Cases
            </Link>
            <Link
              href="#features"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <div className="my-2 h-px bg-border" />
            <div className="flex flex-col gap-2 pt-2">
              {isLoggedIn ? (
                <>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/settings">Settings</Link>
                  </Button>
                  <Button variant="destructive" onClick={handleSignOut} disabled={signingOut} className="mt-1">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild>
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
