import React, { useState, useMemo } from 'react';
import { CategoryType, Severity, IssueCreateDTO } from '../../types/issue';
import { calculatePriorityScore, getPriorityBadgeColor } from '../../utils/priority';
import {
  Compass,
  Waves,
  Droplet,
  Trash2,
  Lightbulb,
  AlertTriangle,
  Trees,
  HelpCircle,
  MapPin,
  Users,
  Send,
  AlertCircle,
} from 'lucide-react';

interface IssueFormProps {
  initialValues?: Partial<IssueCreateDTO>;
  onSubmit: (data: IssueCreateDTO) => Promise<void>;
  submitButtonText?: string;
  isSubmitting?: boolean;
}

const CATEGORIES: { code: CategoryType; label: string; icon: React.FC<{ className?: string }> }[] = [
  { code: 'ROAD', label: 'Roads & Potholes', icon: Compass },
  { code: 'DRAINAGE', label: 'Drainage & Flooding', icon: Waves },
  { code: 'WATER', label: 'Water Supply', icon: Droplet },
  { code: 'WASTE', label: 'Waste Management', icon: Trash2 },
  { code: 'STREETLIGHT', label: 'Streetlights', icon: Lightbulb },
  { code: 'TRAFFIC', label: 'Traffic & Safety', icon: AlertTriangle },
  { code: 'ENVIRONMENT', label: 'Environment', icon: Trees },
  { code: 'OTHER', label: 'Other Civic', icon: HelpCircle },
];

const SEVERITIES: { code: Severity; label: string; desc: string; color: string }[] = [
  { code: 'LOW', label: 'Low', desc: 'Minor cosmetic or low inconvenience', color: 'border-emerald-500 text-emerald-500' },
  { code: 'MEDIUM', label: 'Medium', desc: 'Noticeable disruption to normal routines', color: 'border-amber-500 text-amber-500' },
  { code: 'HIGH', label: 'High', desc: 'Significant hazard or major obstruction', color: 'border-orange-500 text-orange-500' },
  { code: 'CRITICAL', label: 'Critical', desc: 'Immediate public danger or health emergency', color: 'border-red-500 text-red-500' },
];

const SRI_LANKAN_COMMUNITY_AREAS = [
  'Matale Town, Matale',
  'Trincomalee Street, Matale',
  'Peradeniya Road Junction, Kandy',
  'Dalada Veediya, Kandy',
  'Central Market Road, Colombo 11',
  'Galle Fort Ramparts, Galle',
  'Negombo Beach Road, Gampaha',
  'Kurunegala Clock Tower, Kurunegala',
  'Jaffna Town Center, Jaffna',
];

