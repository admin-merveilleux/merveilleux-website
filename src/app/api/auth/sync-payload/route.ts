import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import { getPayload, jwtSign, generatePayloadCookie } from 'payload'
import config from '@payload-config'
import { auth } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    let email: string | undefined
    let name: string | undefined

    // 1. Tenter d'obtenir la session serveur via Neon Auth
    try {
      const { data: session } = await auth.getSession()
      if (session?.user?.email) {
        email = session.user.email
        name = session.user.name || undefined
      }
    } catch (e) {
      console.warn('getSession() serveur non disponible, vérification du body...', e)
    }

    // 2. Si non présent dans la session serveur, lire le body
    if (!email) {
      try {
        const body = await req.json()
        if (body?.email && typeof body.email === 'string') {
          email = body.email
        }
      } catch {
        // Body vide ou non JSON
      }
    }

    if (!email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // 3. Restriction stricte au domaine de l'entreprise
    if (!normalizedEmail.endsWith('@merveilleux.design')) {
      return NextResponse.json(
        { error: 'Accès refusé : domaine non autorisé (@merveilleux.design requis)' },
        { status: 403 }
      )
    }

    const payload = await getPayload({ config })

    // 4. Rechercher si l'utilisateur existe déjà dans Payload
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: normalizedEmail,
        },
      },
      overrideAccess: true,
    })

    let user = existingUsers.docs[0]

    if (!user) {
      // Créer l'utilisateur dans Payload CMS avec le rôle admin
      user = await payload.create({
        collection: 'users',
        overrideAccess: true,
        data: {
          email: normalizedEmail,
          name: name || normalizedEmail.split('@')[0],
          role: 'admin',
          password: crypto.randomBytes(32).toString('hex') + 'Aa1!',
        },
      })
    }

    // 5. Générer le JWT Payload CMS et le cookie de session payload-token
    const authConfig = payload.collections['users'].config.auth
    const tokenExpiration = authConfig.tokenExpiration || 7200

    const { token } = await jwtSign({
      fieldsToSign: {
        collection: 'users',
        email: user.email,
        id: user.id,
      },
      secret: payload.secret,
      tokenExpiration,
    })

    const cookiePrefix = payload.config.cookiePrefix || 'payload'
    const cookieData = generatePayloadCookie({
      collectionAuthConfig: authConfig,
      cookiePrefix,
      returnCookieAsObject: true,
      token: token!,
    })

    const cookieStore = await cookies()
    cookieStore.set(cookieData.name, cookieData.value || token!, {
      path: cookieData.path || '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenExpiration,
    })

    // 6. Construire la réponse HTTP en attachant EXPLICITEMENT le cookie Set-Cookie
    const response = NextResponse.json({
      success: true,
      email: user.email,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })

    response.cookies.set(cookieData.name, token!, {
      path: cookieData.path || '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenExpiration,
    })

    return response
  } catch (error) {
    console.error('Erreur synchronisation auth Payload:', error)
    return NextResponse.json(
      { error: 'Erreur interne de synchronisation' },
      { status: 500 }
    )
  }
}
