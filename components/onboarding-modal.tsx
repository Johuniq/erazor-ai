"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ImageMinus, ZoomIn, CreditCard, Sparkles, ArrowRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface OnboardingModalProps {
  userId: string
}

const steps = [
  {
    title: "Welcome to Erazor AI",
    description: "Your all-in-one AI-powered image editing suite. Let's get you started with a quick tour.",
    icon: Sparkles,
    color: "bg-primary",
  },
  {
    title: "Remove Backgrounds",
    description:
      "Upload any image and our AI will instantly remove the background with precision. Perfect for product photos, portraits, and more.",
    icon: ImageMinus,
    color: "bg-rose-500",
  },
  {
    title: "Upscale Images",
    description:
      "Enhance your images up to 4x resolution without losing quality. Great for printing, social media, and web use.",
    icon: ZoomIn,
    color: "bg-blue-500",
  },
  {
    title: "Flexible Credits",
    description:
      "Start with 10 free credits. Each operation uses 1 credit. Need more? Upgrade anytime with our affordable plans.",
    icon: CreditCard,
    color: "bg-green-500",
  },
]

export function OnboardingModal({ userId }: OnboardingModalProps) {
  const [open, setOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem(`onboarding-${userId}`)
    if (!hasSeenOnboarding) {
      const timer = setTimeout(() => setOpen(true), 500)
      return () => clearTimeout(timer)
    }
  }, [userId])

  const handleComplete = () => {
    localStorage.setItem(`onboarding-${userId}`, "true")
    setOpen(false)
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  const step = steps[currentStep]
  const StepIcon = step.icon

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-white"
            style={{ background: `var(--${step.color.replace("bg-", "")})` }}
          >
            <div className={cn("flex h-16 w-16 items-center justify-center rounded-2xl text-white", step.color)}>
              <StepIcon className="h-8 w-8" />
            </div>
          </div>
          <DialogTitle className="text-xl">{step.title}</DialogTitle>
          <DialogDescription className="text-base">{step.description}</DialogDescription>
        </DialogHeader>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 py-4">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={cn(
                "h-2 rounded-full transition-all",
                index === currentStep ? "w-6 bg-primary" : index < currentStep ? "w-2 bg-primary/50" : "w-2 bg-muted",
              )}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" className="flex-1" onClick={handleSkip}>
            Skip tour
          </Button>
          <Button className="flex-1" onClick={handleNext}>
            {currentStep < steps.length - 1 ? (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Get Started
                <Check className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
