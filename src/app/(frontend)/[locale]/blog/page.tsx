import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

export const revalidate = 60 // Revalidate every minute

export default async function BlogListingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const currentLocale = (locale === 'en' ? 'en' : 'fr') as 'fr' | 'en'

  const payload = await getPayload({ config })

  const { docs: articles } = await payload.find({
    collection: 'articles',
    locale: currentLocale,
    depth: 2,
    limit: 100,
    sort: '-publishDate',
  })

  return (
    <div className="page-container">
      <div className="blog-hero">
        <div className="blog-badge">
          {currentLocale === 'en' ? 'SaaS Product & UX Insights' : 'Ressources & Stratégie Produit SaaS'}
        </div>
        <h1 className="blog-title">
          {currentLocale === 'en' ? 'The merveilleUX Blog' : 'Le Blog merveilleUX'}
        </h1>
        <p className="blog-subtitle">
          {currentLocale === 'en'
            ? 'Actionable guides, design methodologies, and UX strategies to grow retention and scale your SaaS platform.'
            : 'Guides pratiques, méthodologies design et stratégies UX pour booster l’adoption, réduire le churn et faire scaler votre produit SaaS.'}
        </p>
      </div>

      <div className="articles-grid">
        {articles.map((art) => {
          const mainImg = typeof art.mainImage === 'object' && art.mainImage ? art.mainImage : null
          const imgUrl = mainImg?.url || '/media/optimized-saas-navigation.webp'
          const imgAlt = mainImg?.alt || art.title
          const category = Array.isArray(art.categories) && art.categories[0] && typeof art.categories[0] === 'object'
            ? art.categories[0].name
            : 'UX Design'
          const author = typeof art.author === 'object' && art.author ? art.author.name : 'merveilleUX'

          const dateStr = art.publishDate
            ? new Date(art.publishDate).toLocaleDateString(currentLocale === 'en' ? 'en-US' : 'fr-FR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : null

          return (
            <Link
              key={art.id}
              href={`/${currentLocale}/blog/article/${art.slug}`}
              className="article-card"
            >
              <div className="card-img-wrapper">
                <img
                  src={imgUrl}
                  alt={imgAlt}
                  className="card-img"
                  loading="lazy"
                />
              </div>

              <div className="card-content">
                <div className="card-meta">
                  <span className="card-category">{category}</span>
                  {dateStr && <span>• {dateStr}</span>}
                </div>

                <h2 className="card-title">{art.title}</h2>

                {art.intro && (
                  <p className="card-intro">{art.intro}</p>
                )}

                <div className="card-footer">
                  <span>Par {author}</span>
                  {art.readingTime && <span>{art.readingTime} min</span>}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
