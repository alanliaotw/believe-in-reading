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

// 取消（刪除）Facebook 粉專已排程貼文。body: { ids: string[] }
export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ message: '未授權' }, { status: 401 })
  }

  const token = process.env.FB_PAGE_ACCESS_TOKEN
  if (!token) {
    return Response.json({ message: '缺少 FB_PAGE_ACCESS_TOKEN' }, { status: 503 })
  }

  let ids: string[] = []
  try {
    const body = await request.json()
    if (Array.isArray(body?.ids)) ids = body.ids.filter((x: unknown) => typeof x === 'string')
  } catch {
    ids = []
  }

  if (ids.length === 0) {
    return Response.json({ message: '請提供 ids 陣列' }, { status: 400 })
  }

  const results: Array<{ id: string; ok: boolean; detail?: string }> = []
  for (const id of ids) {
    try {
      const url = new URL(`${GRAPH}/${id}`)
      url.searchParams.set('access_token', token)
      const res = await fetch(url, { method: 'DELETE' })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        results.push({ id, ok: false, detail: json?.error?.message || `HTTP ${res.status}` })
      } else {
        results.push({ id, ok: true })
      }
    } catch (err) {
      results.push({ id, ok: false, detail: err instanceof Error ? err.message : String(err) })
    }
  }

  return Response.json({ ok: true, deleted: results.filter((r) => r.ok).length, results })
}
