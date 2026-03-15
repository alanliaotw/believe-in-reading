'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const categories = ["最新消息", "潮永續", "永續列車", "聚焦誌", "人物專訪", "環境工程", "關於我們"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("最新消息");
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 這裡改用您剛才建立的 Apps Script 網址
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

  const filteredData = allData.filter((item: any) => item.category === activeCategory);

  return (
    <main className="relative min-h-screen bg-black text-white">
      {/* 🎬 背景影片 */}
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

      {/* 📱 分類選單 - 修正為 Sticky 確保滾動時可見 */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md py-4 border-b border-white/10">
        <div className="flex overflow-x-auto px-6 gap-3 no-scrollbar">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-none px-6 py-2 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat ? "bg-emerald-500 text-white" : "bg-white/10 text-gray-400"
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
          <p className="text-center text-emerald-500 animate-pulse">正在從老闆的後台抓取資料...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredData.length > 0 ? (
              filteredData.map((item: any, i) => (
                <div key={i} className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden hover:border-emerald-500/50 transition-all">
                  <div className="aspect-video bg-gray-800">
                    <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                    <a href={item.videoUrl} target="_blank" className="text-emerald-400 font-bold hover:underline">立即觀看 →</a>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 opacity-50 italic">
                分類「{activeCategory}」目前還沒有內容，快去 Google Sheet 增加資料吧！
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