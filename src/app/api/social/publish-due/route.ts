export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

import type { SocialPlatform, SocialPostRecord } from '@/lib/social'
import { getSocialPostImageUrls, isSocialPlatform } from '@/lib/social'
import {
  claimSocialPost,
  completeSocialPost,
  getDueSocialPosts,
  recordSocialPostPlatformResult,
} from '@/lib/socialQueue'
import { publishFacebookPost, publishInstagramImagePost } from '@/lib/socialPublishing'

type PublishSummary = {
  id: string
  title: string
  status: 'skipped' | 'published' | 'failed'
  publishedPlatforms: SocialPlatform[]
  errors: string[]
}

function isAuthorized(request: Request) {
  const secret = process.env.SOCIAL_PUBLISH_SECRET || process.env.SOCIAL_RUN_SECRET
  const headerSecret = request.headers.get('x-social-publish-secret')
  const legacyHeaderSecret = request.headers.get('x-social-run-secret')
  const authorization = request.headers.get('authorization')
  const bearerSecret = authorization?.startsWith('Bearer ') ? authorization.slice(7) : ''

  return Boolean(secret && (headerSecret === secret || legacyHeaderSecret === secret || bearerSecret === secret))
}

function clampLimit(value: unknown) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 1
  return Math.min(Math.max(Math.floor(value), 1), 20)
}

function toErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return '排程發文失敗。'
}

function getRequestedPlatforms(post: SocialPostRecord) {
  const platforms = (post.platforms || []).filter(isSocialPlatform)

  if (platforms.length > 0) return platforms

  if (post.platform === 'both') return ['facebook', 'instagram'] satisfies SocialPlatform[]
  if (post.platform === 'fb') return ['facebook'] satisfies SocialPlatform[]
  if (post.platform === 'ig') return ['instagram'] satisfies SocialPlatform[]

  return platforms
}

function getAlreadyPublishedPlatforms(post: SocialPostRecord) {
  const published: SocialPlatform[] = []

  if (post.facebookPostId) published.push('facebook')
  if (post.instagramMediaId) published.push('instagram')

  return published
}

async function publishPost(post: SocialPostRecord): Promise<PublishSummary> {
  const attemptedAt = new Date().toISOString()
  const claimed = await claimSocialPost(post, attemptedAt)

  if (!claimed) {
    return {
      id: post._id,
      title: post.title,
      status: 'skipped',
      publishedPlatforms: getAlreadyPublishedPlatforms(post),
      errors: ['這則貼文已被其他流程接手。'],
    }
  }

  const requestedPlatforms = getRequestedPlatforms(post)
  const imageUrls = getSocialPostImageUrls(post)
  const publishedPlatforms = getAlreadyPublishedPlatforms(post)
  const errors: string[] = []
  let facebookPostId = post.facebookPostId
  let instagramCreationId = post.instagramCreationId
  let instagramMediaId = post.instagramMediaId
  let instagramPermalink = post.instagramPermalink

  if (requestedPlatforms.includes('facebook') && !facebookPostId) {
    try {
      const result = await publishFacebookPost({
        message: post.caption,
        link: post.link,
        imageUrls,
      })

      facebookPostId = result.id
      await recordSocialPostPlatformResult(post._id, {
        attemptedAt,
        facebookPostId,
      })
      publishedPlatforms.push('facebook')
    } catch (error) {
      errors.push(`Facebook：${toErrorMessage(error)}`)
    }
  }

  if (requestedPlatforms.includes('instagram') && !instagramMediaId) {
    try {
      const result = await publishInstagramImagePost({
        caption: post.caption,
        imageUrls,
        link: post.link,
      })

      instagramCreationId = result.creationId
      instagramMediaId = result.mediaId
      instagramPermalink = result.permalink
      await recordSocialPostPlatformResult(post._id, {
        attemptedAt,
        instagramCreationId,
        instagramMediaId,
        instagramPermalink,
      })
      publishedPlatforms.push('instagram')
    } catch (error) {
      errors.push(`Instagram：${toErrorMessage(error)}`)
    }
  }

  const status = requestedPlatforms.every((platform) => publishedPlatforms.includes(platform))
    ? 'published'
    : 'failed'

  await completeSocialPost(post._id, {
    status,
    attemptedAt,
    publishedAt: status === 'published' ? new Date().toISOString() : post.publishedAt,
    errorMessage: errors.length > 0 ? errors.join('\n') : undefined,
    facebookPostId,
    instagramCreationId,
    instagramMediaId,
    instagramPermalink,
  })

  return {
    id: post._id,
    title: post.title,
    status,
    publishedPlatforms,
    errors,
  }
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ message: '未授權的排程發文請求。' }, { status: 401 })
  }

  let limit = 1

  try {
    const body = await request.json()
    limit = clampLimit(body?.limit)
  } catch {
    limit = 1
  }

  const duePosts = await getDueSocialPosts(limit)
  const summaries: PublishSummary[] = []

  for (const post of duePosts) {
    summaries.push(await publishPost(post))
  }

  return Response.json({
    ok: true,
    checkedAt: new Date().toISOString(),
    totalDue: duePosts.length,
    processed: summaries.filter((item) => item.status !== 'skipped').length,
    summaries,
  })
}
