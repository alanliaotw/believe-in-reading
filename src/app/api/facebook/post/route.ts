export const runtime = 'nodejs';

import { publishFacebookPost } from '@/lib/socialPublishing';

type FacebookPostPayload = {
  message?: string;
  link?: string;
  imageUrl?: string;
  published?: boolean;
};

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
    config: true,
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
  const imageUrl = cleanText(body.imageUrl, 1000);
  const published = parseBoolean(body.published);

  if (!message && !link && !imageUrl) {
    return Response.json({ message: '請提供貼文內容、連結或圖片。' }, { status: 400 });
  }

  const facebook = requireFacebookEnv();

  if (!facebook.ok) {
    return Response.json({
      message: `Facebook 發文尚未設定完成，缺少環境變數：${facebook.missing.join(', ')}`,
    }, { status: 503 });
  }

  try {
    const result = await publishFacebookPost({
      message,
      link,
      imageUrl,
      published,
    });

    return Response.json({
      ok: true,
      id: result.id,
      message: published ? '已發布到 Facebook。' : '已建立 Facebook 未發布貼文。',
    });
  } catch (error) {
    console.error('[Facebook] Failed to publish post', error);

    return Response.json({
      message: error instanceof Error ? error.message : 'Facebook 發文失敗。',
    }, { status: 500 });
  }
}
