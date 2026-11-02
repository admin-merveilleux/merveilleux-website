/**
 * Migration Script: Migrate Articles from legacy MySQL to Payload CMS v4
 *
 * Usage:
 * npx tsx src/scripts/migrate-from-mysql.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'

async function migrate() {
  console.log('🚀 Démarrage de la migration du blog...')
  const payload = await getPayload({ config })

  console.log('Payload initialisé avec succès.')
  console.log('Pour exécuter la migration complète depuis la base MySQL OVH :')
  console.log('1. Exportez les tables `articles`, `content`, `categories`, `article_categories` en JSON ou SQL')
  console.log('2. Le script synchronisera les slugs, les balises H1 et le funnel TOFU/MOFU/BOFU')

  process.exit(0)
}

// migrate().catch(console.error)
export default migrate
