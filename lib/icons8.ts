import type { Icons8BGRemovalResponse, Icons8UpscaleResponse } from "./types"

const BG_REMOVER_API = "https://api-bgremover.icons8.com/api/v1"
const UPSCALER_API = "https://api-upscaler.icons8.com/api/v1"

const getBGRemoverKey = () => process.env.ICONS8_BG_REMOVER_API_KEY
const getUpscalerKey = () => process.env.ICONS8_UPSCALER_API_KEY

// Background Removal Functions
export async function removeBackground(imageFile: File): Promise<Icons8BGRemovalResponse> {
  const formData = new FormData()
  formData.append("image", imageFile)

  const response = await fetch(`${BG_REMOVER_API}/process_image?token=${getBGRemoverKey()}`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Background removal failed: ${response.statusText}`)
  }

  return response.json()
}

export async function removeBackgroundByUrl(imageUrl: string): Promise<Icons8BGRemovalResponse> {
  const response = await fetch(
    `${BG_REMOVER_API}/process_image?image_url=${encodeURIComponent(imageUrl)}&token=${getBGRemoverKey()}`,
    { method: "GET" },
  )

  if (!response.ok) {
    throw new Error(`Background removal failed: ${response.statusText}`)
  }

  return response.json()
}

export async function getBGRemovalStatus(jobId: string): Promise<Icons8BGRemovalResponse> {
  const response = await fetch(`${BG_REMOVER_API}/process_image/${jobId}?token=${getBGRemoverKey()}`)

  if (!response.ok) {
    throw new Error(`Failed to get job status: ${response.statusText}`)
  }

  return response.json()
}

// Image Upscaling Functions
export async function upscaleImage(imageFile: File): Promise<Icons8UpscaleResponse> {
  const formData = new FormData()
  formData.append("image", imageFile)

  const response = await fetch(`${UPSCALER_API}/enhance_image?token=${getUpscalerKey()}`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Image upscaling failed: ${response.statusText}`)
  }

  return response.json()
}

export async function upscaleImageByUrl(imageUrl: string): Promise<Icons8UpscaleResponse> {
  const response = await fetch(
    `${UPSCALER_API}/enhance_image?image_url=${encodeURIComponent(imageUrl)}&token=${getUpscalerKey()}`,
    { method: "GET" },
  )

  if (!response.ok) {
    throw new Error(`Image upscaling failed: ${response.statusText}`)
  }

  return response.json()
}

export async function getUpscaleStatus(jobId: string): Promise<Icons8UpscaleResponse> {
  const response = await fetch(`${UPSCALER_API}/enhance_image/${jobId}?token=${getUpscalerKey()}`)

  if (!response.ok) {
    throw new Error(`Failed to get job status: ${response.statusText}`)
  }

  return response.json()
}

export async function reEnhanceImage(jobId: string): Promise<Icons8UpscaleResponse> {
  const response = await fetch(`${UPSCALER_API}/enhance_image/${jobId}?token=${getUpscalerKey()}`, {
    method: "POST",
  })

  if (!response.ok) {
    throw new Error(`Re-enhance failed: ${response.statusText}`)
  }

  return response.json()
}
