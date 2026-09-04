import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  PlusCircle,
  FileText,
  Shield,
  Layers,
  Building2,
  MapPin,
  Sun,
  Moon,
  LogIn,
  LogOut,
  UserPlus,
  PhoneCall,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { BrandLogo } from '../common/BrandLogo';
import { EmergencyModal } from '../common/EmergencyModal';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, role, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/85 dark:bg-[#0A0D14]/85 backdrop-blur-md border-b border-slate-200 dark:border-white/10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <BrandLogo />

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1 lg:space-x-2">
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
            {(!isAuthenticated || role === 'CITIZEN' || role === 'RESIDENT') && (<Link
              to="/my-reports"
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/my-reports')
                  ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-elevated'
              }`}
            >
              <FileText className="w-4 h-4 text-sky-500" />
              <span>My Reports</span>
            </Link>)}
            {(!isAuthenticated || role === 'CITIZEN' || role === 'RESIDENT') && (<Link
              to="/report"
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/report')
                  ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-elevated'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-500" />
              <span>Report Issue</span>
            </Link>)}
            {isAuthenticated && role === 'ADMIN' && (<Link
              to="/admin"
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/admin')
                  ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-elevated'
              }`}
            >
              <Shield className="w-4 h-4 text-indigo-500" />
              <span>Admin</span>
            </Link>)}
            {/* Officer Portal — shown highlighted when role is OFFICER */}
            {isAuthenticated && role === 'OFFICER' && (<Link
              to="/officer"
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/officer')
                  ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20'
                  : role === 'OFFICER'
                  ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-elevated'
              }`}
            >
              <Building2 className="w-4 h-4 text-teal-500" />
              <span>Officer</span>
              {role === 'OFFICER' && (
                <span className="text-[9px] font-bold uppercase bg-teal-500 text-white px-1 py-0.5 rounded ml-0.5">
                  You
                </span>
              )}
            </Link>)}
          </nav>

          {/* Right Controls: Theme Toggle, 3-Role Switcher, Auth Links */}
          <div className="hidden xl:flex items-center space-x-2.5">
            {/* Quick Emergency Hotlines SOS Button */}
            <button
              type="button"
              onClick={() => setEmergencyModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-black text-red-600 dark:text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all cursor-pointer group shadow-sm"
              title="Official Sri Lankan Government Emergency Numbers"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <PhoneCall className="w-3.5 h-3.5 text-red-500" />
              <span>119 / 1990 SOS</span>
            </button>

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

            {isAuthenticated && <span className="text-xs font-bold px-2">{role === "ADMIN" ? "Administrator" : role === "OFFICER" ? "Officer" : "Citizen"}</span>}

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
          <div className="flex xl:hidden items-center space-x-2">
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
              onClick={() => navigate(isAuthenticated ? (role === 'ADMIN' ? '/admin' : role === 'OFFICER' ? '/officer' : '/my-reports') : '/login')}
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
        <div className="xl:hidden border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#121722] px-4 pt-3 pb-5 space-y-2">
          <Link
            to="/issues"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-elevated"
          >
            Community Feed
          </Link>
          {(!isAuthenticated || role === 'CITIZEN' || role === 'RESIDENT') && (<Link
            to="/my-reports"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-elevated"
          >
            My Reports
          </Link>)}
          {(!isAuthenticated || role === 'CITIZEN' || role === 'RESIDENT') && (<Link
            to="/report"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-sm font-bold text-center text-white bg-gradient-to-r from-red-500 to-red-600 shadow-[0_4px_16px_rgba(239,68,68,0.4)]"
          >
            Report an Issue
          </Link>)}

          {!isAuthenticated && <div className="pt-2 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 gap-2">
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
          </div>}
          {isAuthenticated && <button className="px-3 py-2 text-sm font-bold" onClick={() => { setMobileMenuOpen(false); handleLogout(); }}>Sign Out</button>}
          {isAuthenticated && role === 'ADMIN' && (<Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Admin Portal
          </Link>)}
          {isAuthenticated && role === 'OFFICER' && (<Link
            to="/officer"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 ${
              role === 'OFFICER'
                ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10'
                : 'text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-500/10'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Officer Portal
            {role === 'OFFICER' && (
              <span className="text-[9px] font-bold uppercase bg-teal-500 text-white px-1 py-0.5 rounded ml-auto">
                Your Workspace
              </span>
            )}
          </Link>)}

          {/* Mobile Emergency SOS Button */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setEmergencyModalOpen(true);
            }}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-black text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-red-500" />
            <span>Government Emergency Hotlines (119, 1990, 117)</span>
          </button>
        </div>
      )}

      {/* Global Emergency Directory Modal */}
      <EmergencyModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
      />
    </header>
  );
};
