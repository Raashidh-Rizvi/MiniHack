import React from 'react';
import { Heart, ShieldCheck, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../common/BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-canvas border-t border-slate-200 dark:border-white/10 mt-20 pt-12 pb-24 md:pb-12 text-slate-500 dark:text-slate-400 text-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <BrandLogo badgeSize="w-8 h-8" iconSize={20} showSubtitle={false} showBadge={false} />
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Community Issue Coordination & Prioritization Platform for Sri Lankan Neighborhoods. Connecting residents, ward officials, and authorities transparently.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Pilot Focus Jurisdictions
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>Matale Municipal Council</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>Kandy Urban Authority</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>Colombo Metropolitan Area</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>Galle Heritage District</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Quick Civic Navigation
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/" className="hover:text-red-500 transition-colors">Home Landing</Link>
              </li>
              <li>
                <Link to="/issues" className="hover:text-red-500 transition-colors">Public Issues Feed</Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-red-500 transition-colors">Report an Issue</Link>
              </li>
              <li>
                <Link to="/my-reports" className="hover:text-red-500 transition-colors">Resident My Reports</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Assignment Milestone
            </h4>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-surface border border-slate-200 dark:border-white/10 space-y-1.5 text-xs">
              <p className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-red-500" />
                <span>SE3090 Mini Hackathon</span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Assignment 2 • 3-Person Team Full-Stack MVP with Deterministic Community Scoring.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-500 gap-4">
          <p>© 2026 GramaFix Sri Lanka. All community rights reserved.</p>
          <p className="flex items-center space-x-1.5">
            <span>Built with civic care for resilient Sri Lankan neighborhoods</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