export const IssueForm: React.FC<IssueFormProps> = ({
  initialValues,
  onSubmit,
  submitButtonText = 'Submit Community Report',
  isSubmitting = false,
}) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [category, setCategory] = useState<CategoryType>(initialValues?.category || 'ROAD');
  const [location, setLocation] = useState(initialValues?.location || '');
  const [severity, setSeverity] = useState<Severity>(initialValues?.severity || 'HIGH');
  const [peopleAffected, setPeopleAffected] = useState<number>(initialValues?.peopleAffected || 50);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dynamic Priority Score live estimation
  const calculatedPriority = useMemo(() => {
    return calculatePriorityScore(severity, peopleAffected, 0);
  }, [severity, peopleAffected]);

  const priorityBadge = getPriorityBadgeColor(calculatedPriority.level);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!title.trim()) {
      errs.title = 'Title is required (min 5 characters).';
    } else if (title.trim().length < 5) {
      errs.title = 'Please provide a descriptive title (at least 5 characters).';
    }

    if (!description.trim()) {
      errs.description = 'Please describe the community problem.';
    } else if (description.trim().length < 15) {
      errs.description = 'Description should be at least 15 characters for authorities.';
    }

    if (!location.trim()) {
      errs.location = 'Please specify the neighborhood or street location.';
    }

    if (!peopleAffected || peopleAffected < 1) {
      errs.peopleAffected = 'Affected population estimate must be at least 1 person.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Live Priority Score Preview Widget */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent border border-red-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-500 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              Live Priority Score Calculation
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic Community Impact: Severity (40%) + Population (30%) + Urgency (20%)
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:self-center">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${priorityBadge.bg} ${priorityBadge.text} ${priorityBadge.border} ${priorityBadge.glow}`}
          >
            {calculatedPriority.level} Priority
          </span>
          <span className="text-xl font-black text-red-500 tabular-nums">
            {calculatedPriority.score}
            <span className="text-xs text-slate-400 font-normal"> / 100</span>
          </span>
        </div>
      </div>

      {/* 1. Category Selection */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
          1. Civic Category <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = category === cat.code;
            return (
              <button
                key={cat.code}
                type="button"
                onClick={() => setCategory(cat.code)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-start justify-between ${
                  isSelected
                    ? 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 shadow-[0_0_16px_rgba(239,68,68,0.2)]'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-surface text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-red-500' : 'text-slate-400'}`} />
                <span className="text-xs font-bold">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Title */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          2. Issue Title / Problem Summary <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Blocked Drainage Culvert Near Matale Hindu College"
          className={`w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-surface-elevated border text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
            errors.title
              ? 'border-red-500 focus:ring-red-500/40'
              : 'border-slate-200 dark:border-white/10 focus:ring-red-500/40 focus:border-red-500'
          }`}
        />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
      </div>

      {/* 3. Location & Area Selector */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
          <span>3. Neighborhood / Street Location <span className="text-red-500">*</span></span>
          <span className="text-[10px] text-slate-400 lowercase">Sri Lankan Town or Ward</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Trincomalee Street, Ward 4, Matale"
            className={`w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-surface-elevated border text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
              errors.location
                ? 'border-red-500 focus:ring-red-500/40'
                : 'border-slate-200 dark:border-white/10 focus:ring-red-500/40 focus:border-red-500'
            }`}
          />
        </div>
        {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}

        {/* Quick location chips */}
        <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] text-slate-400">
          <span className="whitespace-nowrap font-medium">Quick suggestions:</span>
          {SRI_LANKAN_COMMUNITY_AREAS.slice(0, 4).map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => setLocation(area)}
              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-surface border border-slate-200 dark:border-white/5 hover:border-red-500/40 whitespace-nowrap text-slate-600 dark:text-slate-300"
            >
              {area.split(',')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Severity Selection */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
          4. Severity Level <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          {SEVERITIES.map((s) => {
            const isSelected = severity === s.code;
            return (
              <button
                key={s.code}
                type="button"
                onClick={() => setSeverity(s.code)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-red-500 bg-red-500/10 shadow-[0_0_16px_rgba(239,68,68,0.2)]'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-surface hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-black ${isSelected ? 'text-red-500' : 'text-slate-800 dark:text-slate-200'}`}>
                    {s.label}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-red-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{s.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. People Affected Slider */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
            <Users className="w-4 h-4 text-amber-500" />
            <span>5. Estimated People Affected in Neighborhood</span>
          </label>
          <span className="text-sm font-extrabold text-red-500 tabular-nums">
            {peopleAffected} residents
          </span>
        </div>
        <input
          type="range"
          min={5}
          max={500}
          step={5}
          value={peopleAffected}
          onChange={(e) => setPeopleAffected(Number(e.target.value))}
          className="w-full accent-red-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>5 (Single Street)</span>
          <span>50 (Block)</span>
          <span>150 (Ward)</span>
          <span>300+ (Entire Neighborhood)</span>
        </div>
      </div>

      {/* 6. Detailed Description */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          6. Detailed Description & Context <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue in detail. For example: what happened, when it started, risks to pedestrians or school children, and landmark indicators..."
          className={`w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-surface-elevated border text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
            errors.description
              ? 'border-red-500 focus:ring-red-500/40'
              : 'border-slate-200 dark:border-white/10 focus:ring-red-500/40 focus:border-red-500'
          }`}
        />
        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 px-6 rounded-full text-sm font-bold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-[0_4px_20px_rgba(239,68,68,0.45)] hover:shadow-[0_4px_28px_rgba(239,68,68,0.65)] transition-all flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-50 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            <span>Registering Community Report...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>{submitButtonText}</span>
          </>
        )}
      </button>
    </form>
  );
};
