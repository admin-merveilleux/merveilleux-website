import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { auth } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { data: session } = await auth.getSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const email = session.user.email.toLowerCase()

    // Restriction stricte au domaine de l'entreprise
    if (!email.endsWith('@merveilleux.design')) {
      return NextResponse.json(
        { error: 'Accès refusé : domaine non autorisé' },
        { status: 403 }
      )
    }

    const payload = await getPayload({ config })

    // Rechercher si l'utilisateur existe déjà dans Payload
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
      overrideAccess: true,
    })

    if (existingUsers.totalDocs === 0) {
      // Créer l'utilisateur dans Payload CMS avec le rôle admin
      await payload.create({
        collection: 'users',
        overrideAccess: true,
        data: {
          email,
          name: session.user.name || email.split('@')[0],
          role: 'admin',
          // Mot de passe temporaire pour conformité schéma auth Payload
          password: Math.random().toString(36).slice(-16) + 'Aa1!',
        },
      })
    }

    return NextResponse.json({ success: true, email })
  } catch (error) {
    console.error('Erreur synchronisation auth Payload:', error)
    return NextResponse.json(
      { error: 'Erreur interne de synchronisation' },
      { status: 500 }
    )
  }
}
