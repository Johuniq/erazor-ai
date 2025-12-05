import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Erazor AI - Background Removal & Image Upscaling",
    short_name: "Erazor AI",
    description:
      "AI-powered background removal and image upscaling tool. Remove backgrounds and upscale images instantly.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f0f14",
    orientation: "portrait-primary",
    categories: ["productivity", "photo", "utilities"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Remove Background",
        short_name: "BG Remove",
        description: "Remove background from images instantly",
        url: "/tools/remove-background",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Upscale Image",
        short_name: "Upscale",
        description: "Enhance image resolution with AI",
        url: "/tools/upscale",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Dashboard",
        short_name: "Dashboard",
        description: "Access your dashboard",
        url: "/dashboard",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
    ],
    screenshots: [
      {
        src: "/og-image.png",
        sizes: "1200x630",
        type: "image/png",
        form_factor: "wide",
        label: "Erazor AI Homepage",
      },
    ],
  }
}
