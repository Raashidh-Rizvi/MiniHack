import React, { useState, useMemo } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  MapPin,
  Users,
  Compass,
  Waves,
  Droplet,
  Trash2,
  Lightbulb,
  AlertTriangle,
  Trees,
  HelpCircle,
  Sparkles,
  Send,
  Loader2,
  Flame,
} from 'lucide-react';
import { CategoryType, IssueCreateDTO, Severity } from '../../types/issue';

interface IssueFormProps {
  onSubmit: (data: IssueCreateDTO) => Promise<void>;
  isSubmitting?: boolean;
}

const CATEGORIES: { code: CategoryType; label: string; icon: React.ReactNode; desc: string }[] = [
  { code: 'ROAD', label: 'Roads & Potholes', icon: <Compass className="w-4 h-4" />, desc: 'Damaged asphalt, craters' },
  { code: 'DRAINAGE', label: 'Drainage & Floods', icon: <Waves className="w-4 h-4" />, desc: 'Blocked culverts, overflow' },
  { code: 'WATER', label: 'Water Supply', icon: <Droplet className="w-4 h-4" />, desc: 'Pipe bursts, supply disruption' },
  { code: 'WASTE', label: 'Waste Management', icon: <Trash2 className="w-4 h-4" />, desc: 'Overflowing bins, dumping' },
  { code: 'STREETLIGHT', label: 'Street Lighting', icon: <Lightbulb className="w-4 h-4" />, desc: 'Broken bulbs, dark roads' },
  { code: 'TRAFFIC', label: 'Traffic & Safety', icon: <AlertTriangle className="w-4 h-4" />, desc: 'Blind turns, hazards' },
  { code: 'ENVIRONMENT', label: 'Environment', icon: <Trees className="w-4 h-4" />, desc: 'Fallen trees, erosion' },
  { code: 'OTHER', label: 'Other Concerns', icon: <HelpCircle className="w-4 h-4" />, desc: 'General municipal issues' },
];

const QUICK_LOCATIONS = [
  'Trincomalee Street, Matale',
  'Peradeniya Road Junction, Kandy',
  'Central Market Road, Colombo 11',
  'Rampart Street, Galle Fort',
];

