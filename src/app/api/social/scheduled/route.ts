export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const GRAPH = `https://graph.facebook.com/${process.env.META_GRAPH_API_VERSION || 'v25.0'}`

function isAuthorized(request: Request) {
  const secret = process.env.SOCIAL_PUBLISH_SECRET || process.env.SOCIAL_RUN_SECRET
  const headerSecret = request.headers.get('x-social-publish-secret')
  const legacyHeaderSecret = request.headers.get('x-social-run-secret')
  const authorization = request.headers.get('authorization')
  const bearerSecret = authorization?.startsWith('Bearer ') ? authorization.slice(7) : ''
  return Boolean(secret && (headerSecret === secret || legacyHeaderSecret === secret || bearerSecret === secret))
}

type FbScheduledPost = {
  id: string
  message?: string
  scheduled_publish_time?: number
  created_time?: string
}

async function handle(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ message: '未授權' }, { status: 401 })
  }

  const pageId = process.env.FB_PAGE_ID
  const token = process.env.FB_PAGE_ACCESS_TOKEN
  if (!pageId || !token) {
    return Response.json({ message: '缺少 FB_PAGE_ID 或 FB_PAGE_ACCESS_TOKEN' }, { status: 503 })
  }

  const url = new URL(`${GRAPH}/${pageId}/scheduled_posts`)
  url.searchParams.set('fields', 'id,message,scheduled_publish_time,created_time')
  url.searchParams.set('limit', '100')
  url.searchParams.set('access_token', token)

  const res = await fetch(url, { cache: 'no-store' })
  const json = await res.json().catch(() => ({}))

  if (!res.ok) {
    return Response.json(
      { ok: false, message: json?.error?.message || 'Graph API 查詢失敗', code: json?.error?.code },
      { status: 502 }
    )
  }

  const facebook = ((json.data as FbScheduledPost[]) || [])
    .map((p) => ({
      id: p.id,
      preview: (p.message || '').replace(/\s+/g, ' ').slice(0, 80),
      scheduledAt: p.scheduled_publish_time
        ? new Date(p.scheduled_publish_time * 1000).toISOString()
        : null,
      scheduledAtTaipei: p.scheduled_publish_time
        ? new Date(p.scheduled_publish_time * 1000).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
        : null,
    }))
    .sort((a, b) => (a.scheduledAt || '').localeCompare(b.scheduledAt || ''))

  return Response.json({
    ok: true,
    checkedAt: new Date().toISOString(),
    facebook,
    facebookCount: facebook.length,
    instagram: {
      note: 'Instagram 排程無法透過 Graph API 查詢；IG 已排的貼文請至 Meta Business Suite 的 Planner 檢視。',
    },
  })
}

export async function GET(request: Request) {
  return handle(request)
}
export async function POST(request: Request) {
  return handle(request)
}
