import { defineField, defineType } from 'sanity'

const CATEGORIES = ['潮永續', '最新消息', '永續列車', '聚焦誌', '人物專訪', '關於我們']

export const articleType = defineType({
  name: 'article',
  title: '文章',
  type: 'document',
  groups: [
    { name: 'content', title: '內容' },
    { name: 'media', title: '視覺' },
    { name: 'publish', title: '發佈' },
  ],
  fields: [
    defineField({
      name: 'category',
      title: '分類',
      type: 'string',
      options: { list: CATEGORIES, layout: 'radio' },
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'title',
      title: '標題',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: '網址代號',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      description: '文章網址會使用這個代號；先填標題，再按 Generate 產生。',
      group: 'publish',
    }),
    defineField({
      name: 'description',
      title: '摘要',
      type: 'text',
      rows: 4,
      description: '顯示在卡片與分享時的短摘要，也可當作文章開頭。',
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: '正文',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: '內文', value: 'normal' },
            { title: '標題二', value: 'h2' },
            { title: '標題三', value: 'h3' },
            { title: '引用', value: 'blockquote' },
          ],
          lists: [
            { title: '項目符號', value: 'bullet' },
            { title: '編號', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: '粗體', value: 'strong' },
              { title: '斜體', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                title: '連結',
                type: 'object',
                fields: [
                  {
                    name: 'href',
                    title: '網址',
                    type: 'url',
                    validation: (Rule) =>
                      Rule.required().uri({ scheme: ['http', 'https'] }),
                  },
                ],
              },
            ],
          },
        },
      ],
      description: '正式文章內容，建議用來放完整內文、段落與重點整理。',
      group: 'content',
    }),
    defineField({
      name: 'imageUrl',
      title: '封面圖片連結',
      type: 'url',
      validation: (Rule) =>
        Rule.required().uri({ scheme: ['http', 'https'] }),
      group: 'media',
    }),
    defineField({
      name: 'videoUrl',
      title: '影片連結',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({ scheme: ['http', 'https'] }),
      group: 'media',
    }),
    defineField({
      name: 'colorStyle',
      title: '顏色樣式',
      type: 'string',
      description: '例如：emerald、blue、orange',
      group: 'media',
    }),
    defineField({
      name: 'publishedAt',
      title: '發布時間',
      type: 'datetime',
      description: '可手動調整排序用的發佈時間。',
      group: 'publish',
    }),
    defineField({
      name: 'featured',
      title: '首頁精選',
      type: 'boolean',
      description: '勾選後可用來標示優先內容。',
      initialValue: false,
      group: 'publish',
    }),
    defineField({
      name: 'status',
      title: '狀態',
      type: 'string',
      options: {
        list: [
          { title: '已發布', value: 'published' },
          { title: '草稿', value: 'draft' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
      group: 'publish',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
    },
  },
  orderings: [
    {
      title: '發布時間（新→舊）',
      name: 'publishedAtDesc',
      by: [
        { field: 'publishedAt', direction: 'desc' },
        { field: '_createdAt', direction: 'desc' },
      ],
    },
    {
      title: '建立時間（新→舊）',
      name: 'createdAtDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
})
