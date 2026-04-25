import { defineField, defineType } from 'sanity'

const CATEGORIES = ['潮永續', '最新消息', '永續列車', '聚焦誌', '人物專訪', '關於我們']

export const articleType = defineType({
  name: 'article',
  title: '文章',
  type: 'document',
  fields: [
    defineField({
      name: 'category',
      title: '分類',
      type: 'string',
      options: { list: CATEGORIES, layout: 'radio' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: '標題',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: '摘要',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'imageUrl',
      title: '封面圖片連結',
      type: 'url',
      validation: (Rule) =>
        Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'videoUrl',
      title: '影片連結',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'colorStyle',
      title: '顏色樣式',
      type: 'string',
      description: '例如：emerald、blue、orange',
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
      initialValue: 'published',
      validation: (Rule) => Rule.required(),
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
      title: '建立時間（新→舊）',
      name: 'createdAtDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
})
