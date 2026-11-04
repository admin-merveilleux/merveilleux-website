import { auth } from '@/lib/auth'
import type { NextRequest } from 'next/server'

const defaultHandlers = auth.handler()

/**
 * Enveloppe les handlers Neon Auth pour intercepter les erreurs 502 transitoires
 * (qui surviennent lorsque le compute serverless Neon sort de veille)
 * et relancer automatiquement la requête après un court délai.
 */
function wrapHandler(methodHandler: (req: NextRequest, ctx: any) => Promise<Response>) {
  return async (req: NextRequest, ctx: any) => {
    const clone = req.clone() as NextRequest
    try {
      const res = await methodHandler(req, ctx)
      if (res.status === 502) {
        // Neon compute en cours de réveil : attendre 1.2s et réexécuter avec le clone de la requête
        await new Promise((resolve) => setTimeout(resolve, 1200))
        return await methodHandler(clone, ctx)
      }
      return res
    } catch (err) {
      // Erreur réseau ou timeout : retenter une fois
      await new Promise((resolve) => setTimeout(resolve, 1200))
      return await methodHandler(clone, ctx)
    }
  }
}

export const GET = wrapHandler(defaultHandlers.GET)
export const POST = wrapHandler(defaultHandlers.POST)
export const PUT = wrapHandler(defaultHandlers.PUT)
export const DELETE = wrapHandler(defaultHandlers.DELETE)
export const PATCH = wrapHandler(defaultHandlers.PATCH)

