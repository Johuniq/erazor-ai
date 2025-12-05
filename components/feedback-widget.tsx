"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MessageSquare, Bug, Lightbulb, ThumbsUp, Loader2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type FeedbackType = "bug" | "feature" | "other"

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState<FeedbackType>("other")
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setIsSubmitting(true)

    // Simulate sending feedback (replace with actual API call)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setIsSubmitted(true)
    toast.success("Thank you for your feedback!")

    setTimeout(() => {
      setIsOpen(false)
      setIsSubmitted(false)
      setMessage("")
      setEmail("")
      setType("other")
    }, 2000)
  }

  const feedbackTypes = [
    { id: "bug" as const, label: "Bug", icon: Bug, color: "text-red-500" },
    { id: "feature" as const, label: "Feature", icon: Lightbulb, color: "text-yellow-500" },
    { id: "other" as const, label: "Other", icon: ThumbsUp, color: "text-blue-500" },
  ]

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full shadow-lg"
          aria-label="Send feedback"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="end" className="w-80 p-0" sideOffset={12}>
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold">Thank you!</h3>
            <p className="mt-1 text-sm text-muted-foreground">Your feedback helps us improve.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="border-b p-4">
              <h3 className="font-semibold">Send Feedback</h3>
              <p className="text-sm text-muted-foreground">Help us improve Erazor AI</p>
            </div>
            <div className="space-y-4 p-4">
              <div className="flex gap-2">
                {feedbackTypes.map((feedbackType) => (
                  <button
                    key={feedbackType.id}
                    type="button"
                    onClick={() => setType(feedbackType.id)}
                    className={cn(
                      "flex flex-1 flex-col items-center gap-1 rounded-lg border p-2 text-xs transition-colors",
                      type === feedbackType.id ? "border-primary bg-primary/5" : "hover:bg-muted",
                    )}
                  >
                    <feedbackType.icon className={cn("h-4 w-4", feedbackType.color)} />
                    {feedbackType.label}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback-message">Message</Label>
                <Textarea
                  id="feedback-message"
                  placeholder="Tell us what's on your mind..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[100px] resize-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback-email">Email (optional)</Label>
                <Input
                  id="feedback-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="border-t p-4">
              <Button type="submit" className="w-full" disabled={isSubmitting || !message.trim()}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Feedback"
                )}
              </Button>
            </div>
          </form>
        )}
      </PopoverContent>
    </Popover>
  )
}
