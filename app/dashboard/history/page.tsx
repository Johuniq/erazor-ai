import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"
import { Clock, ExternalLink, History, ImageMinus, Maximize2, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function HistoryPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: jobs } = await supabase
    .from("processing_jobs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-accent/15 text-accent border-accent/30"
      case "processing":
        return "bg-primary/15 text-primary border-primary/30"
      case "failed":
        return "bg-destructive/15 text-destructive border-destructive/30"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 space-y-6 sm:space-y-8">
      {/* Page header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-primary/10 shadow-sm">
            <History className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Processing History</h1>
            <p className="text-sm sm:text-base text-muted-foreground">View your recent image processing jobs</p>
          </div>
        </div>
      </div>

      <Card className="shadow-sm border-border/60">
        <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg">Recent Jobs</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Your last 50 processing jobs</CardDescription>
            </div>
            {jobs && jobs.length > 0 && (
              <Badge variant="outline" className="text-xs sm:text-sm text-muted-foreground">
                {jobs.length} jobs
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {!jobs || jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
              <div className="mb-4 sm:mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-muted shadow-sm">
                <History className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-base sm:text-lg font-semibold">No processing history yet</h3>
              <p className="mb-4 sm:mb-6 text-xs sm:text-sm text-muted-foreground max-w-[280px]">
                Start processing images to see your history here
              </p>
              <Button asChild size="lg" className="text-sm sm:text-base">
                <Link href="/dashboard">Process Your First Image</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="group flex items-center gap-2 sm:gap-3 lg:gap-4 rounded-xl border border-border p-3 sm:p-4 transition-all hover:bg-muted/50 hover:border-border/80"
                >
                  {/* Thumbnail */}
                  <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-xl bg-muted shadow-sm">
                    {job.result_url ? (
                      <Image
                        src={job.result_url || "/placeholder.svg"}
                        alt="Processed image"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        {job.job_type === "bg_removal" ? (
                          <ImageMinus className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                        ) : (
                          <Maximize2 className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Job info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm sm:text-base font-semibold truncate">
                        {job.job_type === "bg_removal" ? "Background Removal" : "Image Upscaling"}
                      </span>
                      <Badge variant="outline" className={cn("text-[10px] sm:text-xs", getStatusColor(job.status))}>
                        {job.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        {new Date(job.created_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span className="hidden sm:inline">{job.credits_used} credit</span>
                        <span className="sm:hidden">{job.credits_used}</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {job.result_url && job.status === "completed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-transparent text-xs sm:text-sm shrink-0"
                    >
                      <a href={job.result_url} target="_blank" rel="noopener noreferrer" className="gap-1 sm:gap-1.5">
                        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">View</span>
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
