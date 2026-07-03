export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import nodemailer from 'nodemailer'

const graphApiVersion = process.env.META_GRAPH_API_VERSION || 'v25.0'
const alertDays = Number(process.env.META_TOKEN_ALERT_DAYS || 7)

function isAuthorized(request: Request) {
  const secret = process.env.SOCIAL_PUBLISH_SECRET || process.env.SOCIAL_RUN_SECRET
  const headerSecret = request.headers.get('x-social-publish-secret')
  const legacyHeaderSecret = request.headers.get('x-social-run-secret')
  const authorization = request.headers.get('authorization')
  const bearerSecret = authorization?.startsWith('Bearer ') ? authorization.slice(7) : ''

  return Boolean(secret && (headerSecret === secret || legacyHeaderSecret === secret || bearerSecret === secret))
}

function getRequiredEnv(key: string) {
  const value = process.env[key]

  if (!value) {
    throw new Error(`Missing env var: ${key}`)
  }

  return value
}

async function sendTokenAlert(subject: string, text: string) {
  if (!process.env.SMTP_HOST) return false

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  })

  await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
    to: process.env.TOKEN_ALERT_EMAIL || process.env.INQUIRY_TO_EMAIL || process.env.SMTP_USER,
    subject,
    text,
  })

  return true
}

async function handle(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ message: '未授權的 Token 檢查請求。' }, { status: 401 })
  }

  const appId = getRequiredEnv('META_APP_ID')
  const appSecret = getRequiredEnv('META_APP_SECRET')
  const pageAccessToken = getRequiredEnv('FB_PAGE_ACCESS_TOKEN')
  const appToken = `${appId}|${appSecret}`
  const url = new URL(`https://graph.facebook.com/${graphApiVersion}/debug_token`)

  url.searchParams.set('input_token', pageAccessToken)
  url.searchParams.set('access_token', appToken)

  const response = await fetch(url)
  const result = await response.json().catch(() => ({}))
  const data = result?.data

  if (!response.ok || !data) {
    return Response.json(
      { ok: false, message: result?.error?.message || '無法查詢 Meta Token 狀態。' },
      { status: 502 }
    )
  }

  const now = Math.floor(Date.now() / 1000)
  const expiresAt = typeof data.expires_at === 'number' ? data.expires_at : 0
  const daysLeft = expiresAt === 0 ? null : Math.ceil((expiresAt - now) / 86400)
  const isValid = Boolean(data.is_valid)
  const shouldAlert = !isValid || (daysLeft !== null && daysLeft <= alertDays)
  let alertSent = false

  if (shouldAlert) {
    const subject = isValid
      ? `[相信閱讀] Meta Token 即將過期，剩 ${daysLeft} 天`
      : '[相信閱讀] Meta Token 已失效'
    const text = isValid
      ? `Meta Page Token 約剩 ${daysLeft} 天到期。請更新 Vercel 的 FB_PAGE_ACCESS_TOKEN，避免 IG / FB 雲端排程停發。`
      : 'Meta Page Token 已失效。請重新產生長效 Page Token，並更新 Vercel 的 FB_PAGE_ACCESS_TOKEN。'

    try {
      alertSent = await sendTokenAlert(subject, text)
    } catch (error) {
      console.error('[social-token-check] Failed to send token alert', error)
    }
  }

  return Response.json({
    ok: true,
    isValid,
    expiresAt,
    daysLeft,
    alertSent,
  })
}

export async function GET(request: Request) {
  return handle(request)
}

export async function POST(request: Request) {
  return handle(request)
}
