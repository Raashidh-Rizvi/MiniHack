import React from 'react';
import { Heart, ShieldCheck, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="glass-panel border-t border-slate-800/80 mt-20 pt-12 pb-24 md:pb-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🇱🇰</span>
              <span className="text-lg font-bold text-white tracking-tight">Grama<span className="text-emerald-400">Fix</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Community Issue Coordination and Prioritization Platform for Sri Lankan Neighborhoods. Connecting residents and authorities transparently.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Key Focus Areas</h4>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-center space-x-1"><MapPin className="w-3 h-3 text-emerald-400" /><span>Matale Municipal Area</span></li>
              <li className="flex items-center space-x-1"><MapPin className="w-3 h-3 text-emerald-400" /><span>Kandy Greater District</span></li>
              <li className="flex items-center space-x-1"><MapPin className="w-3 h-3 text-emerald-400" /><span>Colombo Metropolitan Zones</span></li>
              <li className="flex items-center space-x-1"><MapPin className="w-3 h-3 text-emerald-400" /><span>Galle Heritage Neighborhoods</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Community Principles</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>Deterministic Prioritization</li>
              <li>Civilian Community Weighting</li>
              <li>Transparent Resolution Audit</li>
              <li>Equal Neighborhood Voice</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Hackathon Info</h4>
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1 text-xs">
              <p className="font-semibold text-white flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>SE3090 Mini Hackathon</span>
              </p>
              <p className="text-[11px] text-slate-400">Assignment 2 • 3-Person Team Full-Stack MVP</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 GramaFix Sri Lanka. All community rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-red-400 fill-red-400" />
            <span>for resilient Sri Lankan communities</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
