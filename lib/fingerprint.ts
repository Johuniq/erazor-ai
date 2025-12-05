// Simple fingerprint generation for anonymous user tracking
export async function generateFingerprint(): Promise<string> {
  const components: string[] = []

  // Screen info
  components.push(`${screen.width}x${screen.height}`)
  components.push(`${screen.colorDepth}`)

  // Timezone
  components.push(Intl.DateTimeFormat().resolvedOptions().timeZone)

  // Language
  components.push(navigator.language)

  // Platform
  components.push(navigator.platform)

  // User agent
  components.push(navigator.userAgent)

  // Canvas fingerprint
  try {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.textBaseline = "top"
      ctx.font = "14px Arial"
      ctx.fillText("Erazor fingerprint", 2, 2)
      components.push(canvas.toDataURL())
    }
  } catch {
    // Canvas not available
  }

  // Create hash
  const data = components.join("|")
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

  return hashHex
}
