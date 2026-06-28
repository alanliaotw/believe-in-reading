import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '隱私政策｜相信閱讀 Read & Believe',
  description: '相信閱讀 Read & Believe 的隱私政策說明。',
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">隱私政策</h1>
      <p className="text-sm text-gray-500 mb-8">最後更新日期：2026 年 6 月 27 日</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. 關於我們</h2>
        <p className="text-gray-700 leading-relaxed">
          相信閱讀 Read &amp; Believe（以下簡稱「本公司」）重視您的隱私權。本隱私政策說明我們在您使用本網站（focus-esg.com）及我們的社群媒體頻道時，如何蒐集、使用及保護您的個人資料。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. 蒐集的資料</h2>
        <p className="text-gray-700 leading-relaxed mb-2">我們可能蒐集以下資料：</p>
        <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-1">
          <li>您主動提供的資訊（如聯絡表單、訂閱電子報）</li>
          <li>網站使用記錄（透過 Google Analytics 4 匿名統計）</li>
          <li>您與我們社群媒體頁面互動的公開資訊</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. 資料使用方式</h2>
        <p className="text-gray-700 leading-relaxed mb-2">蒐集的資料僅用於：</p>
        <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-1">
          <li>提供及改善本網站服務</li>
          <li>回覆您的詢問</li>
          <li>發送您訂閱的電子報或通知</li>
          <li>分析網站流量以優化使用者體驗</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. Facebook / Meta 平台</h2>
        <p className="text-gray-700 leading-relaxed">
          本公司透過 Facebook 粉絲專頁（相信閱讀 Read &amp; Believe）與讀者互動，並使用 Meta 提供的工具管理內容發布。我們不會將您在 Facebook 上的互動資料用於本網站以外的商業目的。Meta 的資料使用方式請參閱 <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Meta 隱私政策</a>。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. 資料安全</h2>
        <p className="text-gray-700 leading-relaxed">
          我們採取合理的技術與管理措施保護您的個人資料，防止未經授權的存取、揭露或毀損。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. 第三方連結</h2>
        <p className="text-gray-700 leading-relaxed">
          本網站可能包含第三方網站連結，我們不對該等網站的隱私權實踐負責，建議您自行閱讀其隱私政策。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">7. 聯絡我們</h2>
        <p className="text-gray-700 leading-relaxed">
          如您對本隱私政策有任何疑問，歡迎透過 Facebook 粉絲專頁或電子郵件與我們聯繫。
        </p>
      </section>
    </main>
  );
}
