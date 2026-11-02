import { getPayload } from 'payload'
import config from '@payload-config'

async function testConnection() {
  console.log('🔄 Initialisation de Payload CMS v4 avec Neon PostgreSQL...')
  const payload = await getPayload({ config })

  console.log('✅ Payload CMS v4 connecté avec succès à Neon PostgreSQL !')

  // Tester une requête sur la base Neon avec overrideAccess (Payload v4 standard)
  const users = await payload.find({
    collection: 'users',
    overrideAccess: true,
    limit: 1,
  })

  console.log(`✅ Requête Neon Postgres réussie (total utilisateurs: ${users.totalDocs})`)

  // Tester la lecture des globals
  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    overrideAccess: true,
  })

  console.log(`✅ Globals initialisés sur Neon (Site: "${siteSettings.siteName || 'merveilleUX'}")`)

  // Tester la création d'un article de test pour valider l'écriture sur Neon
  const testArticle = await payload.create({
    collection: 'articles',
    overrideAccess: true,
    data: {
      title: 'Article Test Déploiement Neon & Payload v4',
      slug: 'test-deploiement-neon-payload-v4',
      h1Tag: 'Test de Déploiement Payload v4 & Neon',
      funnel: 'tofu',
      intro: 'Ceci est un test end-to-end automatisé confirmant la synchronisation de Neon et Payload v4.',
    },
  })

  console.log(`✅ Écriture sur Neon réussie (Article ID: ${testArticle.id}, Slug: ${testArticle.slug})`)

  // Nettoyage de l'article de test
  await payload.delete({
    collection: 'articles',
    id: testArticle.id,
    overrideAccess: true,
  })

  console.log('✅ Nettoyage de l’article de test effectué avec succès.')
  console.log('🎉 TOUS LES SERVICES SONT OPÉRATIONNELS END-TO-END AVEC NEON POSTGRESQL !')
  process.exit(0)
}

testConnection().catch((err) => {
  console.error('❌ Erreur de test de connexion :', err)
  process.exit(1)
})
