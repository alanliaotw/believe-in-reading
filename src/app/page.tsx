'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const categories = ["最新消息", "潮永續", "永續列車", "聚焦誌", "人物專訪", "環境工程", "關於我們"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("最新消息");
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
        console.error("資料抓取錯誤:", err);
        setLoading(false);
      });
  }, []);

  const filteredData = allData.filter((item: any) => (item["分類 (category)"] || item.category || item.分類) === activeCategory);

  return (
    <main className="relative min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30">
      {/* 背景影片 */}
      <div className="fixed inset-0 z-0">
        <video autoPlay muted loop playsInline className="h-full w-full object-cover opacity-30">
          <source src="/bg-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
      </div>

      {/* Logo */}
      <nav className="relative z-50 p-6 md:p-10 max-w-7xl mx-auto flex justify-center md:justify-start">
        <div className="relative h-10 w-40">
          <Image src="/brand-logo.png" alt="Logo" fill className="object-contain" priority />
        </div>
      </nav>

      {/* 分類選單 */}
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

      {/* 內容展示區 */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <p className="text-center text-emerald-400 animate-pulse font-bold tracking-[0.3em] py-20">正在啟動永續思維系統....</p>
        ) : (
          <div className="animate-fade-in">
            {activeCategory === "關於我們" ? (
              <div className="max-w-4xl mx-auto py-10">
                {filteredData.map((item: any, i) => {
                  // 根據後台 CSV 標題精準映射
                  const content = item["封面圖片連結 (imageUrl)"] || item.imageUrl || "";
                  const alignClass = item["影片連結 (videoUrl)"] || item.videoUrl || "text-center";
                  const sizeClass = item["摘要 (description)"] || item.description || "text-xl";
                  const styleClass = item["顏色與風格"] || "";

                  return (
                    <div key={`about-${i}`} className="mb-20">
                      <h2 className="text-3xl font-bold text-emerald-500 text-center tracking-[0.3em] mb-10">
                        {item["標題 (title)"] || item.title || item.標題}
                      </h2>
                      <div className="bg-white/5 p-12 rounded-[3rem] border border-white/10 backdrop-blur-xl shadow-2xl">
                        <p className={`leading-relaxed whitespace-pre-wrap ${alignClass} ${sizeClass} ${styleClass}`}>
                          {content}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredData.map((item: any, i) => {
                  const imgVal = item["封面圖片連結 (imageUrl)"] || item.imageUrl || "";
                  const finalImgUrl = imgVal.includes('http') ? imgVal : `https://drive.google.com/thumbnail?id=${imgVal}&sz=w800`;
                  const videoLink = item["影片連結 (videoUrl)"] || item.videoUrl || "#";
                  
                  return (
                    <div key={`item-${i}`} className="group bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden hover:border-emerald-500/50 transition-all shadow-xl">
                      <div className="aspect-video relative bg-gray-900">
                        <img src={finalImgUrl} alt="" className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="p-8">
                        <h3 className="text-xl font-bold mb-4 line-clamp-2">
                          {item["標題 (title)"] || item.title || item.標題}
                        </h3>
                        <a href={videoLink} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold hover:underline text-xs uppercase tracking-widest">立即觀看 →</a>
                      </div>
                    </div>
                  );
                })}
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
  );
}