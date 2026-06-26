export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 mt-20 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <p className="text-white font-bold text-lg mb-1">相信閱讀 Read & Believe</p>
          <p className="text-gray-400 text-sm">ESG 永續議題深度媒體</p>
          <p className="text-gray-500 text-xs mt-2">實體雜誌《FOCUS 聚焦誌》於誠品、博客來販售</p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="flex gap-4">
            <a href="https://www.facebook.com/readnbelieve.focus/" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-emerald-500/30 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/read.n.believe/" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-emerald-500/30 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
          </div>
          <p className="text-gray-600 text-xs">© {new Date().getFullYear()} 相信閱讀 Read & Believe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
