'use client'

interface DownloadRequest {
  url: string
}

const isObjectUrl = (url?: string | null) => Boolean(url && url.startsWith('blob:'))

export async function getDisplayReadyUrl(remoteUrl: string): Promise<string> {
  try {
    const response = await fetch('/api/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: remoteUrl } satisfies DownloadRequest),
    })

    if (!response.ok) {
      throw new Error(`Preview fetch failed with status ${response.status}`)
    }

    const blob = await response.blob()
    return URL.createObjectURL(blob)
  } catch (error) {
    console.warn('Falling back to remote result URL', error)
    return remoteUrl
  }
}

export function releaseObjectUrl(url?: string | null) {
  if (isObjectUrl(url)) {
    URL.revokeObjectURL(url!)
  }
}
