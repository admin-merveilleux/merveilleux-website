import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: 'Service',
    plural: 'Services',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Services & Offres',
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
      label: 'Titre du service',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Slug URL (ex: audit-ux, maquettes, design-system)',
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      localized: true,
      label: 'Description courte (accroche pour les cartes de service)',
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      label: 'Icône / Illustration SVG',
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Visuel principal',
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
      editor: lexicalEditor(),
      label: 'Présentation détaillée du service',
    },
    {
      name: 'benefits',
      type: 'array',
      localized: true,
      label: 'Bénéfices clés pour les SaaS B2B',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Titre de l’avantage',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Explication',
        },
      ],
    },
    {
      name: 'deliverables',
      type: 'array',
      localized: true,
      label: 'Livrables concrets',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Nom du livrable (ex: Prototype Figma, Audit heuristique, Fichier Design Tokens)',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Détail',
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Ordre d’affichage',
    },
  ],
}
