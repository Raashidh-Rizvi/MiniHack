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

  // Real-time live priority preview calculation
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

  // Client-side validation logic
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
      {/* Real-time Priority Preview Badge Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-800/80 to-slate-800/40 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Deterministic Priority Engine Preview
            </h4>
            <p className="text-xs text-slate-400">
              Calculated transparently: Severity (40%) + Affected Population (30%) + Urgency (20%)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-end sm:self-auto">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Impact Score</span>
            <span className="text-xl font-extrabold text-white">{livePriority.score}<span className="text-xs text-slate-400">/100</span></span>
          </div>

          <span
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wide border ${
              livePriority.level === 'CRITICAL'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : livePriority.level === 'HIGH'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : livePriority.level === 'MEDIUM'
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {livePriority.level} Priority
          </span>
        </div>
      </div>

      {/* Title Field */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Issue Title <span className="text-rose-400">*</span>
          </label>
          <span className="text-[11px] text-slate-400">{title.length}/100</span>
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => handleBlur('title')}
          placeholder="e.g. Broken Culvert causing flooding on Trincomalee Street"
          className={`w-full glass-input ${
            touched.title && errors.title ? 'border-rose-500 focus:ring-rose-500/50' : ''
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
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
          Civic Category <span className="text-rose-400">*</span>
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
                    ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md shadow-emerald-500/10 scale-[1.02]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className={`${isSelected ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {cat.icon}
                  </div>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-100">{cat.label}</p>
                  <p className="text-[10px] text-slate-500 truncate">{cat.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Location Input & Quick Suggestions */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
          Location or Landmark <span className="text-rose-400">*</span>
        </label>
        <div className="relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onBlur={() => handleBlur('location')}
            placeholder="e.g. Near Hindu College, Trincomalee Street, Matale"
            className={`w-full glass-input pl-10 ${
              touched.location && errors.location ? 'border-rose-500 focus:ring-rose-500/50' : ''
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
          <span className="text-[11px] text-slate-500 self-center mr-1">Quick Select:</span>
          {QUICK_LOCATIONS.map((loc) => (
            <button
              type="button"
              key={loc}
              onClick={() => setLocation(loc)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
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
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
            Severity Level <span className="text-rose-400">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as Severity[]).map((lvl) => {
              const active = severity === lvl;
              return (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setSeverity(lvl)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                    active
                      ? lvl === 'CRITICAL'
                        ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/25'
                        : lvl === 'HIGH'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/25'
                        : lvl === 'MEDIUM'
                        ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/25'
                        : 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/25'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
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
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Estimated Affected People <span className="text-rose-400">*</span>
            </label>
            <span className="text-xs font-semibold text-emerald-400">{peopleAffected} residents</span>
          </div>

          <div className="relative">
            <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
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
            {[10, 50, 150, 300].map((num) => (
              <button
                type="button"
                key={num}
                onClick={() => setPeopleAffected(num)}
                className={`text-[11px] px-2.5 py-0.5 rounded-lg border transition-colors ${
                  peopleAffected === num
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-slate-200'
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
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Detailed Description <span className="text-rose-400">*</span>
          </label>
          <span className="text-[11px] text-slate-400">{description.length}/1000</span>
        </div>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => handleBlur('description')}
          placeholder="Describe the issue, hazards, when it started, and specific landmarks to help local officials locate and assess it..."
          className={`w-full glass-input resize-none ${
            touched.description && errors.description ? 'border-rose-500 focus:ring-rose-500/50' : ''
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

      {/* Submission CTA Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all flex items-center justify-center space-x-2 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting to Community Queue...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Civic Issue Report</span>
            </>
          )}
        </button>
        <p className="text-[11px] text-center text-slate-500 mt-2.5">
          Reports are immediately prioritized and routed to the public feed and municipal admin queue.
        </p>
      </div>
    </form>
  );
};
