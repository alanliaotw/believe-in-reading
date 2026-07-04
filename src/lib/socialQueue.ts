import 'server-only'

import type { SocialPostRecord, SocialPostStatus } from '@/lib/social'
import { getSanityWriteClient } from '@/lib/sanity.server'

const SOCIAL_POST_FIELDS = `
  _id,
  _rev,
  title,
  topic,
  series,
  contentAngle,
  owner,
  caption,
  imageUrl,
  images,
  link,
  scheduledAt,
  platforms,
  platform,
  status,
  attempts,
  lastAttemptedAt,
  publishedAt,
  errorMessage,
  facebookPostId,
  instagramCreationId,
  instagramMediaId,
  instagramPermalink
`

export async function getDueSocialPosts(limit = 5): Promise<SocialPostRecord[]> {
  const client = getSanityWriteClient()
  const now = new Date().toISOString()
  const staleBefore = new Date(Date.now() - 30 * 60 * 1000).toISOString()

  return client.fetch(
    `*[
      _type == "socialPost" &&
      defined(scheduledAt) &&
      dateTime(scheduledAt) <= dateTime($now) &&
      (
        status in ["scheduled", "failed"] ||
        (
          status == "processing" &&
          (
            !defined(lastAttemptedAt) ||
            dateTime(lastAttemptedAt) < dateTime($staleBefore)
          )
        )
      )
    ] | order(dateTime(scheduledAt) asc)[0...$limit] { ${SOCIAL_POST_FIELDS} }`,
    { now, staleBefore, limit }
  )
}

export async function claimSocialPost(post: SocialPostRecord, attemptedAt: string) {
  const client = getSanityWriteClient()

  try {
    await client
      .patch(post._id)
      .ifRevisionId(post._rev)
      .setIfMissing({ attempts: 0 })
      .inc({ attempts: 1 })
      .set({
        status: 'processing',
        lastAttemptedAt: attemptedAt,
      })
      .unset(['errorMessage'])
      .commit()

    return true
  } catch {
    return false
  }
}

type CompleteSocialPostInput = {
  status: SocialPostStatus
  attemptedAt: string
  publishedAt?: string
  errorMessage?: string
  facebookPostId?: string
  instagramCreationId?: string
  instagramMediaId?: string
  instagramPermalink?: string
}

type PlatformPublishResultInput = {
  attemptedAt: string
  facebookPostId?: string
  instagramCreationId?: string
  instagramMediaId?: string
  instagramPermalink?: string
}

export async function recordSocialPostPlatformResult(postId: string, result: PlatformPublishResultInput) {
  const client = getSanityWriteClient()
  const patch = client.patch(postId).set({
    lastAttemptedAt: result.attemptedAt,
  })

  if (result.facebookPostId) {
    patch.set({ facebookPostId: result.facebookPostId })
  }

  if (result.instagramCreationId) {
    patch.set({ instagramCreationId: result.instagramCreationId })
  }

  if (result.instagramMediaId) {
    patch.set({ instagramMediaId: result.instagramMediaId })
  }

  if (result.instagramPermalink) {
    patch.set({ instagramPermalink: result.instagramPermalink })
  }

  await patch.commit()
}

export async function completeSocialPost(postId: string, result: CompleteSocialPostInput) {
  const client = getSanityWriteClient()
  const patch = client.patch(postId).set({
    status: result.status,
    lastAttemptedAt: result.attemptedAt,
  })

  if (result.publishedAt) {
    patch.set({ publishedAt: result.publishedAt })
  }

  if (result.errorMessage) {
    patch.set({ errorMessage: result.errorMessage })
  } else {
    patch.unset(['errorMessage'])
  }

  if (result.facebookPostId) {
    patch.set({ facebookPostId: result.facebookPostId })
  }

  if (result.instagramCreationId) {
    patch.set({ instagramCreationId: result.instagramCreationId })
  }

  if (result.instagramMediaId) {
    patch.set({ instagramMediaId: result.instagramMediaId })
  }

  if (result.instagramPermalink) {
    patch.set({ instagramPermalink: result.instagramPermalink })
  }

  await patch.commit()
}
