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
    <section className="py-16 bg-white flex flex-col items-center"> {/* 這裡確保容器是從上往下排 */}
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">最新消息</h2>
        
        {/* 分類切換按鈕 */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
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

        {/* 修正：將「查無內容」移出 Grid，改用單純的 div 控制位置 */}
        {filteredNews.length === 0 ? (
          <div className="w-full text-center mt-4 mb-20 text-gray-400 italic text-lg">
            分類「{activeCategory}」目前還沒有內容
          </div>
        ) : (
          /* 只有有內容時才渲染 Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {filteredNews.map((item: any, index: number) => (
              <div key={index} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col bg-white h-full">
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
            ))}
          </div>
        )}
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