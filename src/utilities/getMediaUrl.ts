export function getMediaUrl(url: string | null | undefined): string {
  if (!url) return '/media/optimized-saas-navigation.webp'
  // When running on Vercel or locally, static uploads stored in public/media
  // are served directly by the CDN / static file server at /media/...
  if (url.startsWith('/api/media/file/')) {
    return url.replace('/api/media/file/', '/media/')
  }
  return url
}
