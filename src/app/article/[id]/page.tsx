'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { sanityClient, type Article } from '@/lib/sanity';

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sanityClient.fetch<Article>(
      `*[_type == "article" && _id == $id][0]`,
      { id }
    )
      .then(data => setArticle(data))
      .catch(err => console.error('[Sanity] 查詢失敗:', err))
      .finally(() => setLoading(false));
  }, [id]);

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

        {loading ? (
          <p className="text-emerald-400 animate-pulse text-center py-20">載入中...</p>
        ) : !article ? (
          <p className="text-center py-20 text-gray-500">找不到文章</p>
        ) : (
          <article>
            <div className="mb-6">
              <span className="text-xs text-emerald-400 uppercase tracking-widest font-bold">{article.category}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">{article.title}</h1>

            {article.imageUrl && (
              <div className="rounded-2xl overflow-hidden mb-10 aspect-video relative bg-gray-900">
                <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            )}

            {article.description && (
              <div className="text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                {article.description}
              </div>
            )}

            {article.videoUrl && (
              <div className="mt-10">
                <a href={article.videoUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-block px-8 py-3 rounded-full bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors">
                  立即觀看 →
                </a>
              </div>
            )}
          </article>
        )}
      </div>
    </main>
  );
}
