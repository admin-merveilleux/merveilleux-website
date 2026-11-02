/** @type {import('next').NextConfig} */
const nextConfig = {
  // Payload CMS v4 configuration
  experimental: {
    reactCompiler: false,
  },
  images: {
    // Allow images from Neon storage and external sources
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.merveilleux.design',
      },
    ],
  },
  // Redirect old URLs for SEO preservation
  async redirects() {
    return [
      // Legacy service redirects (from old .htaccess)
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

export default nextConfig
