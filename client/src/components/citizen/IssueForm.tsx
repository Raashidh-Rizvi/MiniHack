import React, { useState, useEffect } from 'react';
import { CategoryType, Severity, IssueCreateDTO, Issue, PriorityLevel } from '../../types/issue';
import { calculatePriorityScore, getPriorityBadgeColor, getPriorityScoreColor, PriorityBreakdown } from '../../utils/priority';
import { LocationPickerMap } from '../map/LocationPickerMap';
import { feedService } from '../../services/feedService';
import { citizenService } from '../../services/citizenService';
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
  CheckCircle2,
  Loader2,
  ChevronDown,
  ChevronUp,
  PhoneCall,
} from 'lucide-react';
import { SriLankanLion } from '../common/SriLankanLion';
import { EmergencyBanner } from '../common/EmergencyBanner';
import { EmergencyModal } from '../common/EmergencyModal';

interface IssueFormProps {
  initialValues?: Partial<IssueCreateDTO>;
  onSubmit: (data: IssueCreateDTO) => Promise<void>;
  submitButtonText?: string;
  isSubmitting?: boolean;
  serverErrors?: Record<string, string>;
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
  serverErrors = {},
}) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [category, setCategory] = useState<CategoryType>(initialValues?.category || 'ROAD');
  const [location, setLocation] = useState(initialValues?.location || '');
  const [latitude, setLatitude] = useState<number | null>(initialValues?.latitude || null);
  const [longitude, setLongitude] = useState<number | null>(initialValues?.longitude || null);
  const [severity, setSeverity] = useState<Severity>(initialValues?.severity || 'HIGH');
  const [peopleAffected, setPeopleAffected] = useState<number>(initialValues?.peopleAffected || 50);
  const [nearbyIssues, setNearbyIssues] = useState<Issue[]>([]);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Load existing issues to show on the map so user can see nearby reported problems
  useEffect(() => {
    feedService
      .getIssues()
      .then((data) => setNearbyIssues(data || []))
      .catch((e) => console.warn('Could not load nearby issues for map:', e));
  }, []);

  // Merge server errors into validation errors when passed
  useEffect(() => {
    if (serverErrors && Object.keys(serverErrors).length > 0) {
      setValidationErrors((prev) => ({ ...prev, ...serverErrors }));
    }
  }, [serverErrors]);

  // Dynamic Priority Score live estimation connected to the Priority Engine
  const [enginePriority, setEnginePriority] = useState<{
    score: number;
    level: PriorityLevel;
    breakdown: PriorityBreakdown;
  }>(() => calculatePriorityScore(severity, peopleAffected, 0));
  const [isEngineComputing, setIsEngineComputing] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  useEffect(() => {
    // Immediate synchronous local estimate so UI responds instantaneously with zero latency
    const local = calculatePriorityScore(severity, peopleAffected, 0);
    setEnginePriority(local);

    let active = true;
    setIsEngineComputing(true);

    const timer = setTimeout(() => {
      citizenService
        .estimatePriority({ severity, peopleAffected })
        .then((remote) => {
          if (active) {
            setEnginePriority(remote);
            setIsEngineComputing(false);
          }
        })
        .catch(() => {
          if (active) setIsEngineComputing(false);
        });
    }, 120);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [severity, peopleAffected]);

  const priorityBadge = getPriorityBadgeColor(enginePriority.level);
  const priorityScoreColor = getPriorityScoreColor(enginePriority.level);

  // Field validation rules
  const getFieldErrors = (): Record<string, string> => {
    const errs: Record<string, string> = {};

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      errs.title = 'Title is required.';
    } else if (trimmedTitle.length < 5) {
      errs.title = 'Title must be at least 5 characters long.';
    } else if (trimmedTitle.length > 100) {
      errs.title = 'Title cannot exceed 100 characters.';
    }

    const trimmedLocation = location.trim();
    if (!trimmedLocation) {
      errs.location = 'Neighborhood or street location is required.';
    } else if (trimmedLocation.length < 3) {
      errs.location = 'Please specify a valid neighborhood location or landmark (at least 3 characters).';
    } else if (trimmedLocation.length > 120) {
      errs.location = 'Location cannot exceed 120 characters.';
    }

    const trimmedDesc = description.trim();
    if (!trimmedDesc) {
      errs.description = 'Detailed description is required.';
    } else if (trimmedDesc.length < 10) {
      errs.description = 'Description must be at least 10 characters long to provide sufficient context.';
    } else if (trimmedDesc.length > 1000) {
      errs.description = 'Description cannot exceed 1000 characters.';
    }

    if (!peopleAffected || isNaN(Number(peopleAffected)) || Number(peopleAffected) < 1) {
      errs.peopleAffected = 'Estimated people affected must be a positive number of at least 1.';
    }

    return errs;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = getFieldErrors();
    setValidationErrors((prev) => ({
      ...prev,
      [field]: errs[field] || '',
    }));
  };

  const handleChangeField = (field: string, val: string | number) => {
    if (field === 'title') setTitle(String(val));
    if (field === 'location') setLocation(String(val));
    if (field === 'description') setDescription(String(val));
    if (field === 'peopleAffected') setPeopleAffected(Number(val));

    // Clear error for this field as user types
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      title: true,
      location: true,
      description: true,
      peopleAffected: true,
    });

    const errs = getFieldErrors();
    setValidationErrors(errs);

    if (Object.keys(errs).length > 0) {
      return;
    }

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      category,
      location: location.trim(),
      latitude,
      longitude,
      severity,
      peopleAffected: Number(peopleAffected),
    });
  };

  // Field validity flags
  const isTitleValid = title.trim().length >= 5 && title.trim().length <= 100;
  const isLocationValid = location.trim().length >= 3 && location.trim().length <= 120;
  const isDescriptionValid = description.trim().length >= 10 && description.trim().length <= 1000;

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Live Priority Score Preview Widget */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent border border-red-500/20 transition-all shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 text-red-500 flex items-center justify-center flex-shrink-0 shadow-sm shadow-red-500/10">
              <SriLankanLion size={24} color="#EF4444" accentColor="#991B1B" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-red-600 dark:text-red-400">
                  Deterministic Priority Engine
                </span>
                {isEngineComputing ? (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-500/10 text-red-500 animate-pulse">
                    Computing...
                  </span>
                ) : (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    Live Active
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Formula: Severity (40%) + Population (30%) + Urgency (20%) + Baseline Age (10%)
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 flex-shrink-0 sm:self-center">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap transition-all duration-300 ${priorityBadge.bg} ${priorityBadge.text} ${priorityBadge.border} ${priorityBadge.glow}`}
            >
              {enginePriority.level} Priority
            </span>
            <div className="flex items-baseline whitespace-nowrap">
              <span className={`text-2xl font-black tabular-nums transition-colors duration-300 ${priorityScoreColor}`}>
                {enginePriority.score}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium ml-1">/ 100</span>
            </div>
            <button
              type="button"
              onClick={() => setShowBreakdown((prev) => !prev)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-elevated transition-colors cursor-pointer"
              title={showBreakdown ? 'Hide engine formula breakdown' : 'Show engine formula breakdown'}
              aria-expanded={showBreakdown}
            >
              {showBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Dynamic Engine Factor Breakdown Drawer */}
        {showBreakdown && (
          <div className="pt-3 border-t border-red-500/15 animate-fadeIn">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-white/70 dark:bg-surface border border-slate-200/80 dark:border-white/10">
                <div className="text-[10px] uppercase font-bold text-slate-400">Severity (40%)</div>
                <div className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">
                  +{enginePriority.breakdown.severityScore} pts
                </div>
                <div className="text-[10px] text-slate-400">Weight: {severity} ({enginePriority.breakdown.raw?.severity ?? 50})</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/70 dark:bg-surface border border-slate-200/80 dark:border-white/10">
                <div className="text-[10px] uppercase font-bold text-slate-400">Population (30%)</div>
                <div className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">
                  +{enginePriority.breakdown.impactScore} pts
                </div>
                <div className="text-[10px] text-slate-400">{peopleAffected} residents</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/70 dark:bg-surface border border-slate-200/80 dark:border-white/10">
                <div className="text-[10px] uppercase font-bold text-slate-400">Urgency (20%)</div>
                <div className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">
                  +{enginePriority.breakdown.urgencyScore} pts
                </div>
                <div className="text-[10px] text-slate-400">Aligned with severity</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/70 dark:bg-surface border border-slate-200/80 dark:border-white/10">
                <div className="text-[10px] uppercase font-bold text-slate-400">Baseline Age (10%)</div>
                <div className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">
                  +{enginePriority.breakdown.ageScore} pts
                </div>
                <div className="text-[10px] text-slate-400">Initial intake baseline</div>
              </div>
            </div>
            <div className="mt-2 text-right">
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                Sum: {enginePriority.breakdown.severityScore} + {enginePriority.breakdown.impactScore} + {enginePriority.breakdown.urgencyScore} + {enginePriority.breakdown.ageScore} = <strong className={priorityScoreColor}>{enginePriority.score} pts ({enginePriority.level})</strong>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 1. Civic Category */}
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
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-start justify-between cursor-pointer ${
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
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label htmlFor="issue-title" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            2. Issue Title / Problem Summary <span className="text-red-500">*</span>
          </label>
          <span className={`text-[11px] ${title.length > 100 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
            {title.length} / 100
          </span>
        </div>
        <div className="relative">
          <input
            id="issue-title"
            type="text"
            value={title}
            onChange={(e) => handleChangeField('title', e.target.value)}
            onBlur={() => handleBlur('title')}
            maxLength={100}
            placeholder="e.g., Blocked Drainage Culvert Near Matale Hindu College"
            className={`w-full px-4 py-3 pr-10 rounded-2xl bg-slate-50 dark:bg-surface-elevated border text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
              touched.title && validationErrors.title
                ? 'border-red-500 focus:ring-red-500/30'
                : touched.title && isTitleValid
                ? 'border-emerald-500 focus:ring-emerald-500/30'
                : 'border-slate-200 dark:border-white/10 focus:ring-red-500/30 focus:border-red-500'
            }`}
          />
          {touched.title && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
              {validationErrors.title ? (
                <AlertCircle className="w-4 h-4 text-red-500" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              )}
            </div>
          )}
        </div>
        {touched.title && validationErrors.title && (
          <p className="text-xs text-red-500 font-medium flex items-center space-x-1 mt-1">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{validationErrors.title}</span>
          </p>
        )}
      </div>

      {/* 3. Location & Area Selector with OpenStreetMap Leaflet */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="issue-location" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            3. Pinpoint Problem Location & Address <span className="text-red-500">*</span>
          </label>
          <span className={`text-[11px] ${location.length > 120 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
            {location.length} / 120
          </span>
        </div>

        {/* Embedded Interactive OpenStreetMap Leaflet Map */}
        <LocationPickerMap
          initialLocation={location}
          initialLat={latitude}
          initialLng={longitude}
          nearbyIssues={nearbyIssues}
          onLocationSelect={(address, lat, lng) => {
            setLocation(address);
            setLatitude(lat);
            setLongitude(lng);
            if (validationErrors.location) {
              setValidationErrors((prev) => {
                const next = { ...prev };
                delete next.location;
                return next;
              });
            }
          }}
        />

        {/* Address & Street Text Input Field */}
        <div className="space-y-1">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Street Address / Landmark (Auto-filled from map or edit manually):</span>
          </div>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
            <input
              id="issue-location"
              type="text"
              value={location}
              onChange={(e) => handleChangeField('location', e.target.value)}
              onBlur={() => handleBlur('location')}
              maxLength={120}
              placeholder="e.g., Trincomalee Street, Ward 4, Matale"
              className={`w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-50 dark:bg-surface-elevated border text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                touched.location && validationErrors.location
                  ? 'border-red-500 focus:ring-red-500/30'
                  : touched.location && isLocationValid
                  ? 'border-emerald-500 focus:ring-emerald-500/30'
                  : 'border-slate-200 dark:border-white/10 focus:ring-red-500/30 focus:border-red-500'
              }`}
            />
            {touched.location && (
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                {validationErrors.location ? (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                )}
              </div>
            )}
          </div>
          {touched.location && validationErrors.location && (
            <p className="text-xs text-red-500 font-medium flex items-center space-x-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{validationErrors.location}</span>
            </p>
          )}
        </div>

        {/* Quick location chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] text-slate-400">
          <span className="whitespace-nowrap font-medium">Quick suggestions:</span>
          {SRI_LANKAN_COMMUNITY_AREAS.slice(0, 4).map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => {
                setLocation(area);
                if (validationErrors.location) {
                  setValidationErrors((prev) => {
                    const next = { ...prev };
                    delete next.location;
                    return next;
                  });
                }
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-surface-elevated border border-slate-200 dark:border-white/10 hover:border-red-500/40 whitespace-nowrap text-slate-600 dark:text-slate-300 cursor-pointer transition-colors"
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
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
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

        {/* Dynamic Government Emergency Alert - displayed when Critical is selected */}
        {severity === 'CRITICAL' && (
          <div className="mt-3.5 animate-fadeIn">
            <EmergencyBanner
              category={category}
              severity={severity}
              onOpenDirectory={() => setIsEmergencyModalOpen(true)}
            />
          </div>
        )}
      </div>

      {/* 5. People Affected Slider */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="issue-people" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
            <Users className="w-4 h-4 text-amber-500" />
            <span>5. Estimated People Affected in Neighborhood</span>
          </label>
          <span className="text-sm font-extrabold text-red-500 tabular-nums">
            {peopleAffected} residents
          </span>
        </div>
        <input
          id="issue-people"
          type="range"
          min={1}
          max={500}
          step={1}
          value={peopleAffected}
          onChange={(e) => handleChangeField('peopleAffected', Number(e.target.value))}
          className="w-full accent-red-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>1–5 (Street Corner)</span>
          <span>50 (Block)</span>
          <span>150 (Ward)</span>
          <span>300+ (Entire Neighborhood)</span>
        </div>
        {touched.peopleAffected && validationErrors.peopleAffected && (
          <p className="text-xs text-red-500 font-medium flex items-center space-x-1 mt-1">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{validationErrors.peopleAffected}</span>
          </p>
        )}
      </div>

      {/* 6. Detailed Description */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label htmlFor="issue-description" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            6. Detailed Description & Context <span className="text-red-500">*</span>
          </label>
          <span className={`text-[11px] ${description.length > 1000 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
            {description.length} / 1000
          </span>
        </div>
        <div className="relative">
          <textarea
            id="issue-description"
            rows={4}
            value={description}
            onChange={(e) => handleChangeField('description', e.target.value)}
            onBlur={() => handleBlur('description')}
            maxLength={1000}
            placeholder="Describe the issue in detail. For example: what happened, when it started, risks to pedestrians or school children, and landmark indicators..."
            className={`w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-surface-elevated border text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all resize-y ${
              touched.description && validationErrors.description
                ? 'border-red-500 focus:ring-red-500/30'
                : touched.description && isDescriptionValid
                ? 'border-emerald-500 focus:ring-emerald-500/30'
                : 'border-slate-200 dark:border-white/10 focus:ring-red-500/30 focus:border-red-500'
            }`}
          />
        </div>
        {touched.description && validationErrors.description && (
          <p className="text-xs text-red-500 font-medium flex items-center space-x-1 mt-1">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{validationErrors.description}</span>
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 px-6 rounded-full text-sm font-bold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-[0_4px_20px_rgba(239,68,68,0.45)] hover:shadow-[0_4px_28px_rgba(239,68,68,0.65)] transition-all flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-50 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Registering Community Report...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>{submitButtonText}</span>
          </>
        )}
      </button>

      {/* Immediate Emergency Notice & Hotline Trigger */}
      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={() => setIsEmergencyModalOpen(true)}
          className="inline-flex items-center space-x-1.5 text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-bold transition-colors cursor-pointer"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Life-threatening emergency or live hazard? View Official Government Hotlines (119, 1990, 117, 1987)</span>
        </button>
      </div>

      {/* Official Government Emergency Directory Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        initialCategory={category === 'WATER' || category === 'STREETLIGHT' ? 'UTILITY' : category === 'DRAINAGE' ? 'DISASTER' : 'ALL'}
      />
    </form>
  );
};
