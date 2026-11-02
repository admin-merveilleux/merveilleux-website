import type { GlobalConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Pied de page (Footer)',
  admin: {
    group: 'Configuration & Système',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      defaultValue: 'Merveilleux Design SAS — Studio de Product Design B2B SaaS. Lyon & Paris.',
      label: 'Texte sous le logo dans le footer',
    },
    {
      name: 'columns',
      type: 'array',
      label: 'Colonnes de liens',
      defaultValue: [
        {
          title: 'Services',
          links: [
            { label: 'Audit UX', url: '/services/audit-ux' },
            { label: 'Maquettes & Prototypes', url: '/services/maquettes' },
            { label: 'Design System', url: '/services/design-system' },
            { label: 'Gamification SaaS', url: '/services/gamification' },
            { label: 'Partenaires Produit', url: '/services/partenaires' },
          ],
        },
        {
          title: 'Agence',
          links: [
            { label: 'Notre approche', url: '/agence' },
            { label: 'Tarifs', url: '/tarifs' },
            { label: 'Portfolio', url: '/portfolio' },
            { label: 'Contact', url: '/contact' },
          ],
        },
        {
          title: 'Ressources',
          links: [
            { label: 'Blog & Articles', url: '/blog' },
            { label: 'E-book Couleurs SaaS', url: '/outils/e-book-gestion-couleurs-saas' },
            { label: 'Newsletter UX Wonders', url: '/outils/newsletter' },
          ],
        },
        {
          title: 'Légal',
          links: [
            { label: 'Mentions légales', url: '/mentions-legales' },
            { label: 'Politique de confidentialité', url: '/politique-de-confidentialite' },
          ],
        },
      ],
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          label: 'Titre de la colonne',
        },
        {
          name: 'links',
          type: 'array',
          label: 'Liens de la colonne',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
              label: 'Libellé du lien',
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              label: 'URL du lien',
            },
          ],
        },
      ],
    },
    {
      name: 'copyright',
      type: 'text',
      defaultValue: '© {year} Merveilleux Design SAS. Tous droits réservés.',
      label: 'Mention de copyright',
    },
  ],
}
