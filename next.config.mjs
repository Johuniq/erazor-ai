/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Prevent trailing slash redirects (fixes webhook 307/308 issues)
  skipTrailingSlashRedirect: true,
  trailingSlash: false,

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
