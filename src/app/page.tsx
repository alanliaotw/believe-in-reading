'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import Link from 'next/link';

// ✅ SEO 核心：已移除 3/27，聚焦「潮永續」品牌
const seoSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "相信閱讀｜聚焦誌 Focus Journal",
  "alternateName": ["潮永續", "永續之夜", "永續列車", "蔣本基教授"],
  "url": "https://www.focus-esg.com"
};

// ✅ 已將「3/27潮永續」改回「潮永續」
const categories = ["潮永續", "最新消息", "永續列車", "聚焦誌", "人物專訪", "關於我們"];

export default function Home() {
  // ✅ 預設分類同步改為「潮永續」
  const [activeCategory, setActiveCategory] = useState("潮永續"); 
  const [allData, setAllData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxjOdSz6LqxraxER6rLYjN31ElDtrGcPgxniiCgJrrq5sqUzItommSfSJiPr_T60hyW/exec';
    fetch(scriptUrl).then(res => res.json()).then(data => {
      setAllData(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filteredData = allData.filter((item: any) => {
    const cat = (item["分類 (category)"] || item.category || item.分類 || "").toString().trim();
    const title = (item.title || item["標題 (title)"] || "").toString().trim();
    const imageUrl = (item.imageUrl || item["封面圖片連結"] || "").toString().trim();
    if (!title) return false;
    if (!imageUrl || !imageUrl.includes('http')) return false;
    return cat === activeCategory || (activeCategory === "潮永續" && cat === "3/27潮永續");
  });

  return (
    <>
      <head>
        {/* ✅ SEO 標題同步去日期化 */}
        <title>相信閱讀｜聚焦誌：潮永續、永續之夜、永續列車官方網站</title>
        <meta name="description" content="相信閱讀官方媒體『聚焦誌 Focus Journal』。收錄蔣本基教授指導之潮永續成果、永續之夜實錄，以及永續列車專欄。最權威的 ESG 永續資訊平台。" />
        <meta name="keywords" content="相信閱讀, 潮永續, 永續列車, 聚焦誌, 永續之夜, 蔣本基, ESG, 減碳" />
        <link rel="canonical" href="https://www.focus-esg.com" />
        <meta property="og:title" content="相信閱讀｜聚焦誌：潮永續官方特輯" />
        <meta property="og:image" content="https://www.focus-esg.com/focus-share-v2.jpg?v=0410" />
      </head>

      <Script id="seo-schema" type="application/ld+json" strategy="afterInteractive">{JSON.stringify(seoSchema)}</Script>

      <main className="relative min-h-screen bg-black text-white font-sans">
        <div className="fixed inset-0 z-0 opacity-30">
          <video autoPlay muted loop playsInline className="h-full w-full object-cover">
            <source src="/bg-video.mp4" type="video/mp4" />
          </video>
        </div>

        <nav className="relative z-50 p-6 md:p-10 max-w-7xl mx-auto flex justify-between items-center">
          <div className="relative h-10 w-40"><Image src="/brand-logo.png" alt="相信閱讀 聚焦誌" fill className="object-contain" priority /></div>
          <div className="relative h-12 w-48"><Image src="/right-logo.png" alt="合作單位" fill className="object-contain" priority unoptimized /></div>
        </nav>

        {/* 透明導航列 */}
        <div className="sticky top-0 z-50 bg-transparent py-6">
          <div className="flex overflow-x-auto px-6 gap-3 no-scrollbar max-w-7xl mx-auto items-center">
            <Link href="/gift" className="flex-none px-6 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-[#b08968] to-[#d4b499] text-white shadow-lg hover:scale-105">
              📖 永續實驗
            </Link>
            <div className="w-[1px] h-6 bg-white/10 flex-none mx-2"></div>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`flex-none px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat ? "bg-emerald-500 text-white shadow-lg" : "bg-white/10 text-gray-400 backdrop-blur-sm"
                }`}
              > {cat} </button>
            ))}
          </div>
        </div>

        {/* 內容區 */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
          {loading ? ( <p className="text-emerald-400 animate-pulse text-center py-20">正在啟動相信閱讀系統....</p> ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredData.length > 0 ? filteredData.map((item: any, i) => (
                <div key={i} className="group bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden hover:border-emerald-500/50 transition-all">
                  <div className="aspect-video relative bg-gray-900">
                    <img src={item.imageUrl || item["封面圖片連結"]} alt={`相信閱讀潮永續 - ${item.title}`} className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-bold mb-4 line-clamp-2">{item.title || item["標題 (title)"]}</h3>
                    {(() => { const desc = (item.description || item["摘要"] || "").toString().trim(); return desc && !desc.startsWith('http') ? <p className="text-gray-400 text-sm mb-4 line-clamp-3">{desc}</p> : null; })()}
                    <a href={item.videoUrl || item["影片連結 (videoUrl)"]} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold uppercase tracking-widest text-xs">立即觀看 →</a>
                  </div>
                </div>
              )) : (
                <p className="col-span-full text-center py-20 text-gray-500">此分類暫無報導內容</p>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}