import { auth } from '@/lib/auth'

export default auth.middleware({ loginUrl: '/admin/login' })

export const config = {
  matcher: ['/auth/:path*'],
}
