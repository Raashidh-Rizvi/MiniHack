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
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { currentUser, role, switchRole } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl">🇱🇰</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-extrabold text-white tracking-tight">Grama<span className="text-emerald-400">Fix</span></span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  MVP
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Report. Prioritize. Fix.</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Home
            </Link>
            <Link
              to="/report"
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/report')
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Report Issue</span>
            </Link>
            <Link
              to="/my-reports"
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/my-reports')
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4 text-sky-400" />
              <span>My Reports</span>
            </Link>
            <Link
              to="/issues"
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/issues')
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Community Feed</span>
            </Link>
          </nav>

          {/* Persona Switcher & Action CTA */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Persona Switcher */}
            <div className="flex items-center bg-slate-800/90 rounded-full p-1 border border-slate-700 text-xs">
              <button
                onClick={() => switchRole('RESIDENT')}
                className={`px-3 py-1 rounded-full font-medium transition-all flex items-center space-x-1 ${
                  role === 'RESIDENT'
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Citizen Persona: Kasun Perera (Matale)"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Citizen</span>
              </button>
              <button
                onClick={() => switchRole('ADMIN')}
                className={`px-3 py-1 rounded-full font-medium transition-all flex items-center space-x-1 ${
                  role === 'ADMIN'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Admin Persona: Eng. Bandara (Municipal Council)"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>

            {/* User details badge */}
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-200">{currentUser.fullName}</span>
              <span className="text-[10px] text-slate-400 flex items-center justify-end space-x-0.5">
                <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                <span>{currentUser.communityArea}</span>
              </span>
            </div>

            <Link
              to="/report"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all flex items-center space-x-1.5 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report</span>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => switchRole(role === 'RESIDENT' ? 'ADMIN' : 'RESIDENT')}
              className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 border border-slate-700 text-slate-300 font-medium"
            >
              {role === 'RESIDENT' ? '👤 Citizen' : '🛡️ Admin'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-900/95 backdrop-blur-xl px-4 pt-2 pb-5 space-y-2">
          <div className="py-2 px-3 mb-2 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-white">{currentUser.fullName}</p>
              <p className="text-slate-400">{currentUser.communityArea}</p>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${role === 'ADMIN' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
              {role}
            </span>
          </div>
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Home
          </Link>
          <Link
            to="/report"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-emerald-400 hover:bg-slate-800"
          >
            Report an Issue
          </Link>
          <Link
            to="/my-reports"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            My Reports
          </Link>
          <Link
            to="/issues"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Community Feed
          </Link>
          <Link
            to="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-400 hover:bg-slate-800"
          >
            Persona / Login Switcher
          </Link>
        </div>
      )}
    </header>
  );
};
