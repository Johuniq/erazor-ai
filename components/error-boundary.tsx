"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"
import React from "react"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  resetKeys?: Array<string | number>
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

/**
 * Generic Error Boundary component that catches React errors
 * and displays a fallback UI instead of crashing the entire app
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("[Error Boundary] Caught error:", error)
      console.error("[Error Boundary] Error info:", errorInfo)
    }

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    })

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // TODO: Send error to monitoring service (e.g., Sentry)
    // Example: Sentry.captureException(error, { extra: errorInfo })
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys } = this.props
    const { hasError } = this.state

    // Reset error boundary if resetKeys change
    if (hasError && resetKeys && prevProps.resetKeys) {
      const hasResetKeyChanged = resetKeys.some((key, index) => {
        return key !== prevProps.resetKeys![index]
      })

      if (hasResetKeyChanged) {
        this.reset()
      }
    }
  }

  reset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    const { hasError, error } = this.state
    const { children, fallback } = this.props

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback
      }

      // Default fallback UI
      return (
        <Card className="mx-auto my-8 max-w-lg">
          <CardHeader>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <CardTitle>Something went wrong</CardTitle>
            </div>
            <CardDescription>
              We encountered an unexpected error. Please try again or contact support if the problem persists.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {process.env.NODE_ENV === "development" && error && (
              <div className="rounded-md bg-muted p-4 text-sm">
                <p className="font-semibold text-destructive">{error.name}</p>
                <p className="mt-1 text-muted-foreground">{error.message}</p>
              </div>
            )}
            <Button onClick={this.reset} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      )
    }

    return children
  }
}

/**
 * Lightweight error boundary for dashboard components
 */
export function DashboardErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error("[Dashboard Error]", error, errorInfo)
      }}
      fallback={
        <Card className="m-4">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle>Failed to load dashboard</CardTitle>
            </div>
            <CardDescription>Please refresh the page to try again.</CardDescription>
          </CardHeader>
        </Card>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

/**
 * Error boundary for image processing components
 */
export function ProcessingErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error) => {
        console.error("[Processing Error]", error)
      }}
      fallback={
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertTriangle className="mb-4 h-12 w-12 text-destructive" />
          <h3 className="mb-2 text-lg font-semibold">Processing Error</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Failed to process your image. Please try uploading a different file.
          </p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reload Page
          </Button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

/**
 * Error boundary for form components
 */
export function FormErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error) => {
        console.error("[Form Error]", error)
      }}
      fallback={
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
            <div>
              <h4 className="font-semibold text-destructive">Form Error</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Unable to display this form. Please refresh the page.
              </p>
            </div>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

/**
 * Minimal error boundary for small UI sections
 */
export function SectionErrorBoundary({ 
  children, 
  sectionName = "section" 
}: { 
  children: React.ReactNode
  sectionName?: string 
}) {
  return (
    <ErrorBoundary
      onError={(error) => {
        console.error(`[${sectionName} Error]`, error)
      }}
      fallback={
        <div className="flex items-center gap-2 rounded-md bg-muted p-3 text-sm">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <span className="text-muted-foreground">Failed to load {sectionName}</span>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}
