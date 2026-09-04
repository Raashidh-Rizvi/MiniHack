import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  PlusCircle,
  FileText,
  Shield,
  Layers,
  UserCheck,
  Building2,
  MapPin,
  Sun,
  Moon,
  Flame,
  LogIn,
  LogOut,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, role, switchRole, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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

          {/* Right Controls: Theme Toggle, 3-Role Switcher, Auth Links */}
          <div className="hidden sm:flex items-center space-x-2.5">
            {/* Theme Toggle (Dark / Light) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-elevated transition-colors"
              aria-label="Toggle between dark and light theme"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* 3-Role Persona Switcher (Citizen vs Officer vs Admin) */}
            <div className="flex items-center bg-slate-100 dark:bg-surface-elevated rounded-full p-1 border border-slate-200 dark:border-white/10 text-xs">
              <button
                type="button"
                onClick={() => switchRole('CITIZEN')}
                className={`px-2.5 py-1 rounded-full font-bold transition-all flex items-center space-x-1 ${
                  role === 'CITIZEN' || role === 'RESIDENT'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Role 1: Citizen (Kasun Perera)"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Citizen</span>
              </button>
              <button
                type="button"
                onClick={() => switchRole('OFFICER')}
                className={`px-2.5 py-1 rounded-full font-bold transition-all flex items-center space-x-1 ${
                  role === 'OFFICER'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Role 2: Municipal Officer (Eng. Bandara)"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Officer</span>
              </button>
              <button
                type="button"
                onClick={() => switchRole('ADMIN')}
                className={`px-2.5 py-1 rounded-full font-bold transition-all flex items-center space-x-1 ${
                  role === 'ADMIN'
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Role 3: System Admin (Dr. Priyantha)"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>

            {/* Auth Actions: Sign In / Register / Log Out */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 pl-1 border-l border-slate-200 dark:border-white/10">
                <div className="hidden lg:flex flex-col text-right text-xs">
                  <span className="font-bold text-slate-900 dark:text-slate-200 truncate max-w-[110px]">
                    {currentUser.fullName}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center justify-end space-x-0.5">
                    <MapPin className="w-2.5 h-2.5 text-red-500" />
                    <span className="truncate max-w-[90px]">{currentUser.communityArea}</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 pl-1">
                <Link
                  to="/login"
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                    isActive('/login')
                      ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-elevated'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                    isActive('/register')
                      ? 'bg-red-500 text-white'
                      : 'bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}
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
              onClick={() => {
                if (role === 'CITIZEN' || role === 'RESIDENT') switchRole('OFFICER');
                else if (role === 'OFFICER') switchRole('ADMIN');
                else switchRole('CITIZEN');
              }}
              className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-surface-elevated border border-slate-200 dark:border-white/10 font-bold"
            >
              {role === 'OFFICER' ? '👷 Officer' : role === 'ADMIN' ? '🛡️ Admin' : '👤 Citizen'}
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

          <div className="pt-2 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 gap-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-xs font-bold text-center bg-slate-100 dark:bg-surface-elevated text-slate-800 dark:text-slate-200"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-xs font-bold text-center bg-red-500/10 text-red-500 border border-red-500/20"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
