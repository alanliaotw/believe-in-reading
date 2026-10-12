const FALLBACK_COVER = '/focus-share-v2.jpg'

const articleCoverBySlug: Record<string, string> = {
  'esg-report-3-data-sources': '/article-esg-report-sources.png',
  'scope-1-2-3-team-workflow': '/article-scope-workflow.png',
  'green-power-communication-mistakes': '/article-green-power-mistakes.png',
  'small-business-sustainability-5-steps': '/article-small-business-5-steps.png',
  'one-week-sustainability-content-plan': '/article-one-week-content-plan.png',
  'why-esg-storytelling-matters': '/article-esg-story-cover.png',
  'sustainability-content-structure-template': '/article-sustainability-structure-cover.png',
}

export function getArticleCoverImage(slug?: string, fallback = FALLBACK_COVER) {
  if (!slug) {
    return fallback
  }

  return articleCoverBySlug[slug] || fallback
}

type ArticleCoverSource = {
  slug?: { current?: string }
  imageUrl?: string
  body?: unknown
}

function firstBodyImageUrl(body: unknown): string | undefined {
  if (!Array.isArray(body)) return undefined

  for (const node of body) {
    if (node && typeof node === 'object') {
      const candidate = node as { _type?: unknown; assetUrl?: unknown }
      if (candidate._type === 'image' && typeof candidate.assetUrl === 'string' && candidate.assetUrl) {
        return candidate.assetUrl
      }
    }
  }

  return undefined
}

/**
 * 封面圖優先序：
 * 1. slug 對照表（幾篇舊文章有專屬封面）
 * 2. 文章填的「封面圖片連結」
 * 3. 內文第一張圖片——沒填封面連結時自動沿用，上稿時可以少填一個欄位
 * 4. 預設分享圖
 */
export function resolveArticleCover(article: ArticleCoverSource, width = 1600) {
  const mapped = article.slug?.current ? articleCoverBySlug[article.slug.current] : undefined
  if (mapped) return mapped

  if (article.imageUrl) return article.imageUrl

  const bodyImage = firstBodyImageUrl(article.body)
  if (bodyImage) return `${bodyImage}?w=${width}&q=80&auto=format`

  return FALLBACK_COVER
}
