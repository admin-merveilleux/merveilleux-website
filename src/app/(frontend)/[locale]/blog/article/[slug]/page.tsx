import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'

export const revalidate = 60

const customConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  upload: ({ node }) => {
    const uploadDoc = (node as any).value
    if (!uploadDoc || typeof uploadDoc !== 'object') return null

    const url = uploadDoc.url || ''
    const alt = (node as any).fields?.alt || uploadDoc.alt || ''
    const isSvg = url.endsWith('.svg')

    return (
      <figure style={{ margin: '36px 0', textAlign: 'center' }}>
        <img
          src={url}
          alt={alt}
          style={{
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45)',
            display: 'block',
            margin: '0 auto',
            ...(isSvg ? { background: '#ffffff', padding: '20px' } : {}),
          }}
        />
        {alt && (
          <figcaption style={{
            fontSize: '13px',
            color: '#8b949e',
            marginTop: '12px',
            fontStyle: 'italic',
          }}>
            {alt}
          </figcaption>
        )}
      </figure>
    )
  },
})

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const currentLocale = (locale === 'en' ? 'en' : 'fr') as 'fr' | 'en'

  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'articles',
    locale: currentLocale,
    where: {
      slug: { equals: slug },
    },
    depth: 2,
    limit: 1,
  })

  if (!docs || docs.length === 0) {
    notFound()
  }

  const article = docs[0]

  const mainImg = typeof article.mainImage === 'object' && article.mainImage ? article.mainImage : null
  const coverUrl = mainImg?.url || null
  const coverAlt = article.altImage || mainImg?.alt || article.title

  const category = Array.isArray(article.categories) && article.categories[0] && typeof article.categories[0] === 'object'
    ? article.categories[0].name
    : 'UX Design'

  const author = typeof article.author === 'object' && article.author ? article.author : null
  const authorName = author?.name || 'Jessy Nankou'
  const authorRole = author?.role || 'Lead Product Designer'

  const dateStr = article.publishDate
    ? new Date(article.publishDate).toLocaleDateString(currentLocale === 'en' ? 'en-US' : 'fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  const funnelLabels: Record<string, string> = {
    tofu: 'Sensibilisation (TOFU)',
    mofu: 'Méthodologie (MOFU)',
    bofu: 'Décision (BOFU)',
  }

  return (
    <article className="article-container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link href={`/${currentLocale}/blog`}>
          {currentLocale === 'en' ? 'Blog' : 'Blog'}
        </Link>
        <span>›</span>
        <span>{category}</span>
      </nav>

      <header className="article-header">
        <div className="article-tags-bar">
          <span className="card-category">{category}</span>
          {article.funnel && (
            <span className="tag-funnel">
              {funnelLabels[article.funnel] || article.funnel}
            </span>
          )}
          {article.readingTime && (
            <span style={{ fontSize: '13px', color: '#9aa2b1' }}>
              • {article.readingTime} min de lecture
            </span>
          )}
        </div>

        <h1 className="article-h1">{article.h1Tag || article.title}</h1>

        <div className="article-author-bar">
          <div className="author-avatar">
            {authorName.charAt(0)}
          </div>
          <div>
            <div className="author-info-name">{authorName}</div>
            <div className="author-info-meta">
              {authorRole} {dateStr && `• Publié le ${dateStr}`}
            </div>
          </div>
        </div>
      </header>

      {/* Main Cover Image */}
      {coverUrl && (
        <div className="article-cover">
          <img src={coverUrl} alt={coverAlt} />
        </div>
      )}

      {/* Intro / Chapeau */}
      {article.intro && (
        <div className="article-chapeau">
          {article.intro}
        </div>
      )}

      {/* Lexical Rich Text Body */}
      {article.content && (
        <div className="rich-text-content">
          <RichText data={article.content} converters={customConverters} />
        </div>
      )}

      {/* Footer / Navigation */}
      <div className="article-back-nav">
        <Link href={`/${currentLocale}/blog`} className="btn-back">
          ← {currentLocale === 'en' ? 'Back to all articles' : 'Retour à tous les articles'}
        </Link>

        <Link href="/admin/collections/articles" className="btn-admin">
          Éditer dans Payload CMS ↗
        </Link>
      </div>
    </article>
  )
}
