import React, { useState } from 'react';

const NewsSection = ({ newsData }) => {
  const [activeCategory, setActiveCategory] = useState('全部');
  const categories = ['全部', '永續列車', '潮永續', '人物專訪'];

  const filteredNews = activeCategory === '全部' 
    ? newsData 
    : newsData.filter(item => item.category === activeCategory);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">最新消息</h2>
        
        {/* 分類切換鈕 */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full transition ${
                activeCategory === cat 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 內容顯示區 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.length > 0 ? (
            filteredNews.map((item, index) => (
              <div key={index} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                <img 
                  src={item.coverImage} 
                  alt={item.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <span className="text-sm text-green-600 font-semibold">{item.category}</span>
                  <h3 className="text-xl font-bold mt-2 mb-3 line-clamp-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">{item.content}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">{item.date}</span>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">閱讀更多</a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* 修正後的位置：緊隨其下，不再置中佔版面 */
            <div className="col-span-full text-center py-8 text-gray-400 italic">
              分類「{activeCategory}」目前還沒有內容
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;