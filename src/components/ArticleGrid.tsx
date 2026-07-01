'use client';

import { useState } from 'react';
import Link from 'next/link';
import { type Article } from '@/lib/sanity';
import { getArticleCoverImage } from '@/lib/articleCovers';

const categories = ["潮永續", "最新消息", "永續列車", "聚焦誌", "人物專訪", "關於我們"];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
}

function readingTime(text?: string) {
  if (!text) return '1 分鐘';
  const words = text.length;
  const mins = Math.max(1, Math.round(words / 300));
  return `${mins} 分鐘`;
}

export default function ArticleGrid({ articles }: { articles: Article[] }) {
  const [activeCategory, setActiveCategory] = useState(articles[0]?.category ?? "潮永續");

  const filteredData = articles.filter(item =>
    item.title && item.category.trim() === activeCategory
  );

  return (
    <>
      <div className="sticky top-0 z-50 bg-black/60 backdrop-blur-md py-4 border-b border-white/5">
        <div className="flex overflow-x-auto px-6 gap-3 no-scrollbar max-w-7xl mx-auto items-center">
          <Link href="/gift" className="flex-none px-5 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-[#b08968] to-[#d4b499] text-white shadow-lg hover:scale-105 transition-transform">
            📖 永續實驗
          </Link>
          <a href="#cooperate" className="flex-none px-5 py-2 rounded-full bg-white text-sm font-bold text-black shadow-lg transition-colors hover:bg-emerald-50">
            合作洽詢
          </a>
          <div className="w-[1px] h-6 bg-white/10 flex-none mx-1" />
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`flex-none px-5 py-2 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-emerald-500 text-white shadow-lg scale-105'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredData.length > 0 ? filteredData.map((item) => (
            <Link key={item._id} href={`/article/${item.slug?.current || item._id}`}
              className="group bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:border-emerald-500/50 hover:bg-white/8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/20 block">
              <div className="aspect-video relative bg-gray-900 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getArticleCoverImage(item.slug?.current, item.imageUrl || '/focus-share-v2.jpg')}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-xs text-emerald-400 font-bold">
                  {item.category}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <span>{formatDate(item.publishedAt || item._createdAt)}</span>
                  <span>·</span>
                  <span>閱讀約 {readingTime(item.description)}</span>
                </div>
                <h3 className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-emerald-400 transition-colors leading-snug">
                  {item.title}
                </h3>
                {item.description && !item.description.startsWith('http') && (
                  <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{item.description}</p>
                )}
                <div className="mt-4 flex items-center gap-1 text-emerald-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  閱讀全文 <span>→</span>
                </div>
              </div>
            </Link>
          )) : (
            <p className="col-span-full text-center py-20 text-gray-500">此分類暫無報導內容</p>
          )}
        </div>
      </div>
    </>
  );
}
