import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminDashboard } from '../components/admin/AdminDashboard';

export const AdminPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Admin page header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-1">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-indigo-300 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to site
            </Link>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/30">
              <Shield className="w-7 h-7 text-indigo-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight !text-white">
                System Administrator Dashboard
              </h1>
              <p className="mt-1 text-indigo-200 text-sm max-w-2xl">
                Review and triage community issues ranked by the GramaFix Priority Engine. 
                Issues are scored by severity (40%), people affected (30%), urgency (20%), and report age (10%).
              </p>
            </div>
          </div>

          {/* Priority formula banner */}
          <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-indigo-200">
            <span className="text-indigo-400 font-semibold">Priority Score</span>
            {' = '}
            <span className="text-amber-300">Severity × 0.40</span>
            {' + '}
            <span className="text-sky-300">People Affected × 0.30</span>
            {' + '}
            <span className="text-emerald-300">Urgency × 0.20</span>
            {' + '}
            <span className="text-rose-300">Report Age × 0.10</span>
            <span className="ml-4 text-slate-400">Normalized points → 0–34: LOW · 35–64: MEDIUM · 65–84: HIGH · 85–100: CRITICAL</span>
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
