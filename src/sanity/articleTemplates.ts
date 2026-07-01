import type { Template } from 'sanity'

export const articleTemplateDefinitions: Template[] = [
  {
    id: 'article-base',
    title: '空白草稿',
    schemaType: 'article',
    value: {
      imageUrl: 'https://www.focus-esg.com/focus-share-v2.jpg',
      status: 'draft',
      featured: false,
    },
  },
  {
    id: 'article-chao-yong-xu',
    title: '潮永續草稿',
    schemaType: 'article',
    value: {
      category: '潮永續',
      imageUrl: 'https://www.focus-esg.com/focus-share-v2.jpg',
      status: 'draft',
      featured: false,
    },
  },
  {
    id: 'article-latest-news',
    title: '最新消息草稿',
    schemaType: 'article',
    value: {
      category: '最新消息',
      imageUrl: 'https://www.focus-esg.com/focus-share-v2.jpg',
      status: 'draft',
      featured: false,
    },
  },
  {
    id: 'article-sustainability-train',
    title: '永續列車草稿',
    schemaType: 'article',
    value: {
      category: '永續列車',
      imageUrl: 'https://www.focus-esg.com/focus-share-v2.jpg',
      status: 'draft',
      featured: false,
    },
  },
  {
    id: 'article-focus-mag',
    title: '聚焦誌草稿',
    schemaType: 'article',
    value: {
      category: '聚焦誌',
      imageUrl: 'https://www.focus-esg.com/focus-share-v2.jpg',
      status: 'draft',
      featured: false,
    },
  },
  {
    id: 'article-interview',
    title: '人物專訪草稿',
    schemaType: 'article',
    value: {
      category: '人物專訪',
      imageUrl: 'https://www.focus-esg.com/focus-share-v2.jpg',
      status: 'draft',
      featured: false,
    },
  },
  {
    id: 'article-about',
    title: '關於我們草稿',
    schemaType: 'article',
    value: {
      category: '關於我們',
      imageUrl: 'https://www.focus-esg.com/focus-share-v2.jpg',
      status: 'draft',
      featured: false,
    },
  },
] as const

export const articleTemplateIds = articleTemplateDefinitions.map((template) => template.id)
