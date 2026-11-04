import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Window } from 'happy-dom'
import ObjectID from 'bson-objectid'
import { getPayload } from 'payload'
import config from '../payload.config'

// Setup DOM globals for Lexical HTML import
const win = new Window()
// @ts-ignore
global.window = win
// @ts-ignore
global.document = win.document

const { createHeadlessEditor } = await import('@lexical/headless')
const { $getRoot } = await import('lexical')
const { HeadingNode, QuoteNode } = await import('@lexical/rich-text')
const { ListItemNode, ListNode } = await import('@lexical/list')
const { LinkNode, AutoLinkNode } = await import('@lexical/link')
const { UploadServerNode } = await import('@payloadcms/richtext-lexical')
const { $generateNodesFromDOM } = await import('@payloadcms/richtext-lexical/lexical/html')

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '../..')
const jsonPath = path.resolve(rootDir, 'gtghvwfceljess.json')
const imagesDir = path.resolve(rootDir, 'BACKUP/www/images/blog')

// Initialize headless editor with UploadServerNode for image blocks
const editor = createHeadlessEditor({
  nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, AutoLinkNode, UploadServerNode],
  onError: (err) => console.error('Lexical Headless Editor Error:', err),
})

function norm(name: string): string {
  if (!name) return ''
  let clean = decodeURIComponent(name.split('?')[0].trim())
  clean = path.basename(clean)
  clean = clean.replace(/-original(-\d+)?(?=\.[a-zA-Z0-9]+$)/i, '')
  return clean.normalize('NFC').toLowerCase()
}

function fixLexicalNodes(nodes: any[]) {
  for (const node of nodes) {
    if (node.type === 'link' || node.type === 'autolink') {
      const url = node.url || node.fields?.url || 'https://www.merveilleux.design'
      node.fields = {
        linkType: 'custom',
        newTab: Boolean(node.target === '_blank'),
        url: url,
      }
    }
    if (node.children && Array.isArray(node.children)) {
      fixLexicalNodes(node.children)
    }
  }
}

// Unwraps inline upload nodes into top-level block elements and ensures numeric IDs
function flattenUploads(nodes: any[]): any[] {
  const result: any[] = []
  for (const node of nodes) {
    if (node.type === 'paragraph' && Array.isArray(node.children) && node.children.some((c: any) => c.type === 'upload')) {
      let currentChildren: any[] = []
      for (const child of node.children) {
        if (child.type === 'upload') {
          const val = Number(child.value)
          if (!val || isNaN(val)) continue
          if (currentChildren.length > 0) {
            result.push({
              ...node,
              children: currentChildren,
            })
            currentChildren = []
          }
          result.push({
            format: '',
            type: 'upload',
            version: 1,
            fields: {},
            relationTo: child.relationTo || 'media',
            value: val,
            id: child.id || new ObjectID().toHexString(),
          })
        } else {
          currentChildren.push(child)
        }
      }
      if (currentChildren.length > 0) {
        result.push({
          ...node,
          children: currentChildren,
        })
      }
    } else if (node.type === 'upload') {
      const val = Number(node.value)
      if (val && !isNaN(val)) {
        node.value = val
        result.push(node)
      }
    } else {
      result.push(node)
    }
  }
  return result
}

