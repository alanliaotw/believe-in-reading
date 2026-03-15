'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// 1. 對齊您的分類名稱
const categories = ["全部", "潮永續", "永續列車", "聚焦誌", "人物專訪", "環境工程"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("全部");
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxjOdSz6LqxraxER6rLYjN31ElDtrGcPgxniiCgJrrq5sqUzItommSfSJiPr_T60hyW/exec';
    
    fetch(scriptUrl)
      .then(res => res.json())
      .then(data => {
        setAllData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("抓取失敗:", err);
        setLoading(false);
      });
  }, []);

  // 2. 修正篩選邏輯：對齊 Sheet 欄位名稱「分類」
  const filteredData = activeCategory === "全部" 
    ? allData 
    : allData.filter((item: any) => item.分類 === activeCategory);

  return (
    <main className="relative min-h-screen bg-black text-white font-sans">
      {/* 🎬 背景影片 */}
      <div className="fixed inset-0 z-0">
        <video autoPlay muted loop playsInline className="h-full w-full object-cover opacity-20">
          <source src="/bg-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black"></div>
      </div>

      {/* 🎖️ Logo */}
      <nav className="relative z-50 p-6 md:p-10">
        <Image src="/brand-logo.png" alt="Logo" width={150} height={50} className="h-10 w-auto object-contain" />
      </nav>

      {/* 📱 分類選單 - Sticky */}
      <div className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl py-6 border-b border-white/5">
        <div className="flex overflow-x-auto px-6 gap-4 no-scrollbar max-w-7xl mx-auto">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-none px-8 py-2.5 rounded-full text-sm font-black tracking-widest transition-all duration-300 ${
                activeCategory === cat 
                ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]" 
                : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 📺 內容展示區 */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-emerald-500 font-bold tracking-widest animate-pulse">正在從老闆的後台抓取資料...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredData.length > 0 ? (
              filteredData.map((item: any, i) => (
                <div key={i} className="group bg-white/5 rounded-3xl border border-white/10 overflow-hidden hover:border-emerald-500/50 transition-all duration-500 hover:transform hover:-translate-y-2 shadow-2xl">
                  {/* 3. 修正圖片連結：對齊「封面圖片連結」並加入 API */}
                  <div className="aspect-video relative overflow-hidden bg-gray-900">
                    <img 
                      src={`https://drive.google.com/thumbnail?id=${item.封面圖片連結}&sz=w800`} 
                      alt={item.標題} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-emerald-500 text-black text-[10px] font-black px-3 py-1 rounded uppercase tracking-tighter">
                        {item.分類}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    {/* 4. 修正標題：對齊「標題」 */}
                    <h3 className="text-xl font-bold mb-4 line-clamp-2 group-hover:text-emerald-400 transition-colors">{item.標題}</h3>
                    
                    {/* 5. 修正觀看連結：對齊「影片連結」 */}
                    <a 
                      href={item.影片連結} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-emerald-400 font-black text-sm hover:text-emerald-300 transition-all"
                    >
                      立即觀看 <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                    </a>
                  </div>
                </div>
              ))
            ) : (
              /* 提示位置修正：緊隨分類下方 */
              <div className="col-span-full text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                <p className="text-gray-500 italic text-lg tracking-widest">
                  分類「{activeCategory}」目前還沒有內容
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  );
}