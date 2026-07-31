import type { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/sanity'

// sitemap 預設會在 build 時靜態產生後凍住，新文章就永遠進不了 sitemap。
// 設 revalidate 讓它定期重新產生。
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticles()

  const latestPublishedAt = articles.reduce<Date>((latest, article) => {
    const published = new Date(article.publishedAt || article._createdAt)
    return published > latest ? published : latest
  }, new Date('2026-06-26'))

  return [
    {
      url: 'https://www.focus-esg.com/',
      lastModified: latestPublishedAt,
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
