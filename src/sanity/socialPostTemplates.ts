import type { Template } from 'sanity'

export const socialPostTemplateDefinitions: Template[] = [
  {
    id: 'social-post-instagram',
    title: 'IG 排程貼文',
    schemaType: 'socialPost',
    value: {
      platforms: ['instagram'],
      status: 'scheduled',
      attempts: 0,
    },
  },
  {
    id: 'social-post-facebook',
    title: 'FB 排程貼文',
    schemaType: 'socialPost',
    value: {
      platforms: ['facebook'],
      status: 'scheduled',
      attempts: 0,
    },
  },
  {
    id: 'social-post-both',
    title: 'FB + IG 排程貼文',
    schemaType: 'socialPost',
    value: {
      platforms: ['facebook', 'instagram'],
      status: 'scheduled',
      attempts: 0,
    },
  },
] as const

export const socialPostTemplateIds = socialPostTemplateDefinitions.map((template) => template.id)
