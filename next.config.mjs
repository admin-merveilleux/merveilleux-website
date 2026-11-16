import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.merveilleux.design',
      },
    ],
  },
  // Redirect old URLs for SEO preservation and route local media to static assets
  async redirects() {
    return [
      {
        source: '/api/media/file/:path*',
        destination: '/media/:path*',
        permanent: false,
      },
      {
        source: '/audit',
        destination: '/services/audit-ux',
        permanent: true,
      },
      {
        source: '/maquettes',
        destination: '/services/maquettes',
        permanent: true,
      },
      {
        source: '/design-system',
        destination: '/services/design-system',
        permanent: true,
      },
      {
        source: '/gamification',
        destination: '/services/gamification',
        permanent: true,
      },
    ]
  },
}

export default withPayload(nextConfig)

