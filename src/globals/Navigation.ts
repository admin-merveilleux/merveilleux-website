import type { GlobalConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Menu Header (Navigation)',
  admin: {
    group: 'Configuration & Système',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Éléments du menu principal',
      defaultValue: [
        { label: 'Services', url: '/services/audit-ux' },
        { label: 'Tarifs', url: '/tarifs' },
        { label: 'Portfolio', url: '/portfolio' },
        { label: 'Agence', url: '/agence' },
        { label: 'Contact', url: '/contact' },
      ],
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
          label: 'Libellé',
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'Lien relatif ou absolu',
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Bouton d’action principal (Header CTA)',
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'Réserver un audit',
          localized: true,
          label: 'Texte du bouton',
        },
        {
          name: 'url',
          type: 'text',
          defaultValue: 'https://engage.merveilleux.design/meetings',
          label: 'Lien URL',
        },
      ],
    },
  ],
}
