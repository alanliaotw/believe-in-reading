'use client';

import Image from 'next/image';

export default function GiftPage() {
  // ✅ 這裡的路徑必須跟您 public 裡的檔名完全一致
  const pdfPath = "/gift-guide.pdf"; 

  return (
    <main className="min-h-screen bg-[#fdfdfd] text-[#333] font-sans pb-20">
      <style jsx>{`
        .container { max-width: 850px; margin: 0 auto; padding: 40px 20px; background: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border-radius: 12px; position: relative; z-index: 10; }
        .page-title { font-size: clamp(24px, 5vw, 36px); color: #b08968; text-align: center; font-weight: 800; letter-spacing: 0.1em; margin-bottom: 20px; }
        .section-title { font-size: 22px; color: #444; border-left: 6px solid #b08968; padding-left: 15px; margin: 40px 0 20px; font-weight: 700; }
        .introduction { background: #f8f5f2; padding: 30px; border-radius: 12px; border-top: 4px solid #b08968; margin-bottom: 40px; line-height: 2; font-size: 17px; }
        .quote { color: #b08968; font-weight: bold; display: block; text-align: center; margin-bottom: 20px; font-size: 20px; }
        .pdf-container { position: relative; width: 100%; padding-bottom: 141.4%; background: #eee; border-radius: 8px; overflow: hidden; box-shadow: 0 15px 40px rgba(0,0,0,0.15); border: 1px solid #ddd; }
        .download-btn { display: inline-flex; align-items: center; justify-content: center; background: #b08968; color: #fff; padding: 18px 40px; border-radius: 50px; font-weight: 700; font-size: 18px; text-decoration: none; transition: all 0.3s ease; box-shadow: 0 10px 20px rgba(176, 137, 104, 0.3); }
        .download-btn:hover { background: #9c785c; transform: translateY(-3px); box-shadow: 0 15px 25px rgba(176, 137, 104, 0.4); }
        @media (max-width: 600px) { .container { padding: 20px 15px; border-radius: 0; margin-top: 0; } .introduction { padding: 20px; font-size: 16px; } }
      `}</style>

      <div className="container mt-10">
        <h1 className="page-title">【潮永續】數位導讀特刊</h1>
        <p className="text-center text-gray-400 mb-10 tracking-widest uppercase text-sm">Focus Journal x 相信閱讀 專屬特輯</p>

        <div className="introduction">
          <span className="quote">「每一份閱讀，都是改變的開始。」</span>
          <p>感謝您支持「相信閱讀」永續禮盒。我們秉持減法永續精神，將原本 48 頁的實體手冊轉化為數位版本。這不只是紙張的節省，更是為了讓這份永續影響力能更無遠弗屆地被分享、被典藏。</p>
        </div>

        <h2 className="section-title">線上即時翻閱</h2>
        <p className="text-gray-500 mb-6 text-sm text-center">※ 如無法載入預覽，請直接點選下方按鈕下載</p>
        
        <div className="pdf-container mb-12">
          <iframe
            src={`${pdfPath}#toolbar=0&navpanes=0`}
            className="absolute top-0 left-0 w-full h-full border-none"
            title="Digital Guide PDF预览"
          ></iframe>
        </div>

        <div className="text-center py-10 bg-[#fafafa] rounded-2xl border border-dashed border-gray-200">
          <h3 className="text-lg font-bold mb-6 text-gray-600">想要離線閱讀或收藏嗎？</h3>
          <a href={pdfPath} download="潮永續數位導讀特刊.pdf" className="download-btn">
            📥 下載 48 頁完整 PDF 存檔
          </a>
          <p className="mt-6 text-gray-400 text-xs text-center px-10">
            本特刊著作權由「聚焦誌」與「相信閱讀」共有，嚴禁商業營利使用。
          </p>
        </div>

        <div className="mt-16 pt-10 border-t border-gray-100 text-center">
          <div className="flex flex-wrap justify-center gap-6 items-center opacity-70">
            <span className="font-bold text-gray-600 text-lg">蔣本基教授 指導</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="font-bold text-gray-600 text-lg">雲林縣政府 協辦</span>
          </div>
        </div>
      </div>
    </main>
  );
}