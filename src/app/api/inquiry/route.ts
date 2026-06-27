import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

type InquiryPayload = {
  organization?: string;
  name?: string;
  role?: string;
  email?: string;
  phone?: string;
  service?: string;
  timeline?: string;
  budget?: string;
  message?: string;
  website?: string;
};

const inquiryRecipient = process.env.INQUIRY_TO_EMAIL || 'service@reading.com.tw';

function cleanText(value: unknown, maxLength = 1200) {
  if (typeof value !== 'string') return '';
  return value.replace(/\r/g, '').trim().slice(0, maxLength);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function requireSmtpEnv() {
  const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM_EMAIL'] as const;
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    return { ok: false as const, missing };
  }

  return {
    ok: true as const,
    config: {
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT),
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
      from: process.env.SMTP_FROM_EMAIL!,
      secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
    },
  };
}

function buildPlainText(payload: Required<Omit<InquiryPayload, 'website'>>) {
  return [
    '收到一筆相信閱讀官網合作洽詢：',
    '',
    `公司 / 單位：${payload.organization || '未填'}`,
    `聯絡人：${payload.name}`,
    `職稱 / 部門：${payload.role || '未填'}`,
    `Email：${payload.email}`,
    `電話 / LINE：${payload.phone || '未填'}`,
    `合作項目：${payload.service || '未填'}`,
    `預計時程：${payload.timeline || '未填'}`,
    `預算範圍：${payload.budget || '未填'}`,
    '',
    '需求說明：',
    payload.message,
    '',
    '---',
    '來源：focus-esg.com 合作洽詢表單',
  ].join('\n');
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildHtml(payload: Required<Omit<InquiryPayload, 'website'>>) {
  const rows = [
    ['公司 / 單位', payload.organization || '未填'],
    ['聯絡人', payload.name],
    ['職稱 / 部門', payload.role || '未填'],
    ['Email', payload.email],
    ['電話 / LINE', payload.phone || '未填'],
    ['合作項目', payload.service || '未填'],
    ['預計時程', payload.timeline || '未填'],
    ['預算範圍', payload.budget || '未填'],
  ];

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111827; line-height: 1.7;">
      <h2 style="margin: 0 0 16px;">收到一筆相信閱讀官網合作洽詢</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 720px;">
        <tbody>
          ${rows.map(([label, value]) => `
            <tr>
              <th style="width: 140px; text-align: left; vertical-align: top; padding: 10px; border: 1px solid #e5e7eb; background: #f9fafb;">${escapeHtml(label)}</th>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${escapeHtml(value)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <h3 style="margin: 24px 0 8px;">需求說明</h3>
      <div style="white-space: pre-wrap; padding: 14px; border: 1px solid #e5e7eb; background: #f9fafb; max-width: 720px;">${escapeHtml(payload.message)}</div>
      <p style="margin-top: 24px; color: #6b7280; font-size: 13px;">來源：focus-esg.com 合作洽詢表單</p>
    </div>
  `;
}

export async function POST(request: Request) {
  let body: InquiryPayload;

  try {
    body = await request.json();
  } catch {
    return Response.json({ message: '表單格式錯誤，請重新送出。' }, { status: 400 });
  }

  if (cleanText(body.website, 200)) {
    return Response.json({ ok: true });
  }

  const payload = {
    organization: cleanText(body.organization, 120),
    name: cleanText(body.name, 80),
    role: cleanText(body.role, 120),
    email: cleanText(body.email, 160),
    phone: cleanText(body.phone, 80),
    service: cleanText(body.service, 120),
    timeline: cleanText(body.timeline, 80),
    budget: cleanText(body.budget, 120),
    message: cleanText(body.message, 1600),
  };

  if (!payload.name || !payload.email || !payload.message) {
    return Response.json({ message: '請填寫聯絡人、Email 和需求說明。' }, { status: 400 });
  }

  if (!isValidEmail(payload.email)) {
    return Response.json({ message: 'Email 格式看起來不正確。' }, { status: 400 });
  }

  const smtp = requireSmtpEnv();

  if (!smtp.ok) {
    return Response.json({
      message: `後臺寄信尚未設定完成，缺少環境變數：${smtp.missing.join(', ')}`,
    }, { status: 503 });
  }

  const transporter = nodemailer.createTransport({
    host: smtp.config.host,
    port: smtp.config.port,
    secure: smtp.config.secure,
    auth: {
      user: smtp.config.user,
      pass: smtp.config.pass,
    },
  });

  try {
    await transporter.sendMail({
      from: smtp.config.from,
      to: inquiryRecipient,
      replyTo: payload.email,
      subject: `合作洽詢｜${payload.organization || payload.name}`,
      text: buildPlainText(payload),
      html: buildHtml(payload),
    });

    return Response.json({ ok: true, message: '已送出，我們會盡快與你聯繫。' });
  } catch (error) {
    console.error('[Inquiry] Failed to send email', error);
    return Response.json({ message: '後臺寄信失敗，請稍後再試或直接寄信給我們。' }, { status: 500 });
  }
}
