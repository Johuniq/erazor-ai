import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url || typeof url !== "string") {
      return NextResponse.json({ message: "Missing file url" }, { status: 400 })
    }

    const remoteResponse = await fetch(url, { cache: "no-store" })

    if (!remoteResponse.ok) {
      return NextResponse.json({ message: "Failed to fetch file" }, { status: 502 })
    }

    const arrayBuffer = await remoteResponse.arrayBuffer()
    const contentType = remoteResponse.headers.get("content-type") ?? "application/octet-stream"

    return new NextResponse(Buffer.from(arrayBuffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("Download proxy error:", error)
    return NextResponse.json({ message: "Failed to download file" }, { status: 500 })
  }
}
