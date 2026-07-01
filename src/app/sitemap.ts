import type { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/sanity'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticles()

  return [
    {
      url: 'https://www.focus-esg.com/',
      lastModified: new Date('2026-06-26'),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...articles.map((article) => ({
      url: `https://www.focus-esg.com/article/${article.slug?.current || article._id}`,
      lastModified: new Date(article.publishedAt || article._createdAt),
      priority: article.category === '關於我們' ? 0.6 : article.category === '人物專訪' ? 0.8 : 0.9,
    })),
    {
      url: 'https://www.focus-esg.com/gift',
      lastModified: new Date('2026-06-26'),
      priority: 0.7,
    },
  ]
}
