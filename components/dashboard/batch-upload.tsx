"use client"

import { ProcessingErrorBoundary } from "@/components/error-boundary"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn, formatFileSize } from "@/lib/utils"
import { Check, CloudUpload, FileImage, Loader2, X, XCircle } from "lucide-react"
import Image from "next/image"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"

interface BatchFile {
  file: File
  preview: string
  status: "pending" | "processing" | "complete" | "error"
  resultUrl?: string
  error?: string
}

interface BatchUploadProps {
  onBatchUpload: (files: File[]) => Promise<void>
  isProcessing?: boolean
  accept?: Record<string, string[]>
  maxSize?: number
  maxFiles?: number
  onProgress?: (current: number, total: number) => void
}

export function BatchUpload({
  onBatchUpload,
  isProcessing = false,
  accept = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/webp": [".webp"],
  },
  maxSize = 10 * 1024 * 1024,
  maxFiles = 50,
  onProgress,
}: BatchUploadProps) {
  const [batchFiles, setBatchFiles] = useState<BatchFile[]>([])
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: { file: File; errors: { code: string }[] }[]) => {
    setError(null)
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0]
      if (rejection.errors.some(e => e.code === "file-too-large")) {
        setError(`Some files are too large. Maximum size is ${formatFileSize(maxSize)} per file.`)
        return
      }
      if (rejection.errors.some(e => e.code === "too-many-files")) {
        setError(`Too many files. Maximum is ${maxFiles} files per batch.`)
        return
      }
    }

    const newFiles: BatchFile[] = acceptedFiles.map(file => {
      const preview = URL.createObjectURL(file)
      return {
        file,
        preview,
        status: "pending" as const,
      }
    })

    setBatchFiles(prev => [...prev, ...newFiles].slice(0, maxFiles))
  }, [maxSize, maxFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: true,
    maxFiles,
    disabled: isProcessing || batchFiles.length >= maxFiles,
  })

  const removeFile = (index: number) => {
    setBatchFiles(prev => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].preview)
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const clearAll = () => {
    batchFiles.forEach(bf => URL.revokeObjectURL(bf.preview))
    setBatchFiles([])
    setError(null)
  }

  const handleBatchProcess = async () => {
    if (batchFiles.length === 0) return
    const files = batchFiles.map(bf => bf.file)
    await onBatchUpload(files)
  }

  const pendingCount = batchFiles.filter(f => f.status === "pending").length
  const processingCount = batchFiles.filter(f => f.status === "processing").length
  const completeCount = batchFiles.filter(f => f.status === "complete").length
  const errorCount = batchFiles.filter(f => f.status === "error").length

  return (
    <ProcessingErrorBoundary>
      <div className="space-y-4">
        {batchFiles.length === 0 ? (
          <div
            {...getRootProps()}
            className={cn(
              "relative flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300",
              isDragActive
                ? "border-primary bg-primary/5 scale-[1.02]"
                : "border-border hover:border-primary/50 hover:bg-muted/50",
              isProcessing && "cursor-not-allowed opacity-50",
            )}
          >
            <input {...getInputProps()} />

            <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-muted/50 via-transparent to-transparent opacity-50" />

            <div className="relative flex flex-col items-center text-center px-6">
              <div className={cn("mb-6 relative", isDragActive && "animate-bounce")}>
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 shadow-lg shadow-primary/5">
                  <CloudUpload
                    className={cn(
                      "h-10 w-10 text-primary transition-transform duration-300",
                      isDragActive && "scale-110",
                    )}
                  />
                </div>
                <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {maxFiles}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">
                  {isDragActive ? "Drop your images here" : "Batch Upload Images"}
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Drag and drop up to {maxFiles} images, or click to browse. 
                  Maximum {formatFileSize(maxSize)} per file.
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports: JPG, PNG, WebP
                </p>
              </div>

              {!isDragActive && (
                <Button size="lg" className="mt-6 shadow-lg" type="button">
                  <FileImage className="mr-2 h-5 w-5" />
                  Select Multiple Images
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Stats Bar */}
            <div className="flex items-center justify-between gap-4 rounded-lg border bg-card p-4">
              <div className="flex gap-6">
                <div className="text-sm">
                  <span className="font-medium">{batchFiles.length}</span>
                  <span className="text-muted-foreground ml-1">total</span>
                </div>
                {completeCount > 0 && (
                  <div className="text-sm text-green-600">
                    <span className="font-medium">{completeCount}</span>
                    <span className="ml-1">complete</span>
                  </div>
                )}
                {processingCount > 0 && (
                  <div className="text-sm text-blue-600">
                    <span className="font-medium">{processingCount}</span>
                    <span className="ml-1">processing</span>
                  </div>
                )}
                {errorCount > 0 && (
                  <div className="text-sm text-destructive">
                    <span className="font-medium">{errorCount}</span>
                    <span className="ml-1">failed</span>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                disabled={isProcessing}
              >
                Clear All
              </Button>
            </div>

            {/* File Grid */}
            <ScrollArea className="h-[400px] rounded-lg border">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {batchFiles.map((batchFile, index) => (
                  <div
                    key={index}
                    className="relative group rounded-lg border bg-card overflow-hidden"
                  >
                    <div className="aspect-square relative">
                      <Image
                        src={batchFile.preview}
                        alt={`Upload ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      
                      {/* Status Overlay */}
                      {batchFile.status !== "pending" && (
                        <div className={cn(
                          "absolute inset-0 flex items-center justify-center",
                          batchFile.status === "processing" && "bg-blue-500/20",
                          batchFile.status === "complete" && "bg-green-500/20",
                          batchFile.status === "error" && "bg-destructive/20",
                        )}>
                          {batchFile.status === "processing" && (
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                          )}
                          {batchFile.status === "complete" && (
                            <Check className="h-8 w-8 text-green-600" />
                          )}
                          {batchFile.status === "error" && (
                            <XCircle className="h-8 w-8 text-destructive" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Remove Button */}
                    {!isProcessing && batchFile.status === "pending" && (
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}

                    {/* File Name */}
                    <div className="p-2 text-xs truncate">
                      {batchFile.file.name}
                    </div>
                  </div>
                ))}

                {/* Add More Button */}
                {batchFiles.length < maxFiles && !isProcessing && (
                  <div
                    {...getRootProps()}
                    className="aspect-square flex items-center justify-center rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer hover:bg-muted/50 transition-all"
                  >
                    <input {...getInputProps()} />
                    <div className="text-center p-4">
                      <CloudUpload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">
                        Add More
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleBatchProcess}
                disabled={isProcessing || pendingCount === 0}
                className="flex-1"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing {completeCount}/{batchFiles.length}
                  </>
                ) : (
                  <>Process {pendingCount} Images</>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </ProcessingErrorBoundary>
  )
}
