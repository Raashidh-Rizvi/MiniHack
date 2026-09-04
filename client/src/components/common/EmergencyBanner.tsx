import React from 'react';
import { AlertTriangle, PhoneCall, ExternalLink, ShieldAlert } from 'lucide-react';
import { getRelevantEmergencyContacts } from '../../data/emergencyContacts';

interface EmergencyBannerProps {
  category?: string;
  severity?: string;
  onOpenDirectory?: () => void;
  className?: string;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  category,
  severity,
  onOpenDirectory,
  className = '',
}) => {
  const isCritical = severity === 'CRITICAL';
  const contacts = getRelevantEmergencyContacts(category, severity).slice(0, 3);

  return (
    <div
      className={`rounded-2xl border transition-all ${
        isCritical
          ? 'bg-gradient-to-r from-red-500/15 via-red-500/10 to-amber-500/10 border-red-500/40 p-4 shadow-[0_0_20px_rgba(239,68,68,0.15)] animate-pulse-slow'
          : 'bg-amber-500/10 dark:bg-amber-500/5 border-amber-500/25 p-3.5'
      } ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
              isCritical
                ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
            }`}
          >
            {isCritical ? <ShieldAlert className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span
                className={`text-[11px] font-black uppercase tracking-wider ${
                  isCritical ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {isCritical ? 'Immediate Hazard / Emergency Advisory' : 'Civic Safety Notice'}
              </span>
              <span className="text-[10px] px-2 py-0.2 rounded bg-red-500/10 text-red-600 dark:text-red-400 font-bold">
                Call Govt Dispatchers
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-200 mt-0.5 leading-snug">
              {isCritical ? (
                <>
                  <strong className="text-red-600 dark:text-red-400">Do not rely solely on an online report!</strong> If
                  there is live risk to human life, downed high-voltage power lines, gas leaks, or flooding, call
                  emergency services immediately.
                </>
              ) : (
                <>
                  GramaFix is an asynchronous municipal repair queue. For active fires, live wires, or injuries, contact
                  first responders.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Quick Hotline Calling Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:flex-shrink-0">
          {contacts.map((contact) => (
            <a
              key={contact.id}
              href={`tel:${contact.number}`}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-surface-elevated hover:bg-red-50 dark:hover:bg-red-950/40 border border-slate-200 dark:border-white/10 hover:border-red-500/40 text-slate-900 dark:text-white text-xs font-black shadow-sm transition-all"
              title={`Call ${contact.agency} (${contact.number})`}
            >
              <PhoneCall className="w-3 h-3 text-red-500" />
              <span>{contact.displayNumber}</span>
              <span className="text-[10px] font-semibold text-slate-400">({contact.agency.split(' ')[0]})</span>
            </a>
          ))}

          {onOpenDirectory && (
            <button
              type="button"
              onClick={onOpenDirectory}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              <span>All Numbers</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
