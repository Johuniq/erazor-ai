import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { createClient } from "@/lib/supabase/server"
import type { ProcessingJob, Profile } from "@/lib/types"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Crown,
  ImageIcon,
  ImageMinus,
  LayoutDashboard,
  Maximize2,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function OverviewPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch recent jobs
  const { data: recentJobs } = await supabase
    .from("processing_jobs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Fetch job stats
  const { count: totalJobs } = await supabase
    .from("processing_jobs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const { count: bgRemovalJobs } = await supabase
    .from("processing_jobs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("job_type", "bg_removal")

  const { count: upscaleJobs } = await supabase
    .from("processing_jobs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("job_type", "upscale")

  const { count: completedJobs } = await supabase
    .from("processing_jobs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "completed")

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

  const maxCredits = userProfile.plan === "enterprise" ? 2000 : userProfile.plan === "pro" ? 200 : 10
  const creditsPercentage = Math.min((userProfile.credits / maxCredits) * 100, 100)

  const stats = [
    {
      label: "Total Processed",
      value: totalJobs || 0,
      icon: ImageIcon,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "BG Removals",
      value: bgRemovalJobs || 0,
      icon: ImageMinus,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Upscales",
      value: upscaleJobs || 0,
      icon: Maximize2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Success Rate",
      value: totalJobs ? `${Math.round(((completedJobs || 0) / totalJobs) * 100)}%` : "0%",
      icon: CheckCircle2,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
  ]

  const quickActions = [
    {
      title: "Remove Background",
      description: "Instantly remove backgrounds from any image",
      icon: ImageMinus,
      href: "/dashboard",
      color: "from-purple-500 to-indigo-500",
    },
    {
      title: "Upscale Image",
      description: "Enhance image resolution up to 4x",
      icon: Maximize2,
      href: "/dashboard/upscale",
      color: "from-emerald-500 to-teal-500",
    },
  ]

  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-10 space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-primary/10 shadow-sm">
              <LayoutDashboard className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Welcome back, {userProfile.full_name?.split(" ")[0] || "there"}!
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">Here&apos;s an overview of your account</p>
            </div>
          </div>
        </div>
        {userProfile.plan === "free" && (
          <Button asChild className="gap-2 w-full sm:w-auto">
            <Link href="/dashboard/billing">
              <Crown className="h-4 w-4" />
              Upgrade Plan
            </Link>
          </Button>
        )}
      </div>

      {/* Credits Card */}
      <Card className="overflow-hidden border-border/60">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold">Available Credits</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {userProfile.plan === "free" ? "Free plan" : `${userProfile.plan} plan`}
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "capitalize",
                  userProfile.plan === "pro" && "border-primary/30 bg-primary/10 text-primary",
                  userProfile.plan === "enterprise" && "border-amber-500/30 bg-amber-500/10 text-amber-600",
                )}
              >
                {userProfile.plan}
              </Badge>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-baseline gap-1 sm:gap-2">
                <span className="text-3xl sm:text-4xl font-bold">{userProfile.credits}</span>
                <span className="text-sm sm:text-base text-muted-foreground">/ {maxCredits} credits</span>
              </div>
              <Progress value={creditsPercentage} className="h-2" />
              <p className="text-xs sm:text-sm text-muted-foreground">
                {userProfile.credits > 0
                  ? `You have ${userProfile.credits} credits remaining this month`
                  : "You've used all your credits. Upgrade for more!"}
              </p>
            </div>
          </div>
          {userProfile.plan === "free" && (
            <div className="border-t lg:border-l lg:border-t-0 border-border bg-muted/30 p-4 sm:p-6 lg:w-72">
              <div className="flex items-start gap-2 sm:gap-3 mb-4">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-semibold">Need more credits?</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">Upgrade to Pro for 200 credits/month</p>
                </div>
              </div>
              <Button asChild className="w-full" size="sm">
                <Link href="/dashboard/billing">
                  View Plans
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/60">
            <CardContent className="p-3 sm:p-4 lg:p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 lg:gap-4">
                <div className={cn("flex h-10 w-10 sm:h-11 sm:w-11 lg:h-12 lg:w-12 items-center justify-center rounded-xl", stat.bgColor)}>
                  <stat.icon className={cn("h-5 w-5 sm:h-5.5 sm:w-5.5 lg:h-6 lg:w-6", stat.color)} />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card className="border-border/60">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Start processing your images</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3 p-4 sm:p-6">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="group flex items-center gap-2 sm:gap-3 lg:gap-4 rounded-xl border border-border/60 p-3 sm:p-4 transition-all hover:border-primary/30 hover:bg-accent/50"
              >
                <div
                  className={cn(
                    "flex h-10 w-10 sm:h-11 sm:w-11 lg:h-12 lg:w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm shrink-0",
                    action.color,
                  )}
                >
                  <action.icon className="h-5 w-5 sm:h-5.5 sm:w-5.5 lg:h-6 lg:w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-semibold group-hover:text-primary transition-colors truncate">{action.title}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">{action.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border/60">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Your latest processing jobs</CardDescription>
              </div>
              {(recentJobs?.length || 0) > 0 && (
                <Button variant="ghost" size="sm" asChild className="text-xs sm:text-sm">
                  <Link href="/dashboard/history">View all</Link>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {recentJobs && recentJobs.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {recentJobs.map((job: ProcessingJob) => (
                  <div
                    key={job.id}
                    className="flex items-center gap-2 sm:gap-3 rounded-lg border border-border/40 p-2 sm:p-3 bg-muted/20"
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 items-center justify-center rounded-lg shrink-0",
                        job.job_type === "bg_removal" ? "bg-purple-500/10" : "bg-emerald-500/10",
                      )}
                    >
                      {job.job_type === "bg_removal" ? (
                        <ImageMinus
                          className={cn(
                            "h-4 w-4 sm:h-5 sm:w-5",
                            job.job_type === "bg_removal" ? "text-purple-500" : "text-emerald-500",
                          )}
                        />
                      ) : (
                        <Maximize2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs sm:text-sm truncate">
                        {job.job_type === "bg_removal" ? "Background Removal" : "Image Upscale"}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        {new Date(job.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] sm:text-xs capitalize shrink-0",
                        job.status === "completed" && "border-green-500/30 bg-green-500/10 text-green-600",
                        job.status === "processing" && "border-amber-500/30 bg-amber-500/10 text-amber-600",
                        job.status === "failed" && "border-red-500/30 bg-red-500/10 text-red-600",
                      )}
                    >
                      {job.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-muted mb-3 sm:mb-4">
                  <ImageIcon className="h-6 w-6 sm:h-7 sm:w-7 text-muted-foreground" />
                </div>
                <h4 className="text-sm sm:text-base font-medium mb-1">No activity yet</h4>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Start processing images to see your history</p>
                <Button asChild size="sm" className="text-xs sm:text-sm">
                  <Link href="/dashboard">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips Section */}
      <Card className="border-border/60 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2">Pro Tips for Better Results</h3>
              <ul className="text-xs sm:text-sm text-muted-foreground space-y-0.5 sm:space-y-1">
                <li>• Use high-resolution images (at least 1000x1000px) for the best quality</li>
                <li>• Images with clear subjects and good lighting produce cleaner results</li>
                <li className="hidden sm:list-item">• For upscaling, start with the highest quality source image available</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
