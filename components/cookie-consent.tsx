"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Cookie, Settings, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

type CookiePreferences = {
  necessary: boolean
  analytics: boolean
  functional: boolean
  marketing: boolean
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    functional: false,
    marketing: false,
  })

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      // Delay showing the banner for better UX
      const timer = setTimeout(() => setShowBanner(true), 2000)
      return () => clearTimeout(timer)
    } else {
      // Load saved preferences
      try {
        const saved = JSON.parse(consent)
        if (typeof saved === 'object') {
          setPreferences(saved)
        }
      } catch (e) {
        // Handle old format
        if (consent === 'all') {
          setPreferences({
            necessary: true,
            analytics: true,
            functional: true,
            marketing: true,
          })
        }
      }
    }
  }, [])

  const acceptAll = () => {
    const allPreferences = {
      necessary: true,
      analytics: true,
      functional: true,
      marketing: true,
    }
    setPreferences(allPreferences)
    localStorage.setItem("cookie-consent", JSON.stringify(allPreferences))
    setShowBanner(false)
    setShowPreferences(false)
  }

  const acceptEssential = () => {
    const essentialOnly = {
      necessary: true,
      analytics: false,
      functional: false,
      marketing: false,
    }
    setPreferences(essentialOnly)
    localStorage.setItem("cookie-consent", JSON.stringify(essentialOnly))
    setShowBanner(false)
    setShowPreferences(false)
  }

  const savePreferences = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences))
    setShowBanner(false)
    setShowPreferences(false)
  }

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'necessary') return // Can't disable necessary cookies
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  if (!showBanner) return null

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
        <div className="mx-auto max-w-4xl">
          <div className="relative rounded-xl border bg-background/95 p-4 shadow-lg backdrop-blur-sm md:p-6">
            <button
              onClick={acceptEssential}
              className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 pr-6">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Cookie className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">We value your privacy</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.{" "}
                    <Link href="/cookie-policy" className="text-primary hover:underline">
                      Cookie Policy
                    </Link>
                    {" "}&middot;{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreferences(true)}
                  className="justify-start sm:w-auto"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Customize Preferences
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={acceptEssential}>
                    Essential Only
                  </Button>
                  <Button size="sm" onClick={acceptAll}>
                    Accept All
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Preferences Dialog */}
      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cookie Preferences</DialogTitle>
            <DialogDescription>
              Manage your cookie preferences. You can enable or disable different types of cookies below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Necessary Cookies */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="necessary" className="text-base font-semibold">
                    Necessary Cookies
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Essential for the website to function. Cannot be disabled.
                  </p>
                </div>
                <Switch
                  id="necessary"
                  checked={preferences.necessary}
                  disabled
                  aria-label="Necessary cookies (always enabled)"
                />
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="analytics" className="text-base font-semibold">
                    Analytics Cookies
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Help us understand how visitors interact with our website.
                  </p>
                </div>
                <Switch
                  id="analytics"
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => updatePreference('analytics', checked)}
                  aria-label="Analytics cookies"
                />
              </div>
            </div>

            {/* Functional Cookies */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="functional" className="text-base font-semibold">
                    Functional Cookies
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable enhanced functionality and personalization features.
                  </p>
                </div>
                <Switch
                  id="functional"
                  checked={preferences.functional}
                  onCheckedChange={(checked) => updatePreference('functional', checked)}
                  aria-label="Functional cookies"
                />
              </div>
            </div>

            {/* Marketing Cookies */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="marketing" className="text-base font-semibold">
                    Marketing Cookies
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Used to deliver relevant advertisements and track campaign effectiveness.
                  </p>
                </div>
                <Switch
                  id="marketing"
                  checked={preferences.marketing}
                  onCheckedChange={(checked) => updatePreference('marketing', checked)}
                  aria-label="Marketing cookies"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={acceptEssential}>
              Accept Essential Only
            </Button>
            <Button onClick={savePreferences}>
              Save Preferences
            </Button>
            <Button variant="secondary" onClick={acceptAll}>
              Accept All
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
