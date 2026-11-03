import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Média',
    plural: 'Médiathèque',
  },
  admin: {
    group: 'Contenu',
  },
  access: {
    create: authenticated,
    read: anyone,
    update: authenticated,
    delete: authenticated,
  },
  upload: {
    staticDir: path.resolve(process.cwd(), 'public/media'),
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'application/pdf', 'image/svg+xml'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Texte alternatif (SEO / Accessibilité)',
      required: false,
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Légende',
    },
  ],
}
