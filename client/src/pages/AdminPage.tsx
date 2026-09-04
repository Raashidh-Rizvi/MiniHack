import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminDashboard } from '../components/admin/AdminDashboard';

export const AdminPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Admin page header */}
      <div className="bg-gradient-to-r from-purple-950 via-rose-950 to-slate-900 text-white border-b border-purple-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-1">
            <Link
<<<<<<< HEAD
              to="/"
              className="flex items-center gap-1.5 text-rose-300 hover:text-white text-sm transition-colors"
=======
              to="/issues"
              className="flex items-center gap-1.5 text-indigo-300 hover:text-white text-sm transition-colors"
>>>>>>> 90b1160f1914f19d7c0fa3ca4b22a1bc062844b5
            >
              <ArrowLeft className="w-4 h-4" />
              Community Feed
            </Link>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-3 rounded-xl bg-purple-500/20 border border-purple-500/30">
              <Shield className="w-7 h-7 text-rose-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Community Admin Portal
              </h1>
              <p className="mt-1 text-rose-200/90 text-sm max-w-2xl">
                Review and triage community issues ranked by the GramaFix Priority Engine. 
                Issues are scored by severity (40%), people affected (30%), urgency (20%), and report age (10%).
              </p>
            </div>
          </div>

          {/* Priority formula banner */}
          <div className="mt-6 p-4 rounded-xl bg-white/5 border border-purple-500/20 font-mono text-xs text-rose-200">
            <span className="text-purple-300 font-semibold">Priority Score</span>
            {' = '}
            <span className="text-amber-300">Severity × 0.40</span>
            {' + '}
            <span className="text-sky-300">People Affected × 0.30</span>
            {' + '}
            <span className="text-emerald-300">Urgency × 0.20</span>
            {' + '}
            <span className="text-rose-300">Report Age × 0.10</span>
            <span className="ml-4 text-slate-400">→ 0–25: LOW · 26–50: MEDIUM · 51–75: HIGH · 76–100: CRITICAL</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminDashboard />
      </div>
    </div>
  );
};
