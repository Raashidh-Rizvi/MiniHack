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
      className={`w-full rounded-2xl border transition-all p-4 sm:p-5 ${
        isCritical
          ? 'bg-gradient-to-r from-red-500/15 via-red-500/10 to-amber-500/10 border-red-500/40 shadow-[0_0_24px_rgba(239,68,68,0.2)]'
          : 'bg-amber-500/10 border-amber-500/30'
      } ${className}`}
    >
      {/* Header with Icon & Badges */}
      <div className="flex items-center space-x-3 mb-2.5">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isCritical
              ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
              : 'bg-amber-500 text-white'
          }`}
        >
          {isCritical ? <ShieldAlert className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
        </div>
        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
          <span
            className={`text-xs font-black uppercase tracking-wider ${
              isCritical ? 'text-red-500 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
            }`}
          >
            {isCritical ? 'Critical Hazard & Emergency Advisory' : 'Civic Safety Notice'}
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-red-500 text-white font-bold tracking-wide">
            Immediate Action Required
          </span>
        </div>
      </div>

      {/* Advisory Text (Full 100% Width) */}
      <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed mb-3.5">
        {isCritical ? (
          <>
            <strong className="text-red-600 dark:text-red-400 font-bold">Do not wait for online ticket triage!</strong> If this issue involves live high-voltage cables, active fires, building collapse, or injuries, dial official government dispatchers immediately:
          </>
        ) : (
          <>
            GramaFix is an asynchronous municipal repair queue. For active hazards or urgent injuries, contact first responders:
          </>
        )}
      </p>

      {/* Quick Hotline Calling Buttons Row (Full Width Flex-Wrap) */}
      <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-red-500/20 dark:border-white/10">
        {contacts.map((contact) => (
          <a
            key={contact.id}
            href={`tel:${contact.number}`}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl liquid-btn-glass text-slate-900 dark:text-white text-xs font-bold transition-all active:scale-95"
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
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl liquid-btn-crimson text-xs font-bold transition-all active:scale-95 cursor-pointer ml-auto sm:ml-0"
          >
            <span>All Numbers</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