export const IssueForm: React.FC<IssueFormProps> = ({ onSubmit, isSubmitting = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryType>('ROAD');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState<Severity>('MEDIUM');
  const [peopleAffected, setPeopleAffected] = useState<number>(25);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Real-time live priority preview calculation matching backend
  const livePriority = useMemo(() => {
    const sevMap: Record<Severity, number> = {
      LOW: 25,
      MEDIUM: 50,
      HIGH: 75,
      CRITICAL: 100,
    };
    const s = sevMap[severity] || 50;

    let p = 20;
    if (peopleAffected > 300) p = 100;
    else if (peopleAffected >= 151) p = 85;
    else if (peopleAffected >= 51) p = 70;
    else if (peopleAffected >= 11) p = 45;
    else p = 20;

    const u = s; // urgency mirrors severity
    const age = 10; // new report baseline

    const score = Math.round(s * 0.40 + p * 0.30 + u * 0.20 + age * 0.10);
    const clamped = Math.min(100, Math.max(0, score));

    let level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM';
    if (clamped >= 85) level = 'CRITICAL';
    else if (clamped >= 65) level = 'HIGH';
    else if (clamped >= 35) level = 'MEDIUM';
    else level = 'LOW';

    return { score: clamped, level };
  }, [severity, peopleAffected]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Please provide a clear title for the issue.';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters long.';
    } else if (title.trim().length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters.';
    }

    if (!description.trim()) {
      newErrors.description = 'Please describe the problem in detail.';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters so officials understand.';
    }

    if (!location.trim()) {
      newErrors.location = 'Please specify the location or landmark.';
    } else if (location.trim().length < 3) {
      newErrors.location = 'Location name is too short.';
    }

    if (isNaN(peopleAffected) || peopleAffected < 1) {
      newErrors.peopleAffected = 'Affected count must be at least 1 resident.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      title: true,
      description: true,
      location: true,
      peopleAffected: true,
    });

    if (!validate()) return;

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      category,
      location: location.trim(),
      severity,
      peopleAffected: Number(peopleAffected),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Real-time Priority Preview Badge Card with Crimson Accent Glow */}
      <div className="p-4 rounded-2xl bg-surface border border-subtle relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-card">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(239,68,68,0.15)_0%,transparent_70%)] pointer-events-none" />

        <div className="flex items-center space-x-3 z-10">
          <div className="w-10 h-10 rounded-xl bg-crimson-500/15 border border-crimson-500/30 flex items-center justify-center text-crimson-500">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-heading">
              Deterministic Priority Engine Preview
            </h4>
            <p className="text-xs text-muted">
              Severity (40%) + Population Impact (30%) + Urgency (20%) + Baseline Age (10%)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-end sm:self-auto z-10">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-muted block">Est. Impact Score</span>
            <span className="text-2xl font-black text-heading font-mono">
              {livePriority.score}
              <span className="text-xs text-muted font-normal">/100</span>
            </span>
          </div>

          <span
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wide border ${
              livePriority.level === 'CRITICAL'
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-[0_0_12px_rgba(239,68,68,0.25)]'
                : livePriority.level === 'HIGH'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : livePriority.level === 'MEDIUM'
                ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
            }`}
          >
            {livePriority.level} Priority
          </span>
        </div>
      </div>

      {/* Title Field */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold uppercase tracking-wider text-heading">
            Issue Title <span className="text-crimson-500">*</span>
          </label>
          <span className="text-[11px] text-muted font-mono">{title.length}/100</span>
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => handleBlur('title')}
          placeholder="e.g. Broken Culvert causing flooding on Trincomalee Street"
          className={`w-full glass-input ${
            touched.title && errors.title ? 'border-crimson-500 focus:ring-crimson-500/40' : ''
          }`}
          maxLength={100}
        />
        {touched.title && errors.title && (
          <p className="text-xs text-rose-400 flex items-center space-x-1 mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.title}</span>
          </p>
        )}
      </div>

      {/* Category Grid Selection */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-heading block">
          Civic Category <span className="text-crimson-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat.code;
            return (
              <button
                type="button"
                key={cat.code}
                onClick={() => setCategory(cat.code)}
                className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-crimson-500/10 border-crimson-500 text-heading shadow-[0_4px_16px_rgba(239,68,68,0.2)] scale-[1.02]'
                    : 'bg-surface border-subtle text-muted hover:text-heading hover:border-crimson-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className={`${isSelected ? 'text-crimson-500' : 'text-muted'}`}>
                    {cat.icon}
                  </div>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-crimson-500" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-heading">{cat.label}</p>
                  <p className="text-[10px] text-muted truncate">{cat.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Location Input & Quick Suggestions */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-heading block">
          Location or Landmark <span className="text-crimson-500">*</span>
        </label>
        <div className="relative">
          <MapPin className="w-4 h-4 text-muted absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onBlur={() => handleBlur('location')}
            placeholder="e.g. Near Hindu College, Trincomalee Street, Matale"
            className={`w-full glass-input pl-10 ${
              touched.location && errors.location ? 'border-crimson-500 focus:ring-crimson-500/40' : ''
            }`}
          />
        </div>
        {touched.location && errors.location && (
          <p className="text-xs text-rose-400 flex items-center space-x-1 mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.location}</span>
          </p>
        )}

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-[11px] text-muted self-center mr-1">Sri Lankan Areas:</span>
          {QUICK_LOCATIONS.map((loc) => (
            <button
              type="button"
              key={loc}
              onClick={() => setLocation(loc)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-surface border border-subtle hover:border-crimson-500/40 text-muted hover:text-heading transition-colors"
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Severity & Affected Population (2 Column Row) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Severity Radio Options */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-heading block">
            Severity Level <span className="text-crimson-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as Severity[]).map((lvl) => {
              const active = severity === lvl;
              return (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setSeverity(lvl)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-extrabold uppercase tracking-wider border transition-all ${
                    active
                      ? lvl === 'CRITICAL'
                        ? 'bg-rose-500 text-white border-rose-400 shadow-[0_4px_16px_rgba(239,68,68,0.4)]'
                        : lvl === 'HIGH'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_4px_16px_rgba(245,158,11,0.3)]'
                        : lvl === 'MEDIUM'
                        ? 'bg-sky-500 text-white border-sky-400 shadow-[0_4px_16px_rgba(14,165,233,0.3)]'
                        : 'bg-emerald-500 text-white border-emerald-400 shadow-[0_4px_16px_rgba(16,185,129,0.3)]'
                      : 'bg-surface border-subtle text-muted hover:text-heading'
                  }`}
                >
                  {lvl}
                </button>
              );
            })}
          </div>
        </div>

        {/* People Affected Numeric Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-heading">
              Estimated Affected Residents <span className="text-crimson-500">*</span>
            </label>
            <span className="text-xs font-bold text-crimson-500 font-mono">{peopleAffected} people</span>
          </div>

          <div className="relative">
            <Users className="w-4 h-4 text-muted absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="number"
              min="1"
              max="10000"
              value={peopleAffected}
              onChange={(e) => setPeopleAffected(Math.max(1, parseInt(e.target.value) || 1))}
              onBlur={() => handleBlur('peopleAffected')}
              className="w-full glass-input pl-10"
            />
          </div>

          {/* Quick presets */}
          <div className="flex gap-1.5 pt-1">
            {[10, 50, 150, 350].map((num) => (
              <button
                type="button"
                key={num}
                onClick={() => setPeopleAffected(num)}
                className={`text-[11px] px-2.5 py-0.5 rounded-lg border transition-colors ${
                  peopleAffected === num
                    ? 'bg-crimson-500/20 text-crimson-500 border-crimson-500/40 font-bold'
                    : 'bg-surface text-muted border-subtle hover:text-heading'
                }`}
              >
                ~{num}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Description Field */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold uppercase tracking-wider text-heading">
            Detailed Description <span className="text-crimson-500">*</span>
          </label>
          <span className="text-[11px] text-muted font-mono">{description.length}/1000</span>
        </div>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => handleBlur('description')}
          placeholder="Describe the issue, specific hazards, when it started, and clear landmarks to help local officials locate and evaluate it..."
          className={`w-full glass-input resize-none ${
            touched.description && errors.description ? 'border-crimson-500 focus:ring-crimson-500/40' : ''
          }`}
          maxLength={1000}
        />
        {touched.description && errors.description && (
          <p className="text-xs text-rose-400 flex items-center space-x-1 mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.description}</span>
          </p>
        )}
      </div>

      {/* Submission Pill CTA Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-6 rounded-full text-white font-bold text-sm bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-[0_4px_20px_rgba(239,68,68,0.45)] hover:shadow-[0_4px_28px_rgba(239,68,68,0.65)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting to Community Queue...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Civic Issue Report 🇱🇰</span>
            </>
          )}
        </button>
        <p className="text-[11px] text-center text-muted mt-2.5">
          Reports are scored deterministically and dispatched to the public feed and admin priority queue.
        </p>
      </div>
    </form>
  );
};
