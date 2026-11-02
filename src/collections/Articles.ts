import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: {
    singular: 'Article de blog',
    plural: 'Articles de blog',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'funnel', 'publishDate', '_status'],
    group: 'Blog',
  },
  access: {
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Titre de l’article (Balise Title)',
    },
    {
      name: 'h1Tag',
      type: 'text',
      localized: true,
      label: 'Titre H1 de la page',
      admin: {
        description: 'Titre principal affiché dans l’article. Si vide, le titre ci-dessus sera utilisé.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      localized: true,
      label: 'Slug URL',
      admin: {
        position: 'sidebar',
        description: 'Important pour le SEO : correspond à l’URL /fr/blog/article/{slug}',
      },
    },
    {
      name: 'funnel',
      type: 'select',
      defaultValue: 'mofu',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Classification du funnel marketing pour les Call-To-Action adaptés',
      },
      options: [
        { label: 'TOFU - Top of Funnel (Sensibilisation / Découverte)', value: 'tofu' },
        { label: 'MOFU - Middle of Funnel (Considération / Méthodologie)', value: 'mofu' },
        { label: 'BOFU - Bottom of Funnel (Décision / Conversion)', value: 'bofu' },
      ],
      label: 'Stade Funnel (CTA)',
    },
    {
      name: 'publishDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
      label: 'Date de publication',
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      admin: {
        position: 'sidebar',
      },
      label: 'Auteur',
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
      label: 'Catégories',
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
      label: 'Tags',
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Temps de lecture estimé en minutes',
      },
      label: 'Temps de lecture (min)',
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contenu',
          fields: [
            {
              name: 'intro',
              type: 'textarea',
              localized: true,
              label: 'Introduction / Chapeau',
              admin: {
                description: 'Texte d’introduction mis en exergue au début de l’article.',
              },
            },
            {
              name: 'mainImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Image de couverture principale',
            },
            {
              name: 'altImage',
              type: 'text',
              localized: true,
              label: 'Texte alternatif de l’image',
            },
            {
              name: 'content',
              type: 'richText',
              localized: true,
              label: 'Corps de l’article',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                ],
              }),
            },
          ],
        },
        {
          label: 'Recommandations',
          fields: [
            {
              name: 'relatedArticles',
              type: 'relationship',
              relationTo: 'articles',
              hasMany: true,
              filterOptions: ({ id }) => ({
                id: {
                  not_equals: id,
                },
              }),
              label: 'Articles similaires recommandés (manuel)',
              admin: {
                description: 'Si aucun article n’est sélectionné, la sélection automatique par tags/catégorie prendra le relais.',
              },
            },
          ],
        },
      ],
    },
  ],
}
