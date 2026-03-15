'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const categories = ["最新消息", "潮永續", "永續列車", "聚焦誌", "人物專訪", "環境工程", "關於我們"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("最新消息");
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 這裡維持您最穩定的 Apps Script 網址
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxjOdSz6LqxraxER6rLYjN31ElDtrGcPgxniiCgJrrq5sqUzItommSfSJiPr_T60hyW/exec';
    
    fetch(scriptUrl)
      .then(res => res.json())
      .then(data => {
        // 確保 data 格式為陣列，不影響抓取
        setAllData(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("抓取失敗:", err);
        setLoading(false);
      });
  }, []);

  // 保持原始篩選邏輯
  const filteredData = allData.filter((item: any) => item.category === activeCategory);

  return (
    <main className="relative min-h-screen bg-black text-white font-sans">
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

      {/* 📱 分類選單 - Sticky */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md py-4 border-b border-white/10">
        <div className="flex overflow-x-auto px-6 gap-3 no-scrollbar max-w-7xl mx-auto">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-none px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                activeCategory === cat ? "bg-emerald-500 text-white" : "bg-white/10 text-gray-400 hover:bg-white/20"
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
          /* 修正 1：換成老闆指定的質感載入文字 */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-emerald-500 font-bold animate-pulse tracking-widest">正在啟動永續思維系統...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredData.length > 0 ? (
              filteredData.map((item: any, i) => {
                // 修正 2：確保 Drive 圖片能正確顯示的網址轉換邏輯
                const imgSource = item.imageUrl?.includes('http') 
                  ? item.imageUrl 
                  : `https://drive.google.com/thumbnail?id=${item.imageUrl}&sz=w800`;

                return (
                  <div key={i} className="group bg-white/5 rounded-3xl border border-white/10 overflow-hidden hover:border-emerald-500/50 transition-all shadow-2xl">
                    <div className="aspect-video relative bg-gray-800 overflow-hidden">
                      <img 
                        src={imgSource} 
                        alt="" 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">{item.title}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2 font-light">{item.description}</p>
                      <a 
                        href={item.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-emerald-400 font-bold hover:text-emerald-300 tracking-wider text-sm uppercase"
                      >
                        Explore More →
                      </a>
                    </div>
                  </div>
                );
              })
            ) : (
              /* 修正 3：大氣的無內容提示文字 */
              <div className="col-span-full text-center py-32 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
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