const articleCoverBySlug: Record<string, string> = {
  'esg-report-3-data-sources': '/article-esg-report-sources.png',
  'scope-1-2-3-team-workflow': '/article-scope-workflow.png',
  'green-power-communication-mistakes': '/article-green-power-mistakes.png',
  'small-business-sustainability-5-steps': '/article-small-business-5-steps.png',
  'one-week-sustainability-content-plan': '/article-one-week-content-plan.png',
  'why-esg-storytelling-matters': '/article-esg-story-cover.png',
  'sustainability-content-structure-template': '/article-sustainability-structure-cover.png',
}

export function getArticleCoverImage(slug?: string, fallback = '/focus-share-v2.jpg') {
  if (!slug) {
    return fallback
  }

  return articleCoverBySlug[slug] || fallback
}
