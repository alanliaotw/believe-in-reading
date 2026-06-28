export const runtime = 'nodejs';

type FacebookPostPayload = {
  message?: string;
  link?: string;
  published?: boolean;
};

const graphApiVersion = 'v25.0';

function cleanText(value: unknown, maxLength = 5000) {
  if (typeof value !== 'string') return '';
  return value.replace(/\r/g, '').trim().slice(0, maxLength);
}

function parseBoolean(value: unknown) {
  if (typeof value !== 'boolean') return true;
  return value;
}

function isAuthorized(request: Request) {
  const secret = process.env.FB_POST_SECRET;
  const headerSecret = request.headers.get('x-fb-post-secret');
  const authorization = request.headers.get('authorization');
  const bearerSecret = authorization?.startsWith('Bearer ') ? authorization.slice(7) : '';

  return Boolean(secret && (headerSecret === secret || bearerSecret === secret));
}

function requireFacebookEnv() {
  const required = ['FB_PAGE_ID', 'FB_PAGE_ACCESS_TOKEN', 'FB_POST_SECRET'] as const;
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    return { ok: false as const, missing };
  }

  return {
    ok: true as const,
    config: {
      pageId: process.env.FB_PAGE_ID!,
      pageAccessToken: process.env.FB_PAGE_ACCESS_TOKEN!,
    },
  };
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ message: '未授權的發文請求。' }, { status: 401 });
  }

  let body: FacebookPostPayload;

  try {
    body = await request.json();
  } catch {
    return Response.json({ message: '發文格式錯誤，請重新送出。' }, { status: 400 });
  }

  const message = cleanText(body.message);
  const link = cleanText(body.link, 500);
  const published = parseBoolean(body.published);

  if (!message && !link) {
    return Response.json({ message: '請提供貼文內容或連結。' }, { status: 400 });
  }

  const facebook = requireFacebookEnv();

  if (!facebook.ok) {
    return Response.json({
      message: `Facebook 發文尚未設定完成，缺少環境變數：${facebook.missing.join(', ')}`,
    }, { status: 503 });
  }

  const postBody = new URLSearchParams({
    access_token: facebook.config.pageAccessToken,
    published: String(published),
  });

  if (message) postBody.set('message', message);
  if (link) postBody.set('link', link);

  const response = await fetch(`https://graph.facebook.com/${graphApiVersion}/${facebook.config.pageId}/feed`, {
    method: 'POST',
    body: postBody,
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error('[Facebook] Failed to publish post', {
      status: response.status,
      error: result?.error?.message || result,
    });

    return Response.json({
      message: result?.error?.message || 'Facebook 發文失敗。',
      code: result?.error?.code,
      type: result?.error?.type,
    }, { status: response.status });
  }

  return Response.json({
    ok: true,
    id: result.id,
    message: published ? '已發布到 Facebook。' : '已建立 Facebook 未發布貼文。',
  });
}
