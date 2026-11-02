import { createNeonAuth } from '@neondatabase/auth/next/server'

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL || 'https://ep-bitter-morning-zafpp8i0.neonauth.c-2.eu-west-2.aws.neon.tech/neondb/auth',
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET || process.env.PAYLOAD_SECRET || 'a-very-secret-key-at-least-32-chars-long',
    sessionDataTtl: 300,
  },
})
