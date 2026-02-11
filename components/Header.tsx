
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none">Pro Search</h1>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-widest">Data Extractor</span>
          </div>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-blue-600 transition-colors">Analytics</a>
          <a href="#" className="hover:text-blue-600 transition-colors">History</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Settings</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
