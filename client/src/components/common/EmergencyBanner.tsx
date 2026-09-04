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
      className={`rounded-2xl border transition-all p-4 ${
        isCritical
          ? 'bg-gradient-to-r from-red-500/20 via-red-500/10 to-amber-500/10 border-red-500/50 shadow-[0_0_24px_rgba(239,68,68,0.2)]'
          : 'bg-amber-500/10 border-amber-500/30'
      } ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div className="flex items-start space-x-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
              isCritical
                ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                : 'bg-amber-500 text-white'
            }`}
          >
            {isCritical ? <ShieldAlert className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1 mb-1">
              <span
                className={`text-xs font-black uppercase tracking-wider ${
                  isCritical ? 'text-red-500 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {isCritical ? 'Critical Hazard & Emergency Advisory' : 'Civic Safety Notice'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500 text-white font-black tracking-wide">
                Immediate Action Required
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
              {isCritical ? (
                <>
                  <strong className="text-red-600 dark:text-red-400">Do not wait for online ticket triage!</strong> If this issue involves
                  live high-voltage cables, active fires, building collapse, or injuries, dial official government dispatchers immediately:
                </>
              ) : (
                <>
                  GramaFix is an asynchronous municipal repair queue. For active hazards or urgent injuries, contact first responders:
                </>
              )}
            </p>
          </div>
        </div>

        {/* Quick Dial Buttons with proper labels (Police, Ambulance, Disaster) */}
        <div className="flex flex-wrap items-center gap-2 md:flex-shrink-0">
          {contacts.map((contact) => (
            <a
              key={contact.id}
              href={`tel:${contact.number}`}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-surface-elevated hover:bg-red-50 dark:hover:bg-red-950/40 border border-slate-200 dark:border-white/10 hover:border-red-500/50 text-slate-900 dark:text-white text-xs font-black shadow-sm transition-all active:scale-95"
              title={`Direct call to ${contact.title}`}
            >
              <PhoneCall className="w-3.5 h-3.5 text-red-500" />
              <span>{contact.displayNumber}</span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                ({contact.shortLabel})
              </span>
            </a>
          ))}

          {onOpenDirectory && (
            <button
              type="button"
              onClick={onOpenDirectory}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
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
