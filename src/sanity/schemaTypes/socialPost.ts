import { defineArrayMember, defineField, defineType } from 'sanity'
import { SOCIAL_CONTENT_OWNERS, SOCIAL_PLATFORMS, SOCIAL_POST_STATUSES } from '@/lib/social'

const PLATFORM_TITLES: Record<(typeof SOCIAL_PLATFORMS)[number], string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
}

const STATUS_TITLES: Record<(typeof SOCIAL_POST_STATUSES)[number], string> = {
  draft: '待確認草稿',
  scheduled: '待發佈',
  paused: '已暫停',
  processing: '發佈中',
  published: '已完成',
  failed: '發佈失敗',
}

const OWNER_TITLES: Record<(typeof SOCIAL_CONTENT_OWNERS)[number], string> = {
  claude: 'Claude（週一／三／五／日）',
  codex: 'Codex（週二／四／六）',
  manual: '人工／其他',
}

export const socialPostType = defineType({
  name: 'socialPost',
  title: '社群排程貼文',
  type: 'document',
  groups: [
    { name: 'ledger', title: '主題台帳' },
    { name: 'content', title: '內容' },
    { name: 'publish', title: '排程' },
    { name: 'result', title: '結果' },
  ],
  fields: [
    defineField({
      name: 'topic',
      title: '主題',
      type: 'string',
      description: '用固定、簡短的名稱描述核心題材，例如「員工永續參與」。排新題前先查相同或近似主題。',
      validation: (Rule) => Rule.required().min(2).max(60),
      group: 'ledger',
    }),
    defineField({
      name: 'series',
      title: '系列',
      type: 'string',
      description: '較大的內容系列，例如「企業永續溝通」「永續閱讀」「永續生活」。',
      validation: (Rule) => Rule.max(60),
      group: 'ledger',
    }),
    defineField({
      name: 'contentAngle',
      title: '內容切角',
      type: 'text',
      rows: 3,
      description: '用一到兩句話說明這次怎麼切。同主題若切角相近，也視為重複。',
      validation: (Rule) => Rule.required().min(5).max(240),
      group: 'ledger',
    }),
    defineField({
      name: 'owner',
      title: '負責人／引擎',
      type: 'string',
      options: {
        list: SOCIAL_CONTENT_OWNERS.map((owner) => ({
          title: OWNER_TITLES[owner],
          value: owner,
        })),
        layout: 'radio',
      },
      initialValue: 'manual',
      validation: (Rule) => Rule.required(),
      group: 'ledger',
    }),
    defineField({
      name: 'title',
      title: '內部標題',
      type: 'string',
      description: '只給團隊內部辨識，例如：2026-07-08 早安貼文。',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'caption',
      title: '貼文文案',
      type: 'text',
      rows: 10,
      validation: (Rule) =>
        Rule.custom((caption, context) =>
          context.document?.status === 'draft' || (typeof caption === 'string' && caption.trim())
            ? true
            : '改成待發佈前，必須填寫貼文文案'
        ),
      group: 'content',
    }),
    defineField({
      name: 'imageUrl',
      title: '單張圖片連結（舊欄位）',
      type: 'url',
      description: '保留舊資料相容；新貼文請優先使用下方多圖欄位。',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
      hidden: ({ document }) => Array.isArray(document?.images) && document.images.length > 0,
      group: 'content',
    }),
    defineField({
      name: 'images',
      title: '圖片公開連結（依序）',
      type: 'array',
      of: [defineArrayMember({ type: 'url' })],
      description: 'Cloudinary 等公開圖片 URL；一張就是單圖，多張就是輪播，最多 10 張。',
      validation: (Rule) =>
        Rule.max(10).custom((urls, context) => {
          if (context.document?.status === 'draft') return true
          if (Array.isArray(urls) && urls.length > 0) return true
          if (typeof context.document?.imageUrl === 'string' && context.document.imageUrl) return true
          return '改成待發佈前，至少要放一張圖片連結'
        }),
      group: 'content',
    }),
    defineField({
      name: 'link',
      title: '延伸連結',
      type: 'url',
      description: 'Facebook 會直接附連結；Instagram 會附在文案末尾。',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
      group: 'content',
    }),
    defineField({
      name: 'platforms',
      title: '發佈平台',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: {
        list: SOCIAL_PLATFORMS.map((platform) => ({
          title: PLATFORM_TITLES[platform],
          value: platform,
        })),
        layout: 'grid',
      },
      validation: (Rule) => Rule.required().min(1),
      group: 'publish',
    }),
    defineField({
      name: 'scheduledAt',
      title: '預計發佈時間',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      group: 'publish',
    }),
    defineField({
      name: 'status',
      title: '狀態',
      type: 'string',
      options: {
        list: SOCIAL_POST_STATUSES.map((status) => ({
          title: STATUS_TITLES[status],
          value: status,
        })),
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
      group: 'publish',
    }),
    defineField({
      name: 'attempts',
      title: '嘗試次數',
      type: 'number',
      initialValue: 0,
      readOnly: true,
      group: 'result',
    }),
    defineField({
      name: 'lastAttemptedAt',
      title: '最後嘗試時間',
      type: 'datetime',
      readOnly: true,
      group: 'result',
    }),
    defineField({
      name: 'publishedAt',
      title: '完成發佈時間',
      type: 'datetime',
      readOnly: true,
      group: 'result',
    }),
    defineField({
      name: 'facebookPostId',
      title: 'Facebook 貼文 ID',
      type: 'string',
      readOnly: true,
      group: 'result',
    }),
    defineField({
      name: 'instagramCreationId',
      title: 'Instagram 建立容器 ID',
      type: 'string',
      readOnly: true,
      group: 'result',
    }),
    defineField({
      name: 'instagramMediaId',
      title: 'Instagram 貼文 ID',
      type: 'string',
      readOnly: true,
      group: 'result',
    }),
    defineField({
      name: 'instagramPermalink',
      title: 'Instagram 連結',
      type: 'url',
      readOnly: true,
      group: 'result',
    }),
    defineField({
      name: 'errorMessage',
      title: '錯誤訊息',
      type: 'text',
      rows: 6,
      readOnly: true,
      group: 'result',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'status',
      scheduledAt: 'scheduledAt',
      ledgerTopic: 'topic',
      owner: 'owner',
      images: 'images',
    },
    prepare({ title, subtitle, scheduledAt, ledgerTopic, owner, images }) {
      const scheduleLabel = scheduledAt
        ? new Date(scheduledAt).toLocaleString('zh-TW', { hour12: false })
        : '未排時間'
      const imageCount = Array.isArray(images) ? images.length : 0
      const imageLabel = imageCount > 1 ? `｜${imageCount} 張輪播` : ''
      const topicLabel = ledgerTopic ? `｜${ledgerTopic}` : ''
      const ownerLabel = owner ? `｜${OWNER_TITLES[owner as keyof typeof OWNER_TITLES] || owner}` : ''

      return {
        title,
        subtitle: `${STATUS_TITLES[(subtitle as keyof typeof STATUS_TITLES) || 'draft']}｜${scheduleLabel}${topicLabel}${ownerLabel}${imageLabel}`,
      }
    },
  },
  orderings: [
    {
      title: '排程時間（近→遠）',
      name: 'scheduledAtAsc',
      by: [{ field: 'scheduledAt', direction: 'asc' }],
    },
    {
      title: '排程時間（遠→近）',
      name: 'scheduledAtDesc',
      by: [{ field: 'scheduledAt', direction: 'desc' }],
    },
    {
      title: '最後嘗試時間（新→舊）',
      name: 'attemptedAtDesc',
      by: [{ field: 'lastAttemptedAt', direction: 'desc' }],
    },
  ],
})
