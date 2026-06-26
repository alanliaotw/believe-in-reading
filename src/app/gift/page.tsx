'use client';

import Link from 'next/link';

export default function GiftPage() {
  // ✅ 這裡的路徑必須跟您 public 裡的檔名完全一致
  const pdfPath = "/永續禮盒手冊.pdf"; 

  return (
    <main className="min-h-screen bg-[#fdfdfd] text-[#333] font-sans pb-20">
      <style jsx>{`
        .container { max-width: 850px; margin: 0 auto; padding: 40px 20px; background: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border-radius: 12px; position: relative; z-index: 10; }
        .back-home { display: inline-flex; align-items: center; color: #b08968; text-decoration: none; font-size: 14px; font-weight: 600; margin-bottom: 20px; transition: all 0.3s ease; border: 1px solid #b08968; padding: 6px 16px; border-radius: 50px; }
        .back-home:hover { background: #b08968; color: #fff; transform: translateX(-5px); }
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
        {/* 🏆 新增：回到首頁按鈕 */}
        <div className="flex justify-start">
          <Link href="/" className="back-home">
            ← 回相信閱讀首頁
          </Link>
        </div>

        <h1 className="page-title">【相信閱讀】「這是一場關於『減法』的永續實驗。」</h1>
        <p className="text-center text-gray-400 mb-10 tracking-widest uppercase text-sm">Focus Journal x 相信閱讀 專屬特輯</p>

        <div className="introduction">
          <span className="quote">「每一份閱讀，都是改變的開始。」</span>
          <p>感謝您支持「相信閱讀」永續禮盒。如果一份標榜「永續」的禮盒，依然裝滿了紙本手冊與繁複包裝，那它的碳足跡真的減少了嗎？

這次，【相信閱讀】與【潮永續】決定聯手發起一場大膽的實驗。在最後的包裝階段，我們「刻意留白」。

我們在思考：在數位閱讀普及的今天，那份原本預計入盒、長達 48 頁的實體導讀手冊，是否一定要存在？

於是，我們啟動了這場關於「減法」的永續實驗。我們選擇減少紙張耗損與重複的物流碳排，將所有精華完整轉化為數位互動版手冊。

我們邀請每一位收到禮盒的貴賓，透過指尖滑動，完成這份禮盒最後的完整性。這不只是數位轉型，更是我們對環境最誠實的承諾。</p>
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
      </div>
    </main>
  );
}
