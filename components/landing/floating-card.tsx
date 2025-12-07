"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"

interface FloatingPromoCardProps {
  title: string
  description: string
  discount?: string
  code?: string
  ctaText?: string
  ctaHref?: string
  onCtaClick?: () => void
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
  className?: string
  autoShow?: boolean
  delay?: number
}

export function FloatingPromoCard({
  title,
  description,
  discount,
  code,
  ctaText = "Claim Offer",
  ctaHref,
  onCtaClick,
  position = "bottom-right",
  className,
  autoShow = true,
  delay = 2000,
}: FloatingPromoCardProps) {
  const [isVisible, setIsVisible] = useState(!autoShow)
  const [hasShown, setHasShown] = useState(!autoShow)

  useEffect(() => {
    if (autoShow && !hasShown) {
      const timer = setTimeout(() => {
        setIsVisible(true)
        setHasShown(true)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [autoShow, hasShown, delay])

  const handleClose = () => {
    setIsVisible(false)
    sessionStorage.setItem("promo-card-dismissed", "true")
  }

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
  }

  const slideVariants = {
    "bottom-right": { x: 400, y: 0 },
    "bottom-left": { x: -400, y: 0 },
    "top-right": { x: 400, y: 0 },
    "top-left": { x: -400, y: 0 },
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={slideVariants[position]}
          animate={{ x: 0, y: 0 }}
          exit={slideVariants[position]}
          transition={{ type: "spring", damping: 20, stiffness: 150 }}
          className={cn("fixed z-50 w-full max-w-sm", positionClasses[position], className)}
        >
          <Card className="relative overflow-hidden border-2 border-yellow-300/20 shadow-2xl bg-gradient-to-br from-black via-gray-900 to-black backdrop-blur-sm">
            {/* Animated background shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/5 to-transparent bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite] pointer-events-none" />
            
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/g%3E%3C/svg%3E")`
            }} />

            <div className="relative p-6">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                onClick={handleClose}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>

              <motion.div
                initial={{ scale: 0, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-4"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔥</span>
                  <h3 className="text-xl font-bold text-white">{title}</h3>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                {discount && (
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-4 py-2">
                    <span className="text-2xl font-bold text-yellow-300">{discount}</span>
                    <span className="text-white font-semibold">{description}</span>
                  </div>
                )}

                {code && (
                  <div className="mb-5 flex items-center gap-2">
                    <span className="text-sm text-white/90 font-medium">Use code:</span>
                    <code className="rounded bg-white/20 px-3 py-1.5 font-mono text-sm font-bold tracking-wider text-yellow-300">
                      {code}
                    </code>
                  </div>
                )}

                {ctaText && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      className="w-full bg-white text-black hover:bg-white/90 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 h-11"
                      onClick={onCtaClick}
                      asChild={!!ctaHref}
                    >
                      {ctaHref ? <a href={ctaHref}>{ctaText}</a> : <span>{ctaText}</span>}
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </div>

            <div className="h-1 w-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300" />
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
