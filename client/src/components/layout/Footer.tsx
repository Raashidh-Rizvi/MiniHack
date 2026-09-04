import React, { useState } from 'react';
import { Heart, ShieldCheck, MapPin, PhoneCall, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../common/BrandLogo';
import { EmergencyModal } from '../common/EmergencyModal';

export const Footer: React.FC = () => {
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

  return (
    <footer className="bg-white dark:bg-canvas border-t border-slate-200 dark:border-white/10 mt-20 pt-12 pb-24 md:pb-12 text-slate-500 dark:text-slate-400 text-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Brand Info */}
          <div className="space-y-3">
            <BrandLogo badgeSize="w-8 h-8" iconSize={20} showSubtitle={false} showBadge={false} />
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Community Issue Coordination & Prioritization Platform for Sri Lankan Neighborhoods. Connecting residents, ward officials, and municipal authorities transparently.
            </p>
            <div className="pt-2">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-surface border border-slate-200 dark:border-white/10 space-y-1 text-xs">
                <p className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
                  <span>SE3090 Mini Hackathon</span>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Assignment 2 • Deterministic Community Scoring & Civic Triage.
                </p>
              </div>
            </div>
          </div>

          {/* Column 2: Pilot Focus Jurisdictions */}
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

          {/* Column 3: Quick Civic Navigation */}
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

          {/* Column 4: Official Sri Lankan Government Emergency Hotlines */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center space-x-1.5">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Govt Emergency Hotlines</span>
              </h4>
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                24/7 Toll-Free
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 leading-tight">
              For immediate threats to life, accidents, or disasters, dial direct:
            </p>

            <ul className="space-y-1 text-xs">
              <li className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-white/5">
                <span className="text-slate-700 dark:text-slate-300">Police Emergency</span>
                <a href="tel:119" className="font-bold text-red-600 dark:text-red-400 hover:underline">119</a>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-white/5">
                <span className="text-slate-700 dark:text-slate-300">Suwa Seriya Ambulance</span>
                <a href="tel:1990" className="font-bold text-red-600 dark:text-red-400 hover:underline">1990</a>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-white/5">
                <span className="text-slate-700 dark:text-slate-300">Disaster Management (DMC)</span>
                <a href="tel:117" className="font-bold text-amber-600 dark:text-amber-400 hover:underline">117</a>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-white/5">
                <span className="text-slate-700 dark:text-slate-300">Fire & Rescue Service</span>
                <a href="tel:110" className="font-bold text-orange-600 dark:text-orange-400 hover:underline">110</a>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-white/5">
                <span className="text-slate-700 dark:text-slate-300">CEB Electricity Breakdown</span>
                <a href="tel:1987" className="font-bold text-yellow-600 dark:text-yellow-400 hover:underline">1987</a>
              </li>
              <li className="flex items-center justify-between py-1">
                <span className="text-slate-700 dark:text-slate-300">Water Board (NWSDB)</span>
                <a href="tel:1939" className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline">1939</a>
              </li>
            </ul>

            <button
              type="button"
              onClick={() => setEmergencyModalOpen(true)}
              className="mt-3 w-full py-1.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold border border-red-500/25 flex items-center justify-center space-x-1 transition-colors cursor-pointer"
            >
              <span>Full Emergency Directory</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </button>
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

      <EmergencyModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
      />
    </footer>
  );
};
