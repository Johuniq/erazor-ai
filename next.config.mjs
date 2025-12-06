/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Prevent trailing slash redirects (fixes webhook 307/308 issues)
  skipTrailingSlashRedirect: true,
  trailingSlash: false,

  // Security headers including Content Security Policy
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              // Default: only allow resources from same origin
              "default-src 'self'",
              
              // Scripts: Next.js requires 'unsafe-eval' for dev, 'unsafe-inline' for some features
              // Allow specific CDNs and services
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com https://js.stripe.com https://cdn.vercel-insights.com https://va.vercel-scripts.com",
              
              // Styles: Allow inline styles (required by Next.js and Tailwind)
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              
              // Images: Allow from self, data URIs, blob, and trusted CDNs
              "img-src 'self' data: blob: https: http://localhost:*",
              
              // Fonts: Google Fonts and self
              "font-src 'self' data: https://fonts.gstatic.com",
              
              // Connect (AJAX, WebSocket, etc): API endpoints and services
              [
                "connect-src 'self'",
                "https://*.supabase.co",
                "wss://*.supabase.co",
                "https://api-bgremover.icons8.com",
                "https://api-upscaler.icons8.com",
                "https://api.polar.sh",
                "https://challenges.cloudflare.com",
                "https://vitals.vercel-insights.com",
                "http://localhost:*",
                "ws://localhost:*"
              ].join(' '),
              
              // Frames: Allow Cloudflare Turnstile, Stripe
              "frame-src 'self' https://challenges.cloudflare.com https://js.stripe.com",
              
              // Objects: Block plugins
              "object-src 'none'",
              
              // Media: Allow from self and CDNs
              "media-src 'self' https://ai-cdn.icons8.com blob: data:",
              
              // Workers: Allow from self
              "worker-src 'self' blob:",
              
              // Forms: Only submit to self
              "form-action 'self'",
              
              // Base URI: Restrict to self
              "base-uri 'self'",
              
              // Upgrade insecure requests in production
              process.env.NODE_ENV === 'production' ? "upgrade-insecure-requests" : "",
              
              // Block all mixed content
              "block-all-mixed-content",
            ].filter(Boolean).join('; ')
          },
          // Additional security headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          }
        ]
      }
    ]
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.aws-k8s.generated.photos',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'ai-cdn.icons8.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'testingbot.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'avatar.vercel.sh'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'pub-7c5475f69164473cb8f82ee5ae4a5718.r2.dev'
      }
    ],
    // Optimize images for better performance
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; production;"
  },

}

export default nextConfig
