import { createClient } from '@sanity/client'
import { apiVersion, dataset, projectId } from '../sanity/env'

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

export type Article = {
  _id: string
  category: string
  title: string
  description?: string
  imageUrl: string
  videoUrl?: string
  colorStyle?: string
  status: 'published' | 'draft'
}

const PUBLISHED_ARTICLE_FIELDS = `
  _id,
  category,
  title,
  description,
  imageUrl,
  videoUrl,
  colorStyle,
  status
`

export async function getAllPublishedArticles(): Promise<Article[]> {
  return sanityClient.fetch(
    `*[_type == "article" && status == "published"] | order(_createdAt desc) { ${PUBLISHED_ARTICLE_FIELDS} }`
  )
}

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  return sanityClient.fetch(
    `*[_type == "article" && status == "published" && category == $category] | order(_createdAt desc) { ${PUBLISHED_ARTICLE_FIELDS} }`,
    { category }
  )
}
