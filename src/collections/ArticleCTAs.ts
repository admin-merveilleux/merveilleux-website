import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const ArticleCTAs: CollectionConfig = {
  slug: 'article-ctas',
  labels: {
    singular: 'Encart CTA',
    plural: 'Encarts CTA',
  },
  admin: {
    useAsTitle: 'internalName',
    defaultColumns: ['internalName', 'funnel', 'buttonText', 'isActive', 'updatedAt'],
    group: 'Blog',
    description: 'Encarts Call-to-Action affichés dans les articles de blog selon leur stade de funnel marketing.',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'internalName',
      type: 'text',
      required: true,
      label: 'Nom interne / Identifiant',
      admin: {
        description: 'Ex: "TOFU - Suivre merveilleUX LinkedIn", "MOFU - Audit UX", "BOFU - Démo 30 min"',
      },
    },
    {
      name: 'funnel',
      type: 'select',
      required: true,
      defaultValue: 'mofu',
      options: [
        { label: 'TOFU - Sensibilisation / Découverte', value: 'tofu' },
        { label: 'MOFU - Considération / Méthodologie', value: 'mofu' },
        { label: 'BOFU - Décision / Conversion', value: 'bofu' },
        { label: 'Tous les funnels', value: 'all' },
      ],
      label: 'Segment Funnel cible',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Actif',
      admin: {
        position: 'sidebar',
        description: 'Désactiver pour exclure temporairement cet encart de la rotation automatique.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contenu',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true,
              label: 'Sur-titre / Accroche',
              admin: {
                description: 'Ex: "Votre logiciel mérite mieux que des conseils UX génériques."',
              },
            },
            {
              name: 'subtitle',
              type: 'text',
              required: true,
              localized: true,
              label: 'Titre principal (dégradé Merveilleux)',
              admin: {
                description: 'Ex: "Suivez nos analyses produit sur LinkedIn."',
              },
            },
            {
              name: 'text',
              type: 'textarea',
              required: true,
              localized: true,
              label: 'Texte explicatif',
              admin: {
                description: 'Ex: "On y parle de SaaS B2B, d’interfaces complexes, de dette UX..."',
              },
            },
            {
              name: 'buttonText',
              type: 'text',
              required: true,
              localized: true,
              label: 'Libellé du bouton',
              admin: {
                description: 'Ex: "Suivre merveilleUX", "Voir notre audit UX", etc.',
              },
            },
            {
              name: 'buttonUrl',
              type: 'text',
              required: true,
              label: 'URL de destination du bouton',
              admin: {
                description: 'Lien interne (ex: /fr/services/audit-ux) ou lien externe (ex: https://linkedin.com/...)',
              },
            },
          ],
        },
        {
          label: 'Design & Médias (Optionnel)',
          fields: [
            {
              name: 'badge',
              type: 'text',
              localized: true,
              label: 'Badge / Tag (optionnel)',
              admin: {
                description: 'Ex: "Conseil UX", "Audit Gratuit", "Newsletter"',
              },
            },
            {
              name: 'image',
              type: 'relationship',
              relationTo: 'media',
              label: 'Image ou icône d’illustration (optionnel)',
            },
          ],
        },
      ],
    },
  ],
}
