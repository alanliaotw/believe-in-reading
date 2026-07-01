import { createClient } from '@sanity/client'
import type { PortableTextBlock } from '@portabletext/types'
import { apiVersion, dataset, projectId } from '../sanity/env'

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
})

export type Article = {
  _id: string
  category: string
  title: string
  slug?: {
    current?: string
  }
  description?: string
  body?: PortableTextBlock[]
  imageUrl: string
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
  body,
  imageUrl,
  videoUrl,
  colorStyle,
  publishedAt,
  featured,
  status
`

export async function getAllArticles(): Promise<Article[]> {
  return sanityClient.fetch(
    `*[_type == "article" && status == "published"] | order(coalesce(publishedAt, _createdAt) desc, _createdAt desc) { ${PUBLISHED_ARTICLE_FIELDS} }`
  )
}

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  return sanityClient.fetch(
    `*[_type == "article" && status == "published" && category == $category] | order(coalesce(publishedAt, _createdAt) desc, _createdAt desc) { ${PUBLISHED_ARTICLE_FIELDS} }`,
    { category }
  )
}

export async function getArticleBySlugOrId(key: string): Promise<Article | null> {
  return sanityClient.fetch(
    `*[_type == "article" && status == "published" && (slug.current == $key || _id == $key)][0] { ${PUBLISHED_ARTICLE_FIELDS} }`,
    { key }
  )
}
