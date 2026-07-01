import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticleBySlugOrId } from '@/lib/sanity'
import SanityPortableText from '@/components/SanityPortableText'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const article = await getArticleBySlugOrId(id)

  if (!article) {
    return {
      title: '找不到文章｜相信閱讀',
    }
  }

  return {
    title: `${article.title}｜相信閱讀`,
    description: article.description || '相信閱讀 ESG 永續議題深度內容',
    openGraph: {
      title: article.title,
      description: article.description || '相信閱讀 ESG 永續議題深度內容',
      type: 'article',
    },
  }
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const article = await getArticleBySlugOrId(id)

  if (!article) {
    notFound()
  }

  const publishDate = article.publishedAt || article._createdAt

  return (
    <main className="relative min-h-screen bg-black text-white font-sans">
      <div className="fixed inset-0 z-0 opacity-20">
        <video autoPlay muted loop playsInline className="h-full w-full object-cover">
          <source src="/bg-video.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-400 text-sm mb-10 hover:underline">
          ← 回首頁
        </Link>

        <article>
          <div className="flex items-center gap-3 text-xs text-emerald-400 uppercase tracking-widest font-bold mb-4">
            <span>{article.category}</span>
            <span className="text-white/40">·</span>
            <span>{formatDate(publishDate)}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">{article.title}</h1>

          {article.description && (
            <p className="text-lg leading-8 text-zinc-300 mb-10 border-l-2 border-emerald-500/60 pl-5">
              {article.description}
            </p>
          )}

          <div className="rounded-2xl overflow-hidden mb-10 aspect-video relative bg-gray-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.imageUrl || '/focus-share-v2.jpg'}
              alt={article.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="prose prose-invert max-w-none prose-p:leading-8 prose-li:leading-8">
            <SanityPortableText value={article.body} />
          </div>

          {article.videoUrl && (
            <div className="mt-10">
              <a
                href={article.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 rounded-full bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors"
              >
                立即觀看 →
              </a>
            </div>
          )}
        </article>
      </div>
    </main>
  )
}
