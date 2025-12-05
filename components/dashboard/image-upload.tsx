"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { X, ImageIcon, CloudUpload, FileImage } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface ImageUploadProps {
  onUpload: (file: File) => void
  isProcessing?: boolean
  accept?: Record<string, string[]>
  maxSize?: number
}

export function ImageUpload({
  onUpload,
  isProcessing = false,
  accept = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/webp": [".webp"],
  },
  maxSize = 10 * 1024 * 1024,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
    disabled: isProcessing,
  })

  const clearImage = () => {
    setFile(null)
    setPreview(null)
  }

  const handleProcess = () => {
    if (file) {
      onUpload(file)
    }
  }

  return (
    <div className="space-y-4">
      {!preview ? (
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

          {/* Background pattern */}
          <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-muted/50 via-transparent to-transparent opacity-50" />

          <div className="relative flex flex-col items-center text-center px-6">
            {/* Animated icon container */}
            <div className={cn("mb-6 relative", isDragActive && "animate-bounce")}>
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 shadow-lg shadow-primary/5">
                <CloudUpload
                  className={cn(
                    "h-10 w-10 text-primary transition-transform duration-300",
                    isDragActive && "scale-110",
                  )}
                />
              </div>
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-2xl border border-primary/20 animate-ping opacity-75" />
            </div>

            <h3 className="mb-2 text-xl font-semibold">{isDragActive ? "Drop your image here" : "Upload an image"}</h3>
            <p className="mb-6 text-sm text-muted-foreground max-w-[280px]">
              {isDragActive ? "Release to upload your file" : "Drag and drop your image here, or click to browse"}
            </p>

            {/* File type badges */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {["JPG", "PNG", "WebP"].map((type) => (
                <span
                  key={type}
                  className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  <FileImage className="h-3 w-3" />
                  {type}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Maximum file size: 10MB</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/30 shadow-sm">
            <div className="aspect-video relative">
              <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-contain p-4" />
            </div>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-3 top-3 h-8 w-8 rounded-full shadow-md hover:bg-destructive hover:text-destructive-foreground transition-colors"
              onClick={clearImage}
              disabled={isProcessing}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* File info and action bar */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ImageIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-medium truncate max-w-[200px]">{file?.name}</p>
                <p className="text-xs text-muted-foreground">{file && (file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <Button onClick={handleProcess} disabled={isProcessing} size="lg" className="shadow-sm">
              {isProcessing ? "Processing..." : "Process Image"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
