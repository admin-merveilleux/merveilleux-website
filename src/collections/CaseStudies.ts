import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  labels: {
    singular: 'Étude de cas / Projet',
    plural: 'Portfolio & Études de cas',
  },
  admin: {
    useAsTitle: 'clientName',
    defaultColumns: ['clientName', 'title', 'featured', 'order'],
    group: 'Portfolio',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'clientName',
      type: 'text',
      required: true,
      label: 'Nom du client / SaaS (ex: Hoko, Knight App, Ademova)',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Titre du projet / Accroche',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Slug URL (ex: hoko, knight-app)',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
      label: 'Mettre en avant sur la page d’accueil',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
      label: 'Ordre d’affichage',
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
      label: 'Services réalisés',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Image de couverture principale',
    },
    {
      name: 'clientLogo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo du client (SVG ou PNG)',
    },
    {
      name: 'summary',
      type: 'textarea',
      localized: true,
      label: 'Résumé du projet en 2-3 phrases',
    },
    {
      name: 'metrics',
      type: 'array',
      label: 'Chiffres clés & Résultats chiffrés',
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          label: 'Valeur (ex: +38%, -50%, x3)',
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
          label: 'Libellé (ex: Taux de conversion onboarding, Réduction churn)',
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Détails du projet',
          fields: [
            {
              name: 'challenge',
              type: 'richText',
              localized: true,
              editor: lexicalEditor(),
              label: '1. Le Défi / Contexte',
            },
            {
              name: 'solution',
              type: 'richText',
              localized: true,
              editor: lexicalEditor(),
              label: '2. Notre Approche & Solution UX/UI',
            },
            {
              name: 'results',
              type: 'richText',
              localized: true,
              editor: lexicalEditor(),
              label: '3. Impact & Résultats',
            },
          ],
        },
        {
          label: 'Témoignage client',
          fields: [
            {
              name: 'testimonialQuote',
              type: 'textarea',
              localized: true,
              label: 'Citation / Retour client',
            },
            {
              name: 'testimonialAuthor',
              type: 'text',
              label: 'Nom de l’interlocuteur',
            },
            {
              name: 'testimonialRole',
              type: 'text',
              label: 'Poste chez le client (ex: Founder & CEO)',
            },
          ],
        },
        {
          label: 'Galerie d’écrans',
          fields: [
            {
              name: 'screens',
              type: 'array',
              label: 'Captures d’écran & Maquettes UI',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'caption',
                  type: 'text',
                  localized: true,
                  label: 'Légende explicative',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
