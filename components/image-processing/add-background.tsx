"use client"

/**
 * AddBackground Component
 * 
 * Allows users to add custom backgrounds to images with transparent backgrounds.
 * Features:
 * - Gradient Library: 6 pre-made animated gradient backgrounds using @paper-design/shaders-react
 * - Custom Upload: Upload your own image as a background
 * - Real-time Preview: See the result before downloading
 * - Canvas Compositing: Combines background and foreground using HTML5 Canvas
 */

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StaticMeshGradient } from "@paper-design/shaders-react"
import { Download, Loader2, Upload, X } from "lucide-react"
import { useCallback, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"

interface AddBackgroundProps {
  transparentImage: string
  onClose: () => void
}

const gradientPresets = [
  {
    name: "Sunset",
    colors: ["#ffad0a", "#6200ff", "#e2a3ff", "#ff99fd"],
    positions: 2,
    waveX: 1,
    waveXShift: 0.6,
    waveY: 1,
    waveYShift: 0.21,
    mixing: 0.93,
    grainMixer: 0.45,
    grainOverlay: 0,
    rotation: 270,
  },
  {
    name: "Ocean",
    colors: ["#00d4ff", "#0066ff", "#00ffcc", "#6600ff"],
    positions: 2,
    waveX: 1.2,
    waveXShift: 0.5,
    waveY: 1.1,
    waveYShift: 0.3,
    mixing: 0.9,
    grainMixer: 0.5,
    grainOverlay: 0,
    rotation: 180,
  },
  {
    name: "Forest",
    colors: ["#00ff87", "#60efff", "#00a86b", "#7fffd4"],
    positions: 2,
    waveX: 0.9,
    waveXShift: 0.4,
    waveY: 1.3,
    waveYShift: 0.25,
    mixing: 0.88,
    grainMixer: 0.4,
    grainOverlay: 0,
    rotation: 90,
  },
  {
    name: "Flame",
    colors: ["#ff0000", "#ff6600", "#ffff00", "#ff00ff"],
    positions: 2,
    waveX: 1.1,
    waveXShift: 0.7,
    waveY: 0.9,
    waveYShift: 0.2,
    mixing: 0.95,
    grainMixer: 0.35,
    grainOverlay: 0,
    rotation: 0,
  },
  {
    name: "Lavender",
    colors: ["#e6e6fa", "#dda0dd", "#ba55d3", "#9370db"],
    positions: 2,
    waveX: 1,
    waveXShift: 0.5,
    waveY: 1,
    waveYShift: 0.3,
    mixing: 0.85,
    grainMixer: 0.3,
    grainOverlay: 0,
    rotation: 45,
  },
  {
    name: "Neon",
    colors: ["#ff006e", "#fb5607", "#ffbe0b", "#8338ec"],
    positions: 2,
    waveX: 1.3,
    waveXShift: 0.8,
    waveY: 1.2,
    waveYShift: 0.4,
    mixing: 0.92,
    grainMixer: 0.55,
    grainOverlay: 0,
    rotation: 315,
  },
]

export function AddBackground({ transparentImage, onClose }: AddBackgroundProps) {
  const [selectedGradient, setSelectedGradient] = useState(gradientPresets[0])
  const [customBackground, setCustomBackground] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"gradient" | "custom">("gradient")
  const [isCompositing, setIsCompositing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setCustomBackground(reader.result as string)
        setActiveTab("custom")
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })

  const compositeImages = async () => {
    setIsCompositing(true)
    try {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d", { willReadFrequently: true })
      if (!ctx) throw new Error("Could not get canvas context")

      // Load the transparent foreground image
      const foregroundImg = new Image()
      foregroundImg.crossOrigin = "anonymous"
      await new Promise((resolve, reject) => {
        foregroundImg.onload = resolve
        foregroundImg.onerror = reject
        foregroundImg.src = transparentImage
      })

      canvas.width = foregroundImg.width
      canvas.height = foregroundImg.height

      // Draw background
      if (activeTab === "custom" && customBackground) {
        const bgImg = new Image()
        bgImg.crossOrigin = "anonymous"
        await new Promise((resolve, reject) => {
          bgImg.onload = resolve
          bgImg.onerror = reject
          bgImg.src = customBackground
        })
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)
      } else {
        // Draw gradient background by capturing the gradient canvas
        const gradientCanvas = document.querySelector('canvas[data-gradient="true"]') as HTMLCanvasElement
        if (gradientCanvas) {
          // Create temporary canvas for scaling
          const tempCanvas = document.createElement("canvas")
          const tempCtx = tempCanvas.getContext("2d")
          tempCanvas.width = canvas.width
          tempCanvas.height = canvas.height
          if (tempCtx) {
            tempCtx.drawImage(gradientCanvas, 0, 0, canvas.width, canvas.height)
            ctx.drawImage(tempCanvas, 0, 0)
          }
        } else {
          // Fallback: solid color background
          ctx.fillStyle = selectedGradient.colors[0]
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
      }

      // Draw the transparent image on top
      ctx.drawImage(foregroundImg, 0, 0)

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `erazor-with-background-${Date.now()}.png`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
          toast.success("Image with background downloaded!")
          onClose()
        }
      }, "image/png")
    } catch (error) {
      console.error("Error compositing images:", error)
      toast.error("Failed to add background")
    } finally {
      setIsCompositing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Add Background</h2>
              <p className="text-sm text-muted-foreground">Choose a gradient or upload your own background</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Preview */}
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border border-border">
            <div className="absolute inset-0">
              {activeTab === "gradient" ? (
                <StaticMeshGradient
                  width={1280}
                  height={720}
                  colors={selectedGradient.colors}
                  positions={selectedGradient.positions}
                  waveX={selectedGradient.waveX}
                  waveXShift={selectedGradient.waveXShift}
                  waveY={selectedGradient.waveY}
                  waveYShift={selectedGradient.waveYShift}
                  mixing={selectedGradient.mixing}
                  grainMixer={selectedGradient.grainMixer}
                  grainOverlay={selectedGradient.grainOverlay}
                  rotation={selectedGradient.rotation}
                  data-gradient="true"
                />
              ) : customBackground ? (
                <img src={customBackground} alt="Custom background" className="w-full h-full object-cover" />
              ) : null}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <img src={transparentImage} alt="Foreground" className="max-w-full max-h-full object-contain" />
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "gradient" | "custom")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="gradient">Gradient Library</TabsTrigger>
              <TabsTrigger value="custom">Custom Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="gradient" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {gradientPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setSelectedGradient(preset)}
                    className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                      selectedGradient.name === preset.name
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <StaticMeshGradient
                      width={320}
                      height={180}
                      colors={preset.colors}
                      positions={preset.positions}
                      waveX={preset.waveX}
                      waveXShift={preset.waveXShift}
                      waveY={preset.waveY}
                      waveYShift={preset.waveYShift}
                      mixing={preset.mixing}
                      grainMixer={preset.grainMixer}
                      grainOverlay={preset.grainOverlay}
                      rotation={preset.rotation}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-xs font-medium text-white">{preset.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4 mt-4">
              {!customBackground ? (
                <div
                  {...getRootProps()}
                  className={`relative cursor-pointer border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                    isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{isDragActive ? "Drop your image here" : "Upload custom background"}</p>
                      <p className="text-sm text-muted-foreground">JPG, PNG, WebP up to 10MB</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
                  <img src={customBackground} alt="Custom background" className="w-full h-full object-cover" />
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-2 top-2 h-8 w-8"
                    onClick={() => setCustomBackground(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={compositeImages} disabled={isCompositing} className="flex-1 gap-2">
              {isCompositing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download with Background
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
