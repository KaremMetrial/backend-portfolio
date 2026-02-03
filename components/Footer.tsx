
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 border-t border-white/5 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-neutral-800 rounded flex items-center justify-center font-bold text-neutral-400 text-xs mono">
            v2
          </div>
          <span className="text-neutral-500 text-sm mono">© 2024 Built with <span className="text-indigo-400">Laravel</span> philosophy</span>
        </div>

        <div className="flex items-center space-x-6 text-neutral-500 text-xs mono uppercase tracking-widest">
          <a href="#" className="hover:text-white transition-colors">Status: Online</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Sitemap</a>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs text-emerald-400 font-bold mono">All Systems Operational</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
