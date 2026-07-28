import type { StructureResolver } from 'sanity/structure'
import { articleTemplateIds } from './articleTemplates'
import { socialPostTemplateIds } from './socialPostTemplates'

// Sanity v5 起，list / listItem / documentList 都必須有明確的 id（v4 以前只是建議）。
// id 只能是 URL-safe 字串，所以中文分類另外配一組英文 id。
const CATEGORIES: { id: string; title: string }[] = [
  { id: 'trend-sustainability', title: '潮永續' },
  { id: 'news', title: '最新消息' },
  { id: 'sustainability-train', title: '永續列車' },
  { id: 'focus-journal', title: '聚焦誌' },
  { id: 'interview', title: '人物專訪' },
  { id: 'about-us', title: '關於我們' },
]

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .id('content-desk')
    .title('內容工作台')
    .items([
      S.listItem()
        .id('all-articles')
        .title('全部文章')
        .child(
          S.documentTypeList('article')
            .id('all-articles-list')
            .title('全部文章')
            .initialValueTemplates(articleTemplateIds.map((templateId) => S.initialValueTemplateItem(templateId)))
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
        ),
      S.listItem()
        .id('draft-articles')
        .title('草稿')
        .child(
          S.documentList()
            .id('draft-articles-list')
            .title('草稿')
            .schemaType('article')
            .filter('_type == "article" && status == "draft"')
            .initialValueTemplates([])
            .defaultOrdering([{ field: '_createdAt', direction: 'desc' }]),
        ),
      S.listItem()
        .id('published-articles')
        .title('已發布')
        .child(
          S.documentList()
            .id('published-articles-list')
            .title('已發布')
            .schemaType('article')
            .filter('_type == "article" && status == "published"')
            .initialValueTemplates([])
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
        ),
      S.divider(),
      ...CATEGORIES.map(({ id, title }) =>
        S.listItem()
          .id(`category-${id}`)
          .title(title)
          .child(
            S.documentList()
              .id(`category-${id}-list`)
              .title(title)
              .schemaType('article')
              .filter('_type == "article" && category == $category')
              .params({ category: title })
              .initialValueTemplates([])
              .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
          ),
      ),
      S.divider(),
      S.listItem()
        .id('all-social-posts')
        .title('全部社群排程')
        .child(
          S.documentTypeList('socialPost')
            .id('all-social-posts-list')
            .title('全部社群排程')
            .initialValueTemplates(
              socialPostTemplateIds.map((templateId) => S.initialValueTemplateItem(templateId))
            )
            .defaultOrdering([{ field: 'scheduledAt', direction: 'asc' }]),
        ),
      S.listItem()
        .id('social-scheduled')
        .title('待發佈社群貼文')
        .child(
          S.documentList()
            .id('social-scheduled-list')
            .title('待發佈社群貼文')
            .schemaType('socialPost')
            .filter('_type == "socialPost" && status == "scheduled"')
            .initialValueTemplates([])
            .defaultOrdering([{ field: 'scheduledAt', direction: 'asc' }]),
        ),
      S.listItem()
        .id('social-draft')
        .title('待確認社群草稿')
        .child(
          S.documentList()
            .id('social-draft-list')
            .title('待確認社群草稿')
            .schemaType('socialPost')
            .filter('_type == "socialPost" && status == "draft"')
            .initialValueTemplates([])
            .defaultOrdering([{ field: '_updatedAt', direction: 'desc' }]),
        ),
      S.listItem()
        .id('social-failed')
        .title('發佈失敗')
        .child(
          S.documentList()
            .id('social-failed-list')
            .title('發佈失敗')
            .schemaType('socialPost')
            .filter('_type == "socialPost" && status == "failed"')
            .initialValueTemplates([])
            .defaultOrdering([{ field: 'lastAttemptedAt', direction: 'desc' }]),
        ),
      S.listItem()
        .id('social-published')
        .title('已完成社群貼文')
        .child(
          S.documentList()
            .id('social-published-list')
            .title('已完成社群貼文')
            .schemaType('socialPost')
            .filter('_type == "socialPost" && status == "published"')
            .initialValueTemplates([])
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
        ),
      S.listItem()
        .id('social-paused')
        .title('已暫停社群貼文')
        .child(
          S.documentList()
            .id('social-paused-list')
            .title('已暫停社群貼文')
            .schemaType('socialPost')
            .filter('_type == "socialPost" && status == "paused"')
            .initialValueTemplates([])
            .defaultOrdering([{ field: 'scheduledAt', direction: 'asc' }]),
        ),
    ])
