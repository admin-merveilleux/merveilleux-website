import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Page',
    plural: 'Pages du site',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Contenu',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Titre de la page',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Slug URL (ex: home, agence, tarifs, contact)',
    },
    {
      name: 'hero',
      type: 'group',
      label: 'Section Hero',
      fields: [
        {
          name: 'headline',
          type: 'text',
          localized: true,
          label: 'Grand titre (H1)',
        },
        {
          name: 'subheadline',
          type: 'textarea',
          localized: true,
          label: 'Sous-titre / Description',
        },
        {
          name: 'ctaLabel',
          type: 'text',
          localized: true,
          label: 'Texte du bouton CTA principal',
        },
        {
          name: 'ctaLink',
          type: 'text',
          label: 'Lien du bouton CTA (ex: /outils/consultation ou URL externe)',
        },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
      editor: lexicalEditor(),
      label: 'Contenu principal de la page',
    },
  ],
}
