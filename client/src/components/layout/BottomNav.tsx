import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, FileText, Layers, Shield } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { role, isAuthenticated } = useAuth();
  const dashboard = role === 'ADMIN' ? '/admin' : '/officer';
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#0A0D14]/90 backdrop-blur-lg border-t border-slate-200 dark:border-white/10 px-3 py-1.5 transition-colors">
      <div className="flex items-center justify-around">
        <Link
          to="/"
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
            isActive('/') ? 'text-red-500 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </Link>

        {(!isAuthenticated || role === 'CITIZEN' || role === 'RESIDENT') && (<Link
          to="/report"
          className="flex flex-col items-center -mt-5 relative group"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-red-500 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-red-500/40 group-hover:scale-105 transition-transform border-2 border-white dark:border-[#0A0D14]">
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className="text-[10px] text-red-500 font-bold mt-1">Report</span>
        </Link>)}

        <Link
          to="/issues"
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
            isActive('/issues') ? 'text-red-500 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Feed</span>
        </Link>

        {(!isAuthenticated || role === 'CITIZEN' || role === 'RESIDENT') && (<Link
          to="/my-reports"
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
            isActive('/my-reports') ? 'text-red-500 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">My Reports</span>
        </Link>)}

        {isAuthenticated && (role === 'ADMIN' || role === 'OFFICER') && (<Link
          to={dashboard}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
            isActive(dashboard) ? 'text-indigo-500 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Shield className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Dashboard</span>
        </Link>)}
      </div>
    </div>
  );
};
