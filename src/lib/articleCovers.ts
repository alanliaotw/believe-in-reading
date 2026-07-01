const articleCoverBySlug: Record<string, string> = {
  'why-esg-storytelling-matters': '/article-esg-story-cover.png',
  'sustainability-content-structure-template': '/article-sustainability-structure-cover.png',
}

export function getArticleCoverImage(slug?: string, fallback = '/focus-share-v2.jpg') {
  if (!slug) {
    return fallback
  }

  return articleCoverBySlug[slug] || fallback
}
