'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// 強制定義：絕對不准出現環境工程
const categories = ["最新消息", "潮永續", "永續列車", "聚焦誌", "人物專訪", "關於我們"];

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
      .catch(err => { console.error("抓取失敗:", err); setLoading(false); });
  }, []);

  const filteredData = allData.filter((item: any) => {
    const cat = item["分類 (category)"] || item.category || item.分類;
    return cat === activeCategory;
  });

  return (
    <main className="relative min-h-screen bg-black text-white font-sans">
      <div className="fixed inset-0 z-0">
        <video autoPlay muted loop playsInline className="h-full w-full object-cover opacity-30">
          <source src="/bg-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
      </div>

      <nav className="relative z-50 p-10 max-w-7xl mx-auto">
        <div className="relative h-10 w-40">
          <Image src="/brand-logo.png" alt="Logo" fill className="object-contain" priority />
        </div>
      </nav>

      {/* ⚠️ 這裡我改用更嚴格的渲染方式 */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md py-4 border-b border-white/10">
        <div className="flex overflow-x-auto px-6 gap-3 no-scrollbar max-w-7xl mx-auto">
          {categories.filter(c => c !== "環境工程").map((cat) => (
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

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <p className="text-center text-emerald-400 py-20 animate-pulse">更新中...</p>
        ) : (
          <div className="animate-fade-in">
            {activeCategory === "關於我們" ? (
              <div className="max-w-4xl mx-auto py-10">
                {filteredData.map((item: any, i) => (
                  <div key={i} className="mb-20">
                    <h2 className="text-3xl font-bold text-emerald-500 text-center mb-10">{item["標題 (title)"] || item.title || ""}</h2>
                    <div className="bg-white/5 p-12 rounded-[3rem] border border-white/10 backdrop-blur-xl">
                      <p className={`leading-relaxed whitespace-pre-wrap ${item["摘要 (description)"] || item.description || "text-center"} ${item["顏色與風格"] || ""}`}>
                        {item["影片連結 (videoUrl)"] || item.videoUrl || ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredData.map((item: any, i) => {
                  const imgValue = item["封面圖片連結 (imageUrl)"] || item.imageUrl || "";
                  const finalImgUrl = imgValue.includes('http') ? imgValue : `https://drive.google.com/thumbnail?id=${imgValue}&sz=w800`;
                  return (
                    <div key={i} className="group bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden shadow-xl">
                      <div className="aspect-video relative bg-gray-900">
                        <img src={finalImgUrl} alt="" className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="p-8">
                        <h3 className="text-xl font-bold mb-4 line-clamp-2">{item["標題 (title)"] || item.title || ""}</h3>
                        <a href={item["影片連結 (videoUrl)"] || item.videoUrl || "#"} target="_blank" className="text-emerald-400 font-bold hover:underline text-xs uppercase tracking-widest">立即觀看 →</a>
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
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </main>
  );
}