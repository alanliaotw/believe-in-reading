import 'server-only'

const graphApiVersion = process.env.META_GRAPH_API_VERSION || 'v25.0'

type GraphApiMethod = 'GET' | 'POST'

type GraphApiRequestOptions = {
  method?: GraphApiMethod
  params?: Record<string, string | number | boolean | undefined>
}

type FacebookPublishInput = {
  message?: string
  link?: string
  imageUrl?: string
  imageUrls?: string[]
  published?: boolean
}

type InstagramPublishInput = {
  caption?: string
  imageUrl?: string
  imageUrls?: string[]
  link?: string
}

export type FacebookPublishResult = {
  id: string
}

export type InstagramPublishResult = {
  creationId: string
  creationIds?: string[]
  mediaId: string
  permalink?: string
}

function cleanText(value: unknown, maxLength = 5000) {
  if (typeof value !== 'string') return ''
  return value.replace(/\r/g, '').trim().slice(0, maxLength)
}

function getRequiredEnv(key: string) {
  const value = process.env[key]

  if (!value) {
    throw new Error(`Missing env var: ${key}`)
  }

  return value
}

function getInstagramAccessToken() {
  return process.env.INSTAGRAM_ACCESS_TOKEN || getRequiredEnv('FB_PAGE_ACCESS_TOKEN')
}

function getInstagramBusinessAccountId() {
  return (
    process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID ||
    process.env.IG_BUSINESS_ACCOUNT_ID ||
    getRequiredEnv('INSTAGRAM_BUSINESS_ACCOUNT_ID')
  )
}

function buildTextWithLink(message?: string, link?: string) {
  return [cleanText(message), cleanText(link, 500)].filter(Boolean).join('\n\n')
}

function normalizeImageUrls(imageUrl?: string, imageUrls?: string[]) {
  const urls = [...(Array.isArray(imageUrls) ? imageUrls : []), imageUrl]
    .map((url) => cleanText(url, 1000))
    .filter(Boolean)

  return Array.from(new Set(urls)).slice(0, 10)
}

async function graphApiRequest<T>(
  path: string,
  { method = 'POST', params = {} }: GraphApiRequestOptions = {}
) {
  const normalizedPath = path.replace(/^\/+/, '')
  const url = new URL(`https://graph.facebook.com/${graphApiVersion}/${normalizedPath}`)
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue
    searchParams.set(key, String(value))
  }

  if (method === 'GET') {
    url.search = searchParams.toString()
  }

  const response = await fetch(url, {
    method,
    headers:
      method === 'POST'
        ? { 'Content-Type': 'application/x-www-form-urlencoded' }
        : undefined,
    body: method === 'POST' ? searchParams : undefined,
  })

  const result = await response.json().catch(() => ({}))

  if (!response.ok) {
    const errorMessage =
      typeof result?.error?.message === 'string'
        ? result.error.message
        : 'Meta Graph API request failed.'

    throw new Error(errorMessage)
  }

  return result as T
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function waitForInstagramContainerReady(creationId: string, accessToken: string) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const status = await graphApiRequest<{ status_code?: string }>(creationId, {
      method: 'GET',
      params: {
        access_token: accessToken,
        fields: 'status_code',
      },
    })

    const statusCode = status.status_code

    if (statusCode === 'FINISHED' || statusCode === 'PUBLISHED') {
      return
    }

    if (statusCode === 'ERROR' || statusCode === 'EXPIRED') {
      throw new Error(`Instagram media container is not publishable: ${statusCode}`)
    }

    await sleep(5000)
  }

  throw new Error('Instagram media container did not become ready in time.')
}

