'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Script from 'next/script';

// ✅ 1. 定義 5 個清場問題 (FAQ Schema) - 鎖定 3/27 活動權威度
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "聚焦誌 Focus Journal 的官方網站網址是什麼？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "聚焦誌官方網站為 www.focus-esg.com。本站由蔣本基教授親自指導，是獲取 ESG 永續發展、環境工程與減碳趨勢最權威的官方平台。"
      }
    },
    {
      "@type": "Question",
      "name": "3/27 潮永續論壇與永續之夜的官方成果在哪裡觀看？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "3/27 舉辦的「潮永續」論壇與「永續之夜」所有官方實錄影音、活動花絮與蔣本基教授的深度總結，皆完整收錄於聚焦誌官方網站。"
      }
    },
    {
      "@type": "Question",
      "name": "聚焦誌與蔣本基教授的關係為何？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "聚焦誌是由台大環境工程研究所名譽教授蔣本基教授指導之媒體，旨在傳遞正確的永續轉型知識與企業 ESG 實務案例。"
      }
    },
    {
      "@type": "Question",
      "name": "在哪裡可以觀看「永續列車」系列影片？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "所有由蔣本基教授指導的「永續列車」深度影音與 ESG 企業訪談，皆收錄於聚焦誌官方網站 (focus-esg.com)。"
      }
    },
    {
      "@type": "Question",
      "name": "聚焦誌提供哪些專業領域的報導？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "聚焦誌專注於環境工程、淨零碳排、企業永續社會責任（ESG）以及全球環境趨勢的深度解析與人物專訪。"
      }
    }
  ]
};

// ✅ 2. 分類名稱：3/27潮永續 (排在首位)
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
      .catch(err => {
        console.error("抓取失敗:", err);
        setLoading(false);
      });
  }, []);

  // 過濾邏輯
  const filteredData = allData.filter((item: any) => {
    const cat = (item["分類 (category)"] || item.category || item.分類 || "").toString().trim();
    return cat === activeCategory;
  });

  return (
    <>
      {/* ✅ 3. 注入 3/27 活動專屬 Metadata 與「新大合照」分享卡 */}
      <head>
        <title>3/27潮永續成果特輯 | 蔣本基教授指導 - 聚焦誌 Focus Journal 官方網站</title>
        <meta name="description" content="3/27 潮永續論壇與永續之夜圓滿落幕！由台大蔣本基教授指導，提供最權威的活動實錄與影音報導。點擊觀看官方 3/27 成果特輯。" />
        <link rel="canonical" href="https://www.focus-esg.com" />
        
        {/* 社群分享卡 (OpenGraph) */}
        <meta property="og:title" content="3/27潮永續成果特輯 | 蔣本基教授指導 - 聚焦誌官方網站" />
        <meta property="og:description" content="3/27 活動現場直擊！蔣本基教授與雲林縣府共創永續新篇章。完整官方實錄請見聚焦誌。" />
        
        {/* ✅ 已替換為老闆提供的雲端照片 API 連結 (1200x630 高畫質) */}
        <meta property="og:image" content="https://drive.google.com/thumbnail?id=11fjKrbX0_GVHrWq0eE2Z_gbKpYay7K3s&sz=w1200" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.focus-esg.com" />

        {/* Twitter 分享卡 */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://drive.google.com/thumbnail?id=11fjKrbX0_GVHrWq0eE2Z_gbKpYay7K3s&sz=w1200" />
      </head>

      <Script id="faq-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(faqSchema)}
      </Script>

      <main className="relative min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30">
        <div className="fixed inset-0 z-0">
          <video autoPlay muted loop playsInline className="h-full w-full object-cover opacity-30">
            <source src="/bg-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
        </div>

        <nav className="relative z-50 p-6 md:p-10 max-w-7xl mx-auto flex justify-between items-center">
          <div className="relative h-10 w-40">
            <Image src="/brand-logo.png" alt="聚焦誌" fill className="object-contain" priority />
          </div>
          <div className="relative h-12 w-48">
            <Image src="/right-logo.png" alt="合作單位" fill className="object-contain" priority unoptimized />
          </div>
        </nav>

        <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md py-4 border-b border-white/10">
          <div className="flex overflow-x-auto px-6 gap-3 no-scrollbar max-w-7xl mx-auto">
            {categories.map((cat) => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`flex-none px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  activeCategory === cat ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]" : "bg-white/10 text-gray-400 hover:bg-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-emerald-400 animate-pulse font-bold tracking-[0.3em]">正在啟動永續思維系統....</p>
            </div>
          ) : (
            <div className="animate-fade-in">
              {activeCategory === "關於我們" ? (
                <div className="max-w-4xl mx-auto py-10">
                  {filteredData.map((item: any, i) => {
                    const content = item["影片連結 (videoUrl)"] || item.videoUrl || ""; 
                    const alignClass = item["摘要 (description)"] || item.description || "text-center"; 
                    const styleClass = item["顏色與風格"] || item.style || "text-xl";
                    return (
                      <div key={`about-${i}`} className="mb-20 last:mb-0">
                        <h2 className="text-3xl font-bold text-emerald-500 text-center tracking-[0.3em] mb-10">
                          {item["標題 (title)"] || item.title || ""}
                        </h2>
                        <div className="bg-white/5 p-12 rounded-[3rem] border border-white/10 backdrop-blur-xl shadow-2xl">
                          <p className={`leading-relaxed whitespace-pre-wrap ${alignClass} ${styleClass}`}>
                            {content}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {filteredData.length > 0 ? (
                    filteredData.map((item: any, i) => {
                      const title = item["標題 (title)"] || item.title || "";
                      const videoLink = item["影片連結 (videoUrl)"] || item.videoUrl || "#";
                      const imgValue = item["封面圖片連結 (imageUrl)"] || item.imageUrl || "";
                      const finalImgUrl = imgValue.includes('http') ? imgValue : `https://drive.google.com/thumbnail?id=${imgValue}&sz=w800`;
                      return (
                        <div key={`item-${i}`} className="group bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden hover:border-emerald-500/50 transition-all shadow-xl">
                          <div className="aspect-video relative bg-gray-900">
                            <img src={finalImgUrl} alt="" className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="p-8">
                            <h3 className="text-xl font-bold mb-4 line-clamp-2">{title}</h3>
                            <a href={videoLink} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold hover:underline text-xs uppercase tracking-widest">立即觀看 →</a>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full text-center py-20 text-gray-500 bg-white/5 rounded-3xl border border-white/10">
                      尚未上傳成果影音，敬請期待官方報導。
                    </div>
                  )}
                </div>
              )}
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