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
        console.error("抓取失敗:", err);
        setLoading(false);
      });
  }, []);

  const filteredData = allData.filter((item: any) => (item.category || item.分類) === activeCategory);

  return (
    <main className="relative min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30">
      {/* 🎬 背景影片 */}
      <div className="fixed inset-0 z-0">
        <video autoPlay muted loop playsInline className="h-full w-full object-cover opacity-30">
          <source src="/bg-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
      </div>

      {/* 🎖️ Logo */}
      <nav className="relative z-50 p-6 md:p-10 flex justify-center md:justify-start max-w-7xl mx-auto">
        <div className="relative h-10 w-40">
          <Image src="/brand-logo.png" alt="Logo" fill className="object-contain" priority />
        </div>
      </nav>

      {/* 📱 分類選單 */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md py-4 border-b border-white/10">
        <div className="flex overflow-x-auto px-6 gap-3 no-scrollbar max-w-7xl mx-auto">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-none px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                activeCategory === cat ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "bg-white/10 text-gray-400 hover:bg-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 📺 內容展示區 */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <p className="text-center text-emerald-400 animate-pulse font-bold tracking-widest py-20">正在啟動永續思維系統....</p>
        ) : (
          <div className="animate-fade-in">
            {activeCategory === "關於我們" ? (
              <div className="max-w-4xl mx-auto py-10">
                {filteredData.length > 0 ? (
                  filteredData.map((item: any, i) => {
                    // 🛠️ 核心修正：根據老闆的指示，內容改為讀取「封面圖片連結」欄位
                    const displayContent = item.封面圖片連結 || item.imageUrl || item.description || item.摘要;
                    const alignClass = item.videoUrl || item.影片連結 || 'text-center';
                    
                    return (
                      <div key={`about-${i}`} className="space-y-10">
                        <h2 className="text-3xl font-bold text-emerald-500 text-center tracking-[0.3em]">{item.title || item.標題}</h2>
                        <div className="bg-white/5 p-12 rounded-[3rem] border border-white/10 backdrop-blur-xl">
                          <p className={`leading-relaxed text-gray-200 whitespace-pre-wrap text-xl ${alignClass}`}>
                            {displayContent}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-20 opacity-50 italic">No Content Available</div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredData.map((item: any, i) => {
                  const imgId = item.imageUrl || item.封面圖片連結;
                  const finalImgUrl = imgId?.includes('http') ? imgId : `https://drive.google.com/thumbnail?id=${imgId}&sz=w800`;
                  return (
                    <div key={`item-${i}`} className="group bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden hover:border-emerald-500/50 transition-all shadow-xl">
                      <div className="aspect-video relative bg-gray-900">
                        <img src={finalImgUrl} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                      </div>
                      <div className="p-8">
                        <h3 className="text-xl font-bold mb-4 line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors">{item.title || item.標題}</h3>
                        <a href={item.videoUrl || item.影片連結} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold hover:underline tracking-widest text-xs uppercase">立即觀看 →</a>
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