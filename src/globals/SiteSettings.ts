import type { GlobalConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Paramètres du site',
  admin: {
    group: 'Configuration & Système',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'merveilleUX',
      required: true,
      label: 'Nom du site / Agence',
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      defaultValue: 'Product Design pour les SaaS B2B et logiciels complexes',
      label: 'Slogan / Tagline',
    },
    {
      name: 'contactEmail',
      type: 'email',
      defaultValue: 'hello@merveilleux.design',
      label: 'Email de contact',
    },
    {
      name: 'consultationUrl',
      type: 'text',
      defaultValue: 'https://engage.merveilleux.design/meetings',
      label: 'Lien de réservation d’audit / appel de découverte',
    },
    {
      name: 'address',
      type: 'textarea',
      defaultValue: '8 place Antonin Poncet, 69002 Lyon, France',
      label: 'Adresse postale',
    },
    {
      name: 'ciiCertified',
      type: 'checkbox',
      defaultValue: true,
      label: 'Agréé Crédit Impôt Innovation (CII)',
    },
    {
      name: 'socialLinks',
      type: 'group',
      label: 'Réseaux sociaux',
      fields: [
        {
          name: 'linkedin',
          type: 'text',
          defaultValue: 'https://www.linkedin.com/company/merveilleux-design/',
          label: 'Page LinkedIn',
        },
        {
          name: 'twitter',
          type: 'text',
          label: 'Compte X / Twitter',
        },
      ],
    },
  ],
}
