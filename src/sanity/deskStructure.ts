import type { StructureResolver } from 'sanity/structure'
import { articleTemplateIds } from './articleTemplates'
import { socialPostTemplateIds } from './socialPostTemplates'

const CATEGORIES = ['潮永續', '最新消息', '永續列車', '聚焦誌', '人物專訪', '關於我們']

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title('內容工作台')
    .items([
      S.listItem()
        .title('全部文章')
        .child(
          S.documentTypeList('article')
            .title('全部文章')
            .initialValueTemplates(articleTemplateIds.map((templateId) => S.initialValueTemplateItem(templateId)))
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
        ),
      S.listItem()
        .title('草稿')
        .child(
          S.documentList()
            .title('草稿')
            .schemaType('article')
            .filter('_type == "article" && status == "draft"')
            .initialValueTemplates([])
            .defaultOrdering([{ field: '_createdAt', direction: 'desc' }]),
        ),
      S.listItem()
        .title('已發布')
        .child(
          S.documentList()
            .title('已發布')
            .schemaType('article')
            .filter('_type == "article" && status == "published"')
            .initialValueTemplates([])
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
        ),
      S.divider(),
      ...CATEGORIES.map((category) =>
        S.listItem()
          .title(category)
          .child(
            S.documentList()
              .title(category)
              .schemaType('article')
              .filter('_type == "article" && category == $category')
              .params({ category })
              .initialValueTemplates([])
              .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
          ),
      ),
      S.divider(),
      S.listItem()
        .title('全部社群排程')
        .child(
          S.documentTypeList('socialPost')
            .title('全部社群排程')
            .initialValueTemplates(
              socialPostTemplateIds.map((templateId) => S.initialValueTemplateItem(templateId))
            )
            .defaultOrdering([{ field: 'scheduledAt', direction: 'asc' }]),
        ),
      S.listItem()
        .title('待發佈社群貼文')
        .child(
          S.documentList()
            .title('待發佈社群貼文')
            .schemaType('socialPost')
            .filter('_type == "socialPost" && status == "scheduled"')
            .initialValueTemplates([])
            .defaultOrdering([{ field: 'scheduledAt', direction: 'asc' }]),
        ),
      S.listItem()
        .title('待確認社群草稿')
        .child(
          S.documentList()
            .title('待確認社群草稿')
            .schemaType('socialPost')
            .filter('_type == "socialPost" && status == "draft"')
            .initialValueTemplates([])
            .defaultOrdering([{ field: '_updatedAt', direction: 'desc' }]),
        ),
      S.listItem()
        .title('發佈失敗')
        .child(
          S.documentList()
            .title('發佈失敗')
            .schemaType('socialPost')
            .filter('_type == "socialPost" && status == "failed"')
            .initialValueTemplates([])
            .defaultOrdering([{ field: 'lastAttemptedAt', direction: 'desc' }]),
        ),
      S.listItem()
        .title('已完成社群貼文')
        .child(
          S.documentList()
            .title('已完成社群貼文')
            .schemaType('socialPost')
            .filter('_type == "socialPost" && status == "published"')
            .initialValueTemplates([])
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
        ),
      S.listItem()
        .title('已暫停社群貼文')
        .child(
          S.documentList()
            .title('已暫停社群貼文')
            .schemaType('socialPost')
            .filter('_type == "socialPost" && status == "paused"')
            .initialValueTemplates([])
            .defaultOrdering([{ field: 'scheduledAt', direction: 'asc' }]),
        ),
    ])
