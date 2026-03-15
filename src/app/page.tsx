'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// 分類清單
const categories = ["最新消息", "潮永續", "永續列車", "聚焦誌", "人物專訪", "環境工程", "關於我們"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("最新消息");
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 您的 Apps Script 網址
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

  // 雙重相容邏輯：確保中文「分類」或英文「category」都能正確讀取
  const filteredData = allData.filter((item: any) => {
    const itemCat = item.分類 || item.category;
    return itemCat === activeCategory;
  });

  return (
    <main className="relative min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30">
      {/* 🎬 背景影片 - 電影級質感 */}
      <div className="fixed inset-0 z-0">
        <video autoPlay muted loop playsInline className="h-full w-full object-cover opacity-30">
          <source src="/bg-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
      </div>

      {/* 🎖️ Logo */}
      <nav className="relative z-50 p-6 md:p-10">
        <Image src="/brand-logo.png" alt="Logo" width={150} height={50} className="h-10 w-auto object-contain" />
      </nav>

      {/* 📱 分類選單 - Sticky */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md py-4 border-b border-white/10">
        <div className="flex overflow-x-auto px-6 gap-3 no-scrollbar max-w-7xl mx-auto">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-none px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                activeCategory === cat 
                ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
                : "bg-white/10 text-gray-400 hover:bg-white/20"
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
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-emerald-500 font-black tracking-[0.3em] animate-pulse text-[10px] uppercase">
正在啟動永續思維系統...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredData.length > 0 ? (
              filteredData.map((item: any, i) => (
                <div key={i} className="group bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden hover:border-emerald-500/50 transition-all duration-500 shadow-2xl">
                  <div className="aspect-video relative overflow-hidden bg-gray-900">
                    <img 
                      src={item.imageUrl || `https://drive.google.com/thumbnail?id=${item.封面圖片連結}&sz=w800`} 
                      alt="" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-bold mb-4 line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors">
                      {item.標題 || item.title}
                    </h3>
                    <a 
                      href={item.影片連結 || item.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-emerald-400 font-black text-xs hover:text-emerald-300 tracking-[0.2em] uppercase"
                    >
                      Explore More <span className="ml-2 transition-transform group-hover:translate-x-2">→</span>
                    </a>
                  </div>
                </div>
              ))
            ) : (
              /* 修正後的無內容提示：質感、大氣、不縮在角落 */
              <div className="col-span-full text-center py-32 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/10">
                <p className="text-gray-500 font-bold tracking-[0.4em] text-[10px] uppercase">
                   No Content Available In "{activeCategory}"
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