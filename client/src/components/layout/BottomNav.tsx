import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, FileText, Layers } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-slate-800 bg-slate-950/90 backdrop-blur-lg px-2 py-1.5">
      <div className="flex items-center justify-around">
        <Link
          to="/"
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
            isActive('/') ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </Link>

        <Link
          to="/report"
          className="flex flex-col items-center -mt-5 relative group"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform border-2 border-slate-900">
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold mt-1">Report</span>
        </Link>

        <Link
          to="/my-reports"
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
            isActive('/my-reports') ? 'text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">My Reports</span>
        </Link>

        <Link
          to="/issues"
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
            isActive('/issues') ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Feed</span>
        </Link>
      </div>
    </div>
  );
};