function htmlToLexical(html: string, mediaMap: Record<string, number>) {
  if (!html || !html.trim()) {
    return {
      root: {
        children: [
          {
            children: [],
            direction: null,
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
            textFormat: 0,
            textStyle: '',
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    }
  }

  win.document.body.innerHTML = html

  // Wire each <img> to Payload's Lexical UploadNode with numeric ID
  const imgs = win.document.body.querySelectorAll('img')
  for (let i = 0; i < imgs.length; i++) {
    const img = imgs[i]
    const src = img.getAttribute('src') || ''
    const k = norm(src)
    const mediaId = mediaMap[k]

    if (mediaId) {
      img.setAttribute('data-lexical-upload-relation-to', 'media')
      img.setAttribute('data-lexical-upload-id', String(mediaId))
    } else {
      img.remove()
    }
  }

  editor.update(
    () => {
      const nodes = $generateNodesFromDOM(editor, win.document)
      const root = $getRoot()
      root.clear()
      root.append(...nodes)
    },
    { discrete: true },
  )

  const state = editor.getEditorState().toJSON()
  if (state.root && state.root.children) {
    fixLexicalNodes(state.root.children)
    state.root.children = flattenUploads(state.root.children)
  }
  return state
}

function calculateReadingTime(textHtml: string): number {
  if (!textHtml) return 3
  const plainText = textHtml.replace(/<[^>]*>/g, ' ')
  const words = plainText.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function run() {
  console.log('🚀 Démarrage de la synchronisation complète (Articles & Images dans le texte)...')

  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ Fichier introuvable : ${jsonPath}`)
    process.exit(1)
  }

  const rawJson = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))

  // Extract tables from JSON
  const tables: Record<string, any[]> = {}
  for (const item of rawJson) {
    if (item.type === 'table' && item.name && item.data) {
      tables[item.name] = item.data
    }
  }

  const rawArticles = tables['articles'] || []
  const rawContents = tables['content'] || []
  const rawCategories = tables['categories'] || []
  const rawArticleCategories = tables['article_categories'] || []

  console.log(`📊 Données trouvées dans ${path.basename(jsonPath)}:`)
  console.log(`   - Articles: ${rawArticles.length}`)
  console.log(`   - Contenus (FR/EN): ${rawContents.length}`)
  console.log(`   - Catégories: ${rawCategories.length}`)
  console.log(`   - Relations Articles <-> Catégories: ${rawArticleCategories.length}`)

  const payload = await getPayload({ config })

  // 1. GESTION DES AUTEURS
  console.log('\n👤 1. Synchronisation des Auteurs...')
  const authorsMap: Record<string, string | number> = {}

  const defaultAuthors = [
    {
      name: 'Jessy Nankou',
      role: 'Co-fondateur & Lead Product Designer',
      bio: 'Spécialiste en UX/UI pour logiciels SaaS et produits numériques.',
      linkedinUrl: 'https://www.linkedin.com/in/jessy-nankou/',
    },
    {
      name: 'Célestin Lebéhot',
      role: 'Co-fondateur & Product Strategist',
      bio: 'Expert en stratégie produit, UX SaaS et optimisation des conversions.',
      linkedinUrl: 'https://www.linkedin.com/in/celestin-lebehot/',
    },
  ]

  for (const authData of defaultAuthors) {
    const existing = await payload.find({
      collection: 'authors',
      where: { name: { equals: authData.name } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      authorsMap[authData.name] = existing.docs[0].id
      console.log(`   ✓ Auteur existant : ${authData.name} (ID: ${existing.docs[0].id})`)
    } else {
      const created = await payload.create({
        collection: 'authors',
        overrideAccess: true,
        data: authData,
      })
      authorsMap[authData.name] = created.id
      console.log(`   + Auteur créé : ${authData.name} (ID: ${created.id})`)
    }
  }
  authorsMap['Célestin Lebehot'] = authorsMap['Célestin Lebéhot']

  // 2. GESTION DES CATÉGORIES
  console.log('\n📁 2. Synchronisation des Catégories...')
  const categoryOldIdToNewId: Record<string, string | number> = {}

  for (const cat of rawCategories) {
    const catSlug = slugify(cat.name)
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: catSlug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      categoryOldIdToNewId[cat.id] = existing.docs[0].id
      console.log(`   ✓ Catégorie existante : ${cat.name} (${catSlug})`)
    } else {
      const created = await payload.create({
        collection: 'categories',
        locale: 'fr',
        overrideAccess: true,
        data: {
          name: cat.name,
          slug: catSlug,
        },
      })

      await payload.update({
        collection: 'categories',
        id: created.id,
        locale: 'en',
        overrideAccess: true,
        data: {
          name: cat.name,
        },
      })

      categoryOldIdToNewId[cat.id] = created.id
      console.log(`   + Catégorie créée : ${cat.name} (${catSlug} -> ID: ${created.id})`)
    }
  }

  const articleToCategoryIds: Record<string, (string | number)[]> = {}
  for (const rel of rawArticleCategories) {
    const aid = String(rel.article_id)
    const cid = String(rel.category_id)
    if (!articleToCategoryIds[aid]) {
      articleToCategoryIds[aid] = []
    }
    const newCatId = categoryOldIdToNewId[cid]
    if (newCatId && !articleToCategoryIds[aid].includes(newCatId)) {
      articleToCategoryIds[aid].push(newCatId)
    }
  }

  // 3. GESTION DES MÉDIAS (Indexation de tous les médias dans Payload)
  console.log('\n🖼️  3. Indexation des Médias dans Payload...')
  const mediaMap: Record<string, number> = {}

  let page = 1
  let hasMore = true
  while (hasMore) {
    const mediaPage = await payload.find({
      collection: 'media',
      limit: 100,
      page,
      overrideAccess: true,
    })
    for (const doc of mediaPage.docs) {
      if (doc.filename) {
        const k = norm(doc.filename)
        mediaMap[k] = Number(doc.id)
      }
    }
    hasMore = mediaPage.hasNextPage
    page++
  }

  console.log(`   ✓ ${Object.keys(mediaMap).length} images indexées dans Neon Media.`)

  // Vérifier s'il manque des images de couverture ou inline
  const allNeededImages = new Map<string, string>()
  for (const art of rawArticles) {
    if (art.main_img && art.main_img.trim()) {
      allNeededImages.set(norm(art.main_img), art.main_img.trim())
    }
  }
  for (const c of rawContents) {
    const matches = Array.from((c.body || '').matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi))
    for (const m of matches) {
      const cleanSrc = m[1].split('?')[0]
      const rawName = path.basename(cleanSrc)
      const decodedName = decodeURIComponent(rawName)
      allNeededImages.set(norm(decodedName), decodedName)
    }
  }

  let missingUploads = 0
  for (const [k, imgName] of allNeededImages.entries()) {
    if (mediaMap[k]) continue

    let filePath = path.join(imagesDir, imgName)
    if (!fs.existsSync(filePath) && imgName === 'ademova-story.webp') {
      const fallbackPath = path.resolve(rootDir, 'WEBSITE/ademova_portfolio_cover.webp')
      if (fs.existsSync(fallbackPath)) filePath = fallbackPath
    }

    if (fs.existsSync(filePath)) {
      try {
        const fileBuffer = fs.readFileSync(filePath)
        const fileExt = path.extname(filePath).toLowerCase()
        let mimeType = 'image/webp'
        if (fileExt === '.jpg' || fileExt === '.jpeg') mimeType = 'image/jpeg'
        else if (fileExt === '.png') mimeType = 'image/png'
        else if (fileExt === '.svg') mimeType = 'image/svg+xml'
        else if (fileExt === '.gif') mimeType = 'image/gif'

        const uploadedMedia = await payload.create({
          collection: 'media',
          overrideAccess: true,
          data: {
            alt: imgName.replace(/\.[^/.]+$/, '').replace(/-/g, ' '),
          },
          file: {
            data: fileBuffer,
            name: imgName,
            mimetype: mimeType,
            size: fileBuffer.length,
          },
        })
        mediaMap[k] = Number(uploadedMedia.id)
        missingUploads++
        console.log(`   + [Upload] ${imgName} (ID: ${uploadedMedia.id})`)
      } catch (err: any) {
        console.error(`   ⚠️ Erreur upload image ${imgName}:`, err.message)
      }
    }
  }
  if (missingUploads > 0) {
    console.log(`   ✓ ${missingUploads} nouvelles images téléversées.`)
  }

  // 4. GROUPEMENT DES CONTENUS PAR ARTICLE
  const contentByArticleId: Record<string, { fr?: any; en?: any }> = {}
  for (const c of rawContents) {
    const aid = String(c.article_id)
    if (!contentByArticleId[aid]) {
      contentByArticleId[aid] = {}
    }
    const lang = (c.language || 'fr').toLowerCase()
    if (lang === 'fr') contentByArticleId[aid].fr = c
    else if (lang === 'en') contentByArticleId[aid].en = c
  }

  // 5. IMPORTATION & MISE À JOUR DES ARTICLES
  console.log('\n📝 4. Mise à jour des Articles avec Contenu & Images Inline...')
  let importedCount = 0
  let updatedCount = 0
  let skippedCount = 0

  for (const rawArt of rawArticles) {
    const aid = String(rawArt.id)
    const contents = contentByArticleId[aid] || {}
    const frContent = contents.fr
    const enContent = contents.en

    if (!frContent && !enContent) {
      console.warn(`   ⚠️ Article ID ${aid} n'a aucun contenu associé, ignoré.`)
      skippedCount++
      continue
    }

    const primaryContent = frContent || enContent
    const primarySlug = (frContent?.url_slug || enContent?.url_slug || rawArt.reference || `article-${aid}`).trim()
    const frSlug = (frContent?.url_slug || primarySlug).trim()
    const enSlug = (enContent?.url_slug || primarySlug).trim()

    const existingArticle = await payload.find({
      collection: 'articles',
      locale: 'fr',
      where: { slug: { equals: frSlug } },
      limit: 1,
    })

    const authorId = authorsMap[rawArt.author_name] || authorsMap['Jessy Nankou']
    const catIds = articleToCategoryIds[aid] || []
    const mediaId = rawArt.main_img ? mediaMap[norm(rawArt.main_img.trim())] : undefined

    const publishDate = rawArt.publish_date
      ? new Date(rawArt.publish_date).toISOString()
      : new Date().toISOString()

    const rawFunnel = (rawArt.funnel || 'mofu').toLowerCase()
    const funnel = ['tofu', 'mofu', 'bofu'].includes(rawFunnel) ? rawFunnel : 'mofu'

    const readingTime = calculateReadingTime(frContent?.body || enContent?.body || '')

    // Construction données FR
    const frData: any = {
      title: frContent?.title || primaryContent.title,
      h1Tag: frContent?.h1_tag || frContent?.title || primaryContent.title,
      slug: frSlug,
      funnel,
      publishDate,
      author: authorId,
      categories: catIds,
      readingTime,
      intro: frContent?.intro || '',
      altImage: frContent?.alt_img || '',
      content: htmlToLexical(frContent?.body || '', mediaMap),
      meta: {
        title: frContent?.title || primaryContent.title,
        description: frContent?.meta_description || '',
      },
      _status: rawArt.state === '0' ? 'draft' : 'published',
    }

    if (mediaId) {
      frData.mainImage = mediaId
    }

    let articleId: string | number

    if (existingArticle.docs.length > 0) {
      articleId = existingArticle.docs[0].id
      await payload.update({
        collection: 'articles',
        id: articleId,
        locale: 'fr',
        overrideAccess: true,
        data: frData,
      })
      updatedCount++
      console.log(`   ↻ Article mis à jour : "${frData.title}" (${frSlug})`)
    } else {
      const created = await payload.create({
        collection: 'articles',
        locale: 'fr',
        overrideAccess: true,
        data: frData,
      })
      articleId = created.id
      importedCount++
      console.log(`   + Article créé : "${frData.title}" (${frSlug})`)
    }

    // Mise à jour de la version anglaise (locale: 'en') si présente
    if (enContent) {
      const enData: any = {
        title: enContent.title || frData.title,
        h1Tag: enContent.h1_tag || enContent.title || frData.title,
        slug: enSlug,
        intro: enContent.intro || '',
        altImage: enContent.alt_img || '',
        content: htmlToLexical(enContent.body || '', mediaMap),
        meta: {
          title: enContent.title || frData.title,
          description: enContent.meta_description || '',
        },
      }

      await payload.update({
        collection: 'articles',
        id: articleId,
        locale: 'en',
        overrideAccess: true,
        data: enData,
      })
    }
  }

  console.log('\n=============================================')
  console.log(`🎉 Synchronisation terminée avec succès !`)
  console.log(`   - Articles importés : ${importedCount}`)
  console.log(`   - Articles mis à jour : ${updatedCount}`)
  console.log(`   - Articles ignorés : ${skippedCount}`)
  console.log(`   - Total traité : ${importedCount + updatedCount}`)
  console.log('=============================================\n')

  process.exit(0)
}

run().catch((err) => {
  console.error('❌ Erreur fatale durant la synchronisation :', err)
  process.exit(1)
})
