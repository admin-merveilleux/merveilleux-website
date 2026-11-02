import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { sharpTransformer } from '@payloadcms/transformer-sharp'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/Pages'
import { Articles } from '@/collections/Articles'
import { Categories } from '@/collections/Categories'
import { Tags } from '@/collections/Tags'
import { Authors } from '@/collections/Authors'
import { Services } from '@/collections/Services'
import { CaseStudies } from '@/collections/CaseStudies'

// Globals
import { SiteSettings } from '@/globals/SiteSettings'
import { Navigation } from '@/globals/Navigation'
import { Footer } from '@/globals/Footer'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: dirname,
    },
    meta: {
      titleSuffix: ' | Merveilleux Design',
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          url: '/favicon.ico',
        },
      ],
    },
  },

  collections: [
    Users,
    Media,
    Pages,
    Articles,
    Categories,
    Tags,
    Authors,
    Services,
    CaseStudies,
  ],

  globals: [
    SiteSettings,
    Navigation,
    Footer,
  ],

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET || 'CHANGE-ME-IN-PRODUCTION-32-chars-min',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL || '',
      ssl: {
        rejectUnauthorized: false,
      },
    },
    push: false,
  }),

  upload: {
    transformers: [
      sharpTransformer({
        collections: {
          media: {
            variants: [
              {
                name: 'thumbnail',
                width: 300,
                height: 300,
                position: 'centre',
              },
              {
                name: 'small',
                width: 600,
              },
              {
                name: 'medium',
                width: 1024,
              },
              {
                name: 'large',
                width: 1920,
              },
              {
                name: 'og',
                width: 1200,
                height: 630,
                crop: 'centre',
              },
            ],
          },
        },
      }),
    ],
  },

  plugins: [
    seoPlugin({
      collections: ['pages', 'articles', 'services', 'case-studies'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `${doc?.title} | Merveilleux Design`,
      generateDescription: ({ doc }) => doc?.meta?.description || '',
      generateURL: ({ doc, collectionSlug }) => {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.merveilleux.design'
        if (collectionSlug === 'articles') {
          return `${baseUrl}/fr/blog/article/${doc?.slug}`
        }
        return `${baseUrl}/${doc?.slug || ''}`
      },
    }),
  ],

  // Internationalization — FR primary, EN secondary
  localization: {
    locales: [
      {
        label: 'Français',
        code: 'fr',
      },
      {
        label: 'English',
        code: 'en',
      },
    ],
    defaultLocale: 'fr',
    fallback: true,
  },
})