export async function publishFacebookPost({
  message,
  link,
  imageUrl,
  imageUrls,
  published = true,
}: FacebookPublishInput): Promise<FacebookPublishResult> {
  const normalizedMessage = cleanText(message)
  const normalizedLink = cleanText(link, 500)
  const normalizedImageUrls = normalizeImageUrls(imageUrl, imageUrls)
  const firstImageUrl = normalizedImageUrls[0]

  if (!normalizedMessage && !normalizedLink && normalizedImageUrls.length === 0) {
    throw new Error('Facebook 發文需要文字、連結或圖片。')
  }

  const pageId = getRequiredEnv('FB_PAGE_ID')
  const accessToken = getRequiredEnv('FB_PAGE_ACCESS_TOKEN')

  if (normalizedImageUrls.length > 1) {
    const attachedMedia: Record<string, string> = {}

    for (const [index, url] of normalizedImageUrls.entries()) {
      const photo = await graphApiRequest<{ id: string }>(`${pageId}/photos`, {
        params: {
          access_token: accessToken,
          published: false,
          url,
        },
      })

      attachedMedia[`attached_media[${index}]`] = JSON.stringify({ media_fbid: photo.id })
    }

    const result = await graphApiRequest<{ id: string }>(`${pageId}/feed`, {
      params: {
        access_token: accessToken,
        published,
        message: buildTextWithLink(normalizedMessage, normalizedLink) || undefined,
        ...attachedMedia,
      },
    })

    return { id: result.id }
  }

  if (firstImageUrl) {
    const result = await graphApiRequest<{ id: string; post_id?: string }>(`${pageId}/photos`, {
      params: {
        access_token: accessToken,
        published,
        url: firstImageUrl,
        caption: buildTextWithLink(normalizedMessage, normalizedLink) || undefined,
      },
    })

    return {
      id: result.post_id || result.id,
    }
  }

  const result = await graphApiRequest<{ id: string }>(`${pageId}/feed`, {
    params: {
      access_token: accessToken,
      published,
      message: normalizedMessage || undefined,
      link: normalizedLink || undefined,
    },
  })

  return { id: result.id }
}

export async function publishInstagramImagePost({
  caption,
  imageUrl,
  imageUrls,
  link,
}: InstagramPublishInput): Promise<InstagramPublishResult> {
  const normalizedImageUrls = normalizeImageUrls(imageUrl, imageUrls)

  if (normalizedImageUrls.length === 0) {
    throw new Error('Instagram 發文需要圖片連結。')
  }

  const accessToken = getInstagramAccessToken()
  const instagramBusinessAccountId = getInstagramBusinessAccountId()
  const normalizedCaption = buildTextWithLink(cleanText(caption, 2200), cleanText(link, 500))

  if (normalizedImageUrls.length > 1) {
    const creationIds: string[] = []

    for (const url of normalizedImageUrls) {
      const child = await graphApiRequest<{ id: string }>(`${instagramBusinessAccountId}/media`, {
        params: {
          access_token: accessToken,
          image_url: url,
          is_carousel_item: true,
        },
      })

      await waitForInstagramContainerReady(child.id, accessToken)
      creationIds.push(child.id)
    }

    const creation = await graphApiRequest<{ id: string }>(`${instagramBusinessAccountId}/media`, {
      params: {
        access_token: accessToken,
        media_type: 'CAROUSEL',
        children: creationIds.join(','),
        caption: normalizedCaption || undefined,
      },
    })

    await waitForInstagramContainerReady(creation.id, accessToken)

    const publish = await graphApiRequest<{ id: string }>(`${instagramBusinessAccountId}/media_publish`, {
      params: {
        access_token: accessToken,
        creation_id: creation.id,
      },
    })

    const permalink = await getInstagramPermalink(publish.id, accessToken)

    return {
      creationId: creation.id,
      creationIds,
      mediaId: publish.id,
      permalink,
    }
  }

  const creation = await graphApiRequest<{ id: string }>(`${instagramBusinessAccountId}/media`, {
    params: {
      access_token: accessToken,
      image_url: normalizedImageUrls[0],
      caption: normalizedCaption || undefined,
    },
  })

  await waitForInstagramContainerReady(creation.id, accessToken)

  const publish = await graphApiRequest<{ id: string }>(`${instagramBusinessAccountId}/media_publish`, {
    params: {
      access_token: accessToken,
      creation_id: creation.id,
    },
  })

  const permalink = await getInstagramPermalink(publish.id, accessToken)

  return {
    creationId: creation.id,
    mediaId: publish.id,
    permalink,
  }
}

async function getInstagramPermalink(mediaId: string, accessToken: string) {
  try {
    const media = await graphApiRequest<{ permalink?: string }>(mediaId, {
      method: 'GET',
      params: {
        access_token: accessToken,
        fields: 'permalink',
      },
    })

    return media.permalink
  } catch {
    return undefined
  }
}
