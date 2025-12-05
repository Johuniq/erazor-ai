import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { FeedbackWidget } from "@/components/feedback-widget"
import { OnboardingModal } from "@/components/onboarding-modal"
import type { Profile } from "@/lib/types"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const userProfile: Profile = profile || {
    id: user.id,
    email: user.email || null,
    full_name: user.user_metadata?.full_name || null,
    avatar_url: null,
    credits: 10,
    plan: "free",
    polar_customer_id: null,
    polar_subscription_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar profile={userProfile} />
      <div className="flex flex-1 flex-col">
        <DashboardHeader profile={userProfile} />
        <main className="flex-1 p-6">{children}</main>
      </div>
      <FeedbackWidget />
      <OnboardingModal userId={user.id} />
    </div>
  )
}
