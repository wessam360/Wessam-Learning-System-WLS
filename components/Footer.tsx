import React from 'react';
import { Code2, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-black text-slate-400 py-10 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Column: Brand Credit */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-white">Wessam Learning System (WLS)</span>
            <span className="text-[11px] font-semibold text-blue-400 px-2 py-0.5 rounded-full bg-blue-950/80 border border-blue-800">
              v1.0 Production
            </span>
          </div>
          <p className="text-xs text-slate-300 font-medium">
            Developer & Educator: <span className="text-blue-400 font-semibold">Wessam Learning System (WLS)</span>
          </p>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 justify-center md:justify-start">
            <Code2 className="w-3.5 h-3.5 text-blue-500 inline" />
            Title: AI & Software Engineer | Technical Educator | Community Builder
          </p>
        </div>

        {/* Right Column: Social Links & Accreditation */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <a
            href="https://www.linkedin.com/in/wessam-aftab/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-blue-950/70 hover:bg-blue-900 border border-blue-700/80 text-blue-300 hover:text-white transition-all shadow-md shadow-blue-500/10 group cursor-pointer"
          >
            <svg
              className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
            </svg>
            Connect on LinkedIn: wessam-aftab
          </a>
          <p className="text-[11px] text-slate-500 flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" /> for 500+ Active Academy Students
          </p>
        </div>
      </div>
    </footer>
  );
}
