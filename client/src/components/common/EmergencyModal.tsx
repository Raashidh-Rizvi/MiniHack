import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Phone,
  PhoneCall,
  Copy,
  Check,
  AlertTriangle,
  ShieldAlert,
  Flame,
  Zap,
  HeartPulse,
  Info,
} from 'lucide-react';
import { GOVERNMENT_EMERGENCY_CONTACTS } from '../../data/emergencyContacts';
import { SriLankanLion } from './SriLankanLion';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: 'ALL' | 'POLICE' | 'MEDICAL' | 'DISASTER' | 'UTILITY' | 'GENERAL';
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  initialCategory = 'ALL',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Close on Escape key and prevent body scroll when open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = (id: string, num: string) => {
    navigator.clipboard?.writeText(num);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredContacts = selectedCategory === 'ALL'
    ? GOVERNMENT_EMERGENCY_CONTACTS
    : GOVERNMENT_EMERGENCY_CONTACTS.filter((c) => c.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'POLICE':
        return <ShieldAlert className="w-3.5 h-3.5 text-blue-500" />;
      case 'MEDICAL':
        return <HeartPulse className="w-3.5 h-3.5 text-red-500" />;
      case 'DISASTER':
        return <Flame className="w-3.5 h-3.5 text-amber-500" />;
      case 'UTILITY':
        return <Zap className="w-3.5 h-3.5 text-yellow-500" />;
      default:
        return <Info className="w-3.5 h-3.5 text-purple-500" />;
    }
  };

  const modalElement = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-directory-title"
      className="fixed inset-0 z-[99999] overflow-y-auto bg-black/80 backdrop-blur-md p-3 sm:p-6 flex items-start sm:items-center justify-center animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#0E131F] border border-red-500/40 w-full max-w-3xl my-auto max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Emergency Alert Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white px-5 py-4 flex items-center justify-between flex-shrink-0 shadow-md sticky top-0 z-20">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/25 shadow-inner flex-shrink-0">
              <SriLankanLion size={20} color="#FFFFFF" accentColor="#FEE2E2" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded-full">
                  Official Government Hotlines
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              </div>
              <h2 id="emergency-directory-title" className="text-base sm:text-lg font-black tracking-tight leading-tight">
                Sri Lanka National Emergency Response
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close emergency modal"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Guidance Notice */}
        <div className="bg-red-500/10 dark:bg-red-950/40 border-b border-red-500/20 px-5 py-3 flex-shrink-0">
          <div className="flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
              <strong className="font-bold text-red-600 dark:text-red-400">CIVIC DISPATCH NOTICE: </strong>
              GramaFix is an asynchronous municipal repair queue. For active hazards, downed live wires, flash floods, or medical emergencies,{' '}
              <span className="font-bold underline">do not wait for an online ticket</span>. Call the official 24/7 hotlines below immediately.
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-5 pt-3 pb-2 border-b border-slate-200 dark:border-white/10 flex-shrink-0 overflow-x-auto">
          <div className="flex items-center space-x-1.5 min-w-max pb-1">
            {[
              { id: 'ALL', label: 'All Services' },
              { id: 'POLICE', label: 'Police (119)' },
              { id: 'MEDICAL', label: 'Ambulance (1990)' },
              { id: 'DISASTER', label: 'Disaster / Fire (117 / 110)' },
              { id: 'UTILITY', label: 'Electricity / Water (1987 / 1939)' },
              { id: 'GENERAL', label: 'Govt Info (1919)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-red-500 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-surface-elevated text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contact Cards Grid (Scrollable) */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-grow custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredContacts.map((contact) => {
              const isCopied = copiedId === contact.id;
              return (
                <div
                  key={contact.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-surface-elevated border border-slate-200 dark:border-white/10 hover:border-red-500/40 transition-all flex flex-col justify-between shadow-sm"
                >
                  <div>
                    {/* Badge row */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${contact.badgeBg} ${contact.badgeText}`}>
                        {getCategoryIcon(contact.category)}
                        <span>{contact.shortLabel}</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {contact.isTollFree ? 'Toll-Free 24/7' : '24/7'}
                      </span>
                    </div>

                    {/* Hotline Number Display */}
                    <div className="flex items-baseline space-x-2 mb-1">
                      <a
                        href={`tel:${contact.number}`}
                        className="text-2xl font-black text-slate-900 dark:text-white tracking-tight hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center space-x-2"
                      >
                        <PhoneCall className="w-4 h-4 text-red-500 animate-pulse" />
                        <span>{contact.displayNumber}</span>
                      </a>
                    </div>

                    {/* Agency Title */}
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 mb-1 leading-snug">
                      {contact.title}
                    </h4>

                    {/* When to call box */}
                    <div className="p-2 rounded-xl bg-white dark:bg-canvas border border-slate-200/80 dark:border-white/5 text-[11px] text-slate-600 dark:text-slate-300 leading-snug mb-3">
                      <span className="font-bold text-red-600 dark:text-red-400 block text-[10px] uppercase">When to call:</span>
                      {contact.whenToCall}
                    </div>
                  </div>

                  {/* Actions: Dial & Copy */}
                  <div className="flex items-center space-x-2 pt-2 border-t border-slate-200/60 dark:border-white/5">
                    <a
                      href={`tel:${contact.number}`}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call {contact.displayNumber}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy(contact.id, contact.number)}
                      title="Copy Number"
                      className="px-3 py-1.5 rounded-xl bg-slate-200/70 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-500 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info note */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-canvas border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2 flex-shrink-0">
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
            <span>Shortcodes (119, 1990, 117, 110, 1987, 1939, 1919) are free from Dialog, Mobitel, Airtel, Hutch & SLT.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-surface-elevated hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalElement, document.body);
};
