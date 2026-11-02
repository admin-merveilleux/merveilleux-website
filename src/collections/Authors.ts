import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const Authors: CollectionConfig = {
  slug: 'authors',
  labels: {
    singular: 'Auteur',
    plural: 'Auteurs',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Blog',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nom complet',
    },
    {
      name: 'role',
      type: 'text',
      label: 'Poste / Titre (ex: Product Designer, Co-fondateur)',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Photo de profil',
    },
    {
      name: 'bio',
      type: 'textarea',
      localized: true,
      label: 'Biographie courte',
    },
    {
      name: 'linkedinUrl',
      type: 'text',
      label: 'Profil LinkedIn',
    },
    {
      name: 'twitterUrl',
      type: 'text',
      label: 'Profil X / Twitter',
    },
  ],
}
