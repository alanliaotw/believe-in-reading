'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const categories = ["最新消息", "潮永續", "永續列車", "聚焦誌", "人物專訪", "環境工程", "關於我們"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("最新消息");
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false); // 控制下拉選單開關

  useEffect(() => {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxjOdSz6LqxraxER6rLYjN31ElDtrGcPgxniiCgJrrq5sqUzItommSfSJiPr_T60hyW/exec';
    fetch(scriptUrl)
      .then(res => res.json())
      .then(data => {
        setAllData(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => { console.error("抓取失敗:", err); setLoading(false); });
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

      <nav className="relative z-50 p-6 md:p-10 flex justify-between items-center">
        <Image src="/brand-logo.png" alt="Logo" width={150} height={50} className="h-10 w-auto object-contain" />
        
        {/* 📱 下拉選單組件 */}
        <div className="relative">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 px-6 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-bold hover:bg-white/20 transition-all active:scale-95"
          >
            <span className="text-emerald-400">●</span> {activeCategory}
            <svg className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* 下拉列表清單 */}
          {isOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div> {/* 點擊背景關閉 */}
              <div className="absolute right-0 mt-3 w-48 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden z-50 shadow-2xl animate-fade-in">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-6 py-4 text-sm font-medium transition-colors hover:bg-emerald-500/20 ${
                      activeCategory === cat ? "text-emerald-400 bg-white/5" : "text-gray-400"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <p className="text-center text-emerald-400 animate-pulse font-bold tracking-widest py-20">正在啟動永續思維系統....</p>
        ) : (
          <>
            {activeCategory === "關於我們" ? (
              <div className="max-w-4xl mx-auto py-20 animate-fade-in">
                {filteredData.map((item: any, i) => (
                  <div key={i} className="space-y-10">
                    <h2 className="text-3xl font-bold text-emerald-500 text-center tracking-[0.3em]">{item.title || item.標題}</h2>
                    <div className="bg-white/5 p-12 rounded-[3rem] border border-white/10 backdrop-blur-xl">
                      <p className={`leading-relaxed text-gray-200 whitespace-pre-wrap ${item.videoUrl || 'text-center'} ${item.imageUrl || 'text-lg'}`}>
                        {item.description || item.摘要}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pt-10">
                {filteredData.map((item: any, i) => {
                  const imgId = item.imageUrl || item.封面圖片連結;
                  const finalImgUrl = imgId?.includes('http') ? imgId : `https://drive.google.com/thumbnail?id=${imgId}&sz=w800`;
                  return (
                    <div key={i} className="group bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden hover:border-emerald-500/50 transition-all shadow-xl">
                      <div className="aspect-video relative bg-gray-900">
                        <img src={finalImgUrl} alt="" className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="p-8">
                        <h3 className="text-xl font-bold mb-4 line-clamp-2">{item.title || item.標題}</h3>
                        <a href={item.videoUrl || item.影片連結} target="_blank" className="text-emerald-400 font-bold hover:underline">立即觀看 →</a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}</style>
    </main>
  );
}