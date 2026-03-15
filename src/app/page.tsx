"use client";
import React, { useState } from 'react';

// 修正：確保組件名稱與定義一致，並對齊 Sheet 欄位
const NewsSection = ({ newsData }: { newsData: any }) => {
  // 防呆：確保 newsData 是陣列，如果不是則抓取 sub-property
  const dataList = Array.isArray(newsData) ? newsData : (newsData?.news || []);
  
  const [activeCategory, setActiveCategory] = useState('全部');
  const categories = ['全部', '永續列車', '潮永續', '人物專訪'];

  // 修正 1: 對齊 Sheet 的「分類」
  const filteredNews = activeCategory === '全部' 
    ? dataList 
    : dataList.filter((item: any) => item.分類 === activeCategory);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">最新消息</h2>
        
        {/* 分類按鈕 */}
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

        {/* 修正位置：不再置中 */}
        {filteredNews.length === 0 && (
          <div className="w-full text-center py-10 text-gray-400 italic text-lg">
            分類「{activeCategory}」目前還沒有內容
          </div>
        )}

        {/* 內容顯示區 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((item: any, index: number) => (
            <div key={index} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col bg-white">
              {/* 修正 3: 圖片 API 對齊「封面圖片連結」 */}
              <div className="relative h-48 w-full">
                <img 
                  src={`https://drive.google.com/thumbnail?id=${item.封面圖片連結}&sz=w800`} 
                  alt={item.標題} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <span className="text-xs text-green-600 font-bold tracking-wider">{item.分類}</span>
                {/* 修正 2: 對齊「標題」 */}
                <h3 className="text-xl font-bold mt-2 mb-4 text-gray-900 line-clamp-2 leading-snug">
                  {item.標題}
                </h3>
                
                <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-gray-400 text-xs">2026-03-15</span>
                  {/* 修正 4: 新聞跳轉對齊「影片連結」 */}
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
      </div>
    </section>
  );
};

// 修正 5: 確保 Home 組件正確傳遞資料
export default function Home({ data }: { data: any }) {
  // 這裡確保將 data.news 或是 data 傳給 NewsSection
  return (
    <main>
      <NewsSection newsData={data} />
    </main>
  );
}