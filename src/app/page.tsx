export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white px-6">
      
      {/* 🎬 導演級背景影片 */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover opacity-50"
        >
          <source src="/bg-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/80"></div>
      </div>

      {/* 1. 頂部導航（手機版縮小） */}
      <div className="absolute top-8 left-6 md:top-10 md:left-10 z-20">
        <div className="text-lg md:text-xl font-bold tracking-widest border-l-4 border-emerald-500 pl-4">
          相信閱讀
        </div>
      </div>

      {/* 前景內容 - 響應式文字大小調整 */}
      <div className="relative z-10 w-full max-w-4xl text-center animate-in fade-in zoom-in duration-1000">
        <h1 className="mb-4 md:mb-6 text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter leading-tight">
          相信閱讀 <br className="md:hidden" />
          <span className="text-emerald-500 italic">Believe in Reading</span>
        </h1>
        
        <p className="mb-10 md:mb-12 text-lg sm:text-xl md:text-2xl font-light leading-relaxed text-gray-200">
          「字裡行間，看見地球的潮起潮落。」<br />
          <span className="text-emerald-400 font-medium text-sm sm:text-lg md:text-xl tracking-[0.1em] md:tracking-widest block mt-2">
            讓價值被看見 — 潮永續 × 永續列車
          </span>
        </p>

        {/* 按鈕組：手機版垂直排列，電腦版橫向排列 */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6">
          <a 
            href="https://www.youtube.com/@相信閱讀" 
            target="_blank" 
            className="w-full sm:w-auto rounded-full bg-white px-10 py-4 text-black font-bold transition-all active:scale-95 hover:bg-emerald-500 hover:text-white text-center shadow-xl text-sm md:text-base"
          >
            觀看潮永續影片
          </a>
          <button className="w-full sm:w-auto rounded-full border border-white/30 bg-white/5 backdrop-blur-md px-10 py-4 text-white transition active:scale-95 hover:bg-white/20 text-sm md:text-base">
            Focus 聚焦誌
          </button>
        </div>
      </div>

      {/* 底部文案 - 針對小螢幕微調間距 */}
      <footer className="absolute bottom-8 md:bottom-10 z-10 text-gray-500 text-[10px] md:text-sm tracking-[0.1em] md:tracking-[0.2em] text-center px-4">
        Believe in Reading International<br className="md:hidden" />
        <span className="hidden md:inline"> | </span>
        <span className="text-emerald-500/80 font-medium">讓價值被看見</span>
      </footer>
    </main>
  );
}