import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  PlusCircle,
  FileText,
  Shield,
  Layers,
  UserCheck,
  MapPin,
  Sun,
  Moon,
  Flame,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { currentUser, role, switchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/85 dark:bg-canvas/85 backdrop-blur-md border-b border-slate-200 dark:border-white/8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/25 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Grama<span className="text-red-500">Fix</span>
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                  MVP
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Report. Prioritize. Fix.</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/')
                  ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-elevated'
              }`}
            >
              Home
            </Link>
            <Link
              to="/issues"
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/issues')
                  ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-elevated'
              }`}
            >
              <Layers className="w-4 h-4 text-red-500" />
              <span>Community Feed</span>
            </Link>
            <Link
              to="/my-reports"
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/my-reports')
                  ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-elevated'
              }`}
            >
              <FileText className="w-4 h-4 text-sky-500" />
              <span>My Reports</span>
            </Link>
            <Link
              to="/report"
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/report')
                  ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-elevated'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-500" />
              <span>Report Issue</span>
            </Link>
          </nav>

          {/* Right Controls: Theme Toggle, Persona Switcher, Action Button */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Theme Toggle (Dark / Light) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-elevated transition-colors"
              aria-label="Toggle between dark and light theme"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Persona Switcher (Citizen vs Admin) */}
            <div className="flex items-center bg-slate-100 dark:bg-surface-elevated rounded-full p-1 border border-slate-200 dark:border-white/10 text-xs">
              <button
                type="button"
                onClick={() => switchRole('RESIDENT')}
                className={`px-3 py-1 rounded-full font-bold transition-all flex items-center space-x-1 ${
                  role === 'RESIDENT'
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Citizen Persona: Kasun Perera (Matale)"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Citizen</span>
              </button>
              <button
                type="button"
                onClick={() => switchRole('ADMIN')}
                className={`px-3 py-1 rounded-full font-bold transition-all flex items-center space-x-1 ${
                  role === 'ADMIN'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Admin Persona: Eng. Bandara (Municipal Council)"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>

            {/* User location chip */}
            <div className="hidden xl:flex flex-col text-right text-xs">
              <span className="font-bold text-slate-900 dark:text-slate-200">{currentUser.fullName}</span>
              <span className="text-[10px] text-slate-400 flex items-center justify-end space-x-0.5">
                <MapPin className="w-2.5 h-2.5 text-red-500" />
                <span>{currentUser.communityArea}</span>
              </span>
            </div>

            {/* Primary Action Button (Pill button matching SAS landing page) */}
            <Link
              to="/report"
              className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-[0_4px_16px_rgba(239,68,68,0.4)] hover:shadow-[0_4px_24px_rgba(239,68,68,0.6)] transition-all flex items-center space-x-1.5 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report</span>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => switchRole(role === 'RESIDENT' ? 'ADMIN' : 'RESIDENT')}
              className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-surface-elevated border border-slate-200 dark:border-white/10 font-bold"
            >
              {role === 'RESIDENT' ? '👤 Citizen' : '🛡️ Admin'}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-surface-elevated text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-white/8 bg-white dark:bg-surface px-4 pt-3 pb-5 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-elevated"
          >
            Home
          </Link>
          <Link
            to="/issues"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-elevated"
          >
            Community Feed
          </Link>
          <Link
            to="/my-reports"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-elevated"
          >
            My Reports
          </Link>
          <Link
            to="/report"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-sm font-bold text-center text-white bg-gradient-to-r from-red-500 to-red-600 shadow-[0_4px_16px_rgba(239,68,68,0.4)]"
          >
            Report an Issue
          </Link>
        </div>
      )}
    </header>
  );
};
