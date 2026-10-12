import { createClient } from '@sanity/client'
import type { PortableTextBlock } from '@portabletext/types'
import { apiVersion, dataset, projectId } from '../sanity/env'

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
})

export type ArticleBodyImage = {
  _type: 'image'
  _key: string
  caption?: string
  alt?: string
  assetUrl?: string
  dimensions?: {
    width?: number
    height?: number
    aspectRatio?: number
  }
}

export type Article = {
  _id: string
  category: string
  title: string
  slug?: {
    current?: string
  }
  description?: string
  body?: (PortableTextBlock | ArticleBodyImage)[]
  imageUrl?: string
  videoUrl?: string
  colorStyle?: string
  publishedAt?: string
  featured?: boolean
  status: 'published' | 'draft'
  _createdAt: string
}

const PUBLISHED_ARTICLE_FIELDS = `
  _id,
  _createdAt,
  category,
  title,
  slug,
  description,
  body[] {
    ...,
    _type == "image" => {
      "assetUrl": asset->url,
      "dimensions": asset->metadata.dimensions
    }
  },
  imageUrl,
  videoUrl,
  colorStyle,
  publishedAt,
  featured,
  status
`

const VISIBLE_PUBLISHED_ARTICLE_FILTER = `
  _type == "article" &&
  status == "published" &&
  (!defined(publishedAt) || publishedAt <= now())
`

export async function getAllArticles(): Promise<Article[]> {
  return sanityClient.fetch(
    `*[${VISIBLE_PUBLISHED_ARTICLE_FILTER}] | order(coalesce(publishedAt, _createdAt) desc, _createdAt desc) { ${PUBLISHED_ARTICLE_FIELDS} }`
  )
}

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  return sanityClient.fetch(
    `*[${VISIBLE_PUBLISHED_ARTICLE_FILTER} && category == $category] | order(coalesce(publishedAt, _createdAt) desc, _createdAt desc) { ${PUBLISHED_ARTICLE_FIELDS} }`,
    { category }
  )
}

export async function getArticleBySlugOrId(key: string): Promise<Article | null> {
  return sanityClient.fetch(
    `*[${VISIBLE_PUBLISHED_ARTICLE_FILTER} && (slug.current == $key || _id == $key)][0] { ${PUBLISHED_ARTICLE_FIELDS} }`,
    { key }
  )
}
