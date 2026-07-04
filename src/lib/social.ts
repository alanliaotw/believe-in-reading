export const SOCIAL_PLATFORMS = ['facebook', 'instagram'] as const

export const SOCIAL_POST_STATUSES = [
  'draft',
  'scheduled',
  'paused',
  'processing',
  'published',
  'failed',
] as const

export const SOCIAL_CONTENT_OWNERS = ['claude', 'codex', 'manual'] as const

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]
export type SocialPostStatus = (typeof SOCIAL_POST_STATUSES)[number]
export type SocialContentOwner = (typeof SOCIAL_CONTENT_OWNERS)[number]

export type SocialPostRecord = {
  _id: string
  _rev: string
  title: string
  topic?: string
  series?: string
  contentAngle?: string
  owner?: SocialContentOwner
  caption: string
  imageUrl?: string
  images?: string[]
  link?: string
  scheduledAt: string
  platforms: SocialPlatform[]
  platform?: 'ig' | 'fb' | 'both'
  status: SocialPostStatus
  attempts?: number
  lastAttemptedAt?: string
  publishedAt?: string
  errorMessage?: string
  facebookPostId?: string
  instagramCreationId?: string
  instagramMediaId?: string
  instagramPermalink?: string
}

export function isSocialPlatform(value: string): value is SocialPlatform {
  return SOCIAL_PLATFORMS.includes(value as SocialPlatform)
}

export function getSocialPostImageUrls(post: Pick<SocialPostRecord, 'imageUrl' | 'images'>) {
  const images = Array.isArray(post.images) ? post.images : []
  const urls = [...images, post.imageUrl].filter((value): value is string => {
    return typeof value === 'string' && value.trim().length > 0
  })

  return Array.from(new Set(urls.map((url) => url.trim()))).slice(0, 10)
}
