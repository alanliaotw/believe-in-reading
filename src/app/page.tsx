"use client";
import React, { useState } from 'react';

const NewsSection = ({ newsData }: { newsData: any }) => {
  const dataList = Array.isArray(newsData) ? newsData : (newsData?.news || []);
  const [activeCategory, setActiveCategory] = useState('全部');
  const categories = ['全部', '永續列車', '潮永續', '人物專訪'];

  const filteredNews = activeCategory === '全部' 
    ? dataList 
    : dataList.filter((item: any) => item.分類 === activeCategory);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">最新消息</h2>
        
        {/* 分類切換按鈕 */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full transition font-medium ${
                activeCategory === cat 
                ? 'bg-green-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 內容顯示區 - 保持原本的 Grid 結構 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.length > 0 ? (
            filteredNews.map((item: any, index: number) => (
              <div key={index} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col bg-white h-full">
                <div className="relative h-48 w-full">
                  <img 
                    src={`https://drive.google.com/thumbnail?id=${item.封面圖片連結}&sz=w800`} 
                    alt={item.標題} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <span className="text-xs text-green-600 font-bold tracking-wider">{item.分類}</span>
                  <h3 className="text-xl font-bold mt-2 mb-4 text-gray-900 line-clamp-2 leading-snug">
                    {item.標題}
                  </h3>
                  <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-gray-400 text-xs">2026-03-15</span>
                    <a 
                      href={item.影片連結} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                    >
                      閱讀更多 →
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* 恢復原來的大氣提示：維持 col-span-full，僅微調 py 避免死死置中 */
            <div className="col-span-full text-center py-12 opacity-50 italic text-lg">
              分類「{activeCategory}」目前還沒有內容
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default function Home({ data }: { data: any }) {
  return (
    <main>
      <NewsSection newsData={data} />
    </main>
  );
}
