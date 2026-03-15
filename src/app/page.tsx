'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const categories = ["最新消息", "潮永續", "永續列車", "聚焦誌", "人物專訪", "環境工程", "關於我們"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("最新消息");
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxjOdSz6LqxraxER6rLYjN31ElDtrGcPgxniiCgJrrq5sqUzItommSfSJiPr_T60hyW/exec';
    
    fetch(scriptUrl)
      .then(res => res.json())
      .then(data => {
        const rawData = Array.isArray(data) ? data : (data?.data || data?.news || []);
        setAllData(rawData);
        setLoading(false);
      })
      .catch(err => {
        console.error("抓取失敗:", err);
        setLoading(false);
      });
  }, []);

  const filteredData = allData.filter((item: any) => (item.category || item.分類) === activeCategory);

  return (
    <main className="relative min-h-screen bg-black text-white">
      {/* 🎬 背景影片 */}
      <div className="fixed inset-0 z-0">
        <video autoPlay muted loop playsInline className="h-full w-full object-cover opacity-30">
          <source src="/bg-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
      </div>

      <nav className="relative z-50 p-6 md:p-10">
        <Image src="/brand-logo.png" alt="Logo" width={150} height={50} className="h-10 w-auto object-contain" />
      </nav>

      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md py-4 border-b border-white/10">
        <div className="flex overflow-x-auto px-6 gap-3 no-scrollbar max-w-7xl mx-auto">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-none px-6 py-2 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "bg-white/10 text-gray-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <p className="text-center text-emerald-500 animate-pulse font-bold tracking-widest">正在啟動永續思維系統....</p>
        ) : (
          <>
            {/* 🛠️ 修正：關於我們專屬文字區塊（無連結） */}
            {activeCategory === "關於我們" ? (
              <div className="max-w-3xl mx-auto py-20 text-center animate-fade-in">
                <h2 className="text-3xl font-bold mb-8 text-emerald-500 tracking-widest">關於我們</h2>
                <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 backdrop-blur-sm">
                  <p className="text-gray-300 leading-relaxed text-lg text-left">
                    老闆，這裡是您的品牌故事空間。您可以直接在這裡輸入您想對觀眾說的話。<br /><br />
                    相信閱讀，「讓價值被看見」為核心，服務於上市公司以及中小企業主，透過看的閱讀、聽的閱讀將閱讀的力量發揮無限，公司旗下有發行紙本雜誌 《Focus聚焦誌》，並且有優質的podcast節目ESG探照燈。

《Focus聚焦誌》是國際化、永續化的時尚商業雜誌，發行於各大通路。以紙本媒體的傳統與創新，打造社會影響力，讓讀者/企業以更大的能量來面對ESG永續議題。並透過強化與讀者之間的互動，進而協助企業強化品牌形象，成為消費者抉擇時的重要關鍵。
                  </p>
                </div>
              </div>
            ) : (
              /* 其他分類顯示卡片 */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredData.length > 0 ? (
                  filteredData.map((item: any, i) => {
                    const imgId = item.imageUrl || item.封面圖片連結;
                    const finalImgUrl = imgId?.includes('http') ? imgId : `https://drive.google.com/thumbnail?id=${imgId}&sz=w800`;
                    return (
                      <div key={i} className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden hover:border-emerald-500/50 transition-all">
                        <div className="aspect-video bg-gray-800 relative">
                          <img src={finalImgUrl} alt="" className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-2">{item.title || item.標題}</h3>
                          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description || item.摘要}</p>
                          <a href={item.videoUrl || item.影片連結} target="_blank" className="text-emerald-400 font-bold hover:underline">立即觀看 →</a>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-20 opacity-50 italic">
                    No Content Available In "{activeCategory}"
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
      `}</style>
    </main>
  );
}