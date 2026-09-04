import React, { useState, useEffect, useRef } from 'react';
import { X, UserPlus, Users, Building2, Mail, Lock, Phone, MapPin, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { OfficerUser } from '../../services/officerService';
import { createOfficer } from '../../services/adminService';
import { errorMessage } from '../../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  officers: OfficerUser[];
  onOfficerCreated: () => void;
}

const SRI_LANKAN_AREAS = [

  'Matale Town, Matale',
  'Trincomalee Street, Matale',
  'Peradeniya Road, Kandy',
  'Dalada Veediya, Kandy',
  'Colombo Central, Colombo',
  'Galle Fort, Galle',
  'Negombo Municipal, Gampaha',
  'Kurunegala Town, Kurunegala',
  'Jaffna Town Center, Jaffna',
];

export const CreateOfficerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  officers,
  onOfficerCreated,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [communityArea, setCommunityArea] = useState(SRI_LANKAN_AREAS[0]);
  const [phone, setPhone] = useState('');

  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccess('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName.trim() || fullName.trim().length < 3) {
      setError('Officer full name must be at least 3 characters.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('A valid officer email address is required.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createOfficer({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        communityArea: communityArea.trim(),
        phone: phone.trim() || undefined,
      });

      setSuccess(`Officer "${fullName.trim()}" successfully provisioned.`);
      setFullName('');
      setEmail('');
      setPassword('');
      setPhone('');
      onOfficerCreated();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="officer-modal-title"
      className="liquid-modal-backdrop overflow-y-auto p-4 sm:p-6"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="liquid-glass-card max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close button */}
        <button
          id="close-officer-modal"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 id="officer-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">
              Municipal Officer Provisioning
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Authorized administrators can provision field officer accounts for hazard resolution.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-6 border-b border-slate-200 dark:border-white/10 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'create'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Provision New Officer</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'list'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
          >
            <Users className="w-4 h-4" />
            <span>Active Officers ({officers.length})</span>
          </button>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start space-x-3 text-emerald-600 dark:text-emerald-400 text-xs">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{success}</div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start space-x-3 text-red-600 dark:text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{error}</div>
          </div>
        )}

        {/* Tab 1: Provision Form */}
        {activeTab === 'create' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Officer Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <input
                    id="officer-name-input"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Eng. Samantha Silva"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-surface-elevated text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Official Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="officer-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. silva.officer@gramafix.lk"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-surface-elevated text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Temporary Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="officer-password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-surface-elevated text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Mobile Contact (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="officer-phone-input"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 077 123 4567"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-surface-elevated text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Municipal Area */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Jurisdiction / Municipal Ward <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <select
                  id="officer-area-input"
                  value={communityArea}
                  onChange={(e) => setCommunityArea(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-surface-elevated text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                >
                  {SRI_LANKAN_AREAS.map((area) => (
                    <option key={area} value={area} className="dark:bg-slate-900">
                      {area}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-xs font-bold liquid-btn-glass cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="submit-create-officer"
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/25 flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Provisioning Officer...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Officer Account</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Officers List */}
        {activeTab === 'list' && (
          <div className="space-y-3">
            {officers.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No officers currently registered in the directory.
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                {officers.map((off) => (
                  <div
                    key={off.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-surface-elevated border border-slate-200 dark:border-white/10 flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                        <span>{off.fullName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 font-semibold">
                          ID: #{off.id}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-3">
                        <span className="flex items-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span>{off.email}</span>
                        </span>
                        {off.communityArea && (
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{off.communityArea}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        Active Officer
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
