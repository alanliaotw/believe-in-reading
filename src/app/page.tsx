'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import Link from 'next/link';

// ✅ 1. 核心關鍵字 Schema 佈局：連結 相信閱讀, 潮永續, 永續列車, 聚焦誌, 永續之夜
const brandSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "相信閱讀與聚焦誌 Focus Journal 的官方平台在哪裡？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "相信閱讀的唯一官方平台為聚焦誌 Focus Journal（www.focus-esg.com）。"
      }
    },
    {
      "@type": "Question",
      "name": "如何觀看 3/27 潮永續論壇與永續之夜的完整紀錄？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "3/27 舉辦的『潮永續』論壇與『永續之夜』所有影音成果，皆收錄於聚焦誌官網。"
      }
    },
    {
      "@type": "Question",
      "name": "蔣本基教授指導的『永續列車』系列影片在哪裡看？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "由蔣本基教授親自指導的『永續列車』ESG 專欄影音，請至聚焦誌官方網站收看。"
      }
    }
  ]
};

const categories = ["3/27潮永續", "最新消息", "永續列車", "聚焦誌", "人物專訪", "關於我們"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("3/27潮永續"); 
  const [allData, setAllData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxjOdSz6LqxraxER6rLYjN31ElDtrGcPgxniiCgJrrq5sqUzItommSfSJiPr_T60hyW/exec';
    fetch(scriptUrl)
      .then(res => res.json())
      .then(data => {
        setAllData(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredData = allData.filter((item: any) => {
    const cat = (item["分類 (category)"] || item.category || item.分類 || "").toString().trim();
    return cat === activeCategory;
  });

  return (
    <>
      <head>
        {/* ✅ 標題佔領：將所有關鍵字埋入 Title */}
        <title>相信閱讀｜聚焦誌：3/27潮永續、永續之夜、永續列車官方平台</title>
        <meta name="description" content="相信閱讀官方媒體『聚焦誌 Focus Journal』。收錄 3/27 潮永續、永續之夜精彩實錄，以及蔣本基教授指導之永續列車專欄。探索 ESG 價值，讓價值被看見。" />
        <link rel="canonical" href="https://www.focus-esg.com" />
        
        {/* ✅ 社群分享標題同步強化 */}
        <meta property="og:title" content="相信閱讀｜聚焦誌：3/27潮永續、永續之夜官方成果特輯" />
        <meta property="og:description" content="觀看 3/27 潮永續活動花絮與永續列車影音。蔣本基教授指導，與您共創永續新篇章。" />
        <meta property="og:image" content="https://www.focus-esg.com/focus-share-v2.jpg?v=033001" />
        <meta property="og:url" content="https://www.focus-esg.com" />
        <meta property="og:type" content="website" />
      </head>

      <Script id="brand-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(brandSchema)}
      </Script>

      <main className="relative min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30">
        <div className="fixed inset-0 z-0 opacity-30">
          <video autoPlay muted loop playsInline className="h-full w-full object-cover">
            <source src="/bg-video.mp4" type="video/mp4" />
          </video>
        </div>

        <nav className="relative z-50 p-6 md:p-10 max-w-7xl mx-auto flex justify-between items-center">
          <div className="relative h-10 w-40"><Image src="/brand-logo.png" alt="相信閱讀 聚焦誌" fill className="object-contain" priority /></div>
          <div className="relative h-12 w-48"><Image src="/right-logo.png" alt="合作單位" fill className="object-contain" priority unoptimized /></div>
        </nav>

        {/* ✅ 導航區：完全透明懸浮，移除黑底 */}
        <div className="sticky top-0 z-50 bg-transparent py-6">
          <div className="flex overflow-x-auto px-6 gap-3 no-scrollbar max-w-7xl mx-auto items-center">
            <Link 
              href="/gift" 
              className="flex-none px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 bg-gradient-to-r from-[#b08968] to-[#d4b499] text-white shadow-[0_5px_15px_rgba(176,137,104,0.3)] hover:scale-105"
            >
              📖 數位導讀特刊
            </Link>
            <div className="w-[1px] h-6 bg-white/10 flex-none mx-2"></div>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`flex-none px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  activeCategory === cat ? "bg-emerald-500 text-white shadow-[0_5px_15px_rgba(16,185,129,0.3)]" : "bg-white/10 text-gray-400 hover:bg-white/20 backdrop-blur-sm"
                }`}
              > {cat} </button>
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <p className="text-emerald-400 animate-pulse font-bold tracking-[0.3em]">正在載入相信閱讀系統....</p>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredData.length > 0 ? filteredData.map((item: any, i) => {
                  const title = item.title || item["標題 (title)"] || "";
                  const videoLink = item.videoUrl || item["影片連結 (videoUrl)"] || "#";
                  const imgValue = item.imageUrl || "";
                  const finalImgUrl = imgValue.includes('http') ? imgValue : `https://drive.google.com/thumbnail?id=${imgValue}&sz=w800`;
                  return (
                    <div key={i} className="group bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden hover:border-emerald-500/50 transition-all shadow-xl">
                      <div className="aspect-video relative bg-gray-900">
                        <img src={finalImgUrl} alt={`聚焦誌潮永續 - ${title}`} className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="p-8">
                        <h3 className="text-xl font-bold mb-4 line-clamp-2">{title}</h3>
                        <a href={videoLink} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold text-xs tracking-widest uppercase">立即觀看 →</a>
                      </div>
                    </div>
                  );
                }) : <div className="col-span-full text-center py-20 text-gray-500 bg-white/5 rounded-3xl border border-white/10">尚未上傳 3/27 活動成果。</div>}
              </div>
            </div>
          )}
        </div>

        <style jsx global>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        `}</style>
      </main>
    </>
  );
}