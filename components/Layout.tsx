import React from 'react';
import { PenTool, Layout as LayoutIcon, Settings, Plus } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onNew: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onNew }) => {
  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100">
      {/* Sidebar */}
      <aside className="w-16 md:w-64 border-r border-slate-800 flex flex-col bg-slate-950/50 backdrop-blur-md fixed h-full z-10 md:relative">
        <div className="p-4 md:p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <PenTool size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight hidden md:block bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
            CreatorFlow
          </span>
        </div>

        <nav className="flex-1 p-3 space-y-1 mt-4">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-800/50 text-blue-200 font-medium">
            <LayoutIcon size={20} />
            <span className="hidden md:block">Tracker Board</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors">
            <Settings size={20} />
            <span className="hidden md:block">Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="text-xs text-slate-500 hidden md:block mb-2 text-center">
            Powered by Gemini
          </div>
          <button 
            onClick={onNew}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg p-2 md:py-3 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02]"
          >
            <Plus size={20} />
            <span className="hidden md:block font-medium">New Content</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-16 md:ml-0 overflow-x-hidden w-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;
