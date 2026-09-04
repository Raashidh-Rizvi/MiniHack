import React, { useState, useEffect } from 'react';
import { Issue, IssueUpdateDTO } from '../../types/issue';
import { citizenService } from '../../services/citizenService';
import { X, Save, AlertCircle, Loader2 } from 'lucide-react';

interface EditIssueModalProps {
  issue: Issue | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (updatedIssue: Issue) => void;
}

export const EditIssueModal: React.FC<EditIssueModalProps> = ({
  issue,
  isOpen,
  onClose,
  onUpdated,
}) => {
  if (!isOpen || !issue) return null;

  const [title, setTitle] = useState(issue.title);
  const [description, setDescription] = useState(issue.description);
  const [location, setLocation] = useState(issue.location);
  const [peopleAffected, setPeopleAffected] = useState(issue.peopleAffected);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (issue) {
      setTitle(issue.title);
      setDescription(issue.description);
      setLocation(issue.location);
      setPeopleAffected(issue.peopleAffected);
      setError(null);
      setTouched({});
      setFieldErrors({});
    }
  }, [issue]);

  const validate = (): boolean => {
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
      errs.location = 'Location / Landmark is required.';
    } else if (trimmedLocation.length < 3) {
      errs.location = 'Location must be at least 3 characters long.';
    } else if (trimmedLocation.length > 120) {
      errs.location = 'Location cannot exceed 120 characters.';
    }

    if (!peopleAffected || isNaN(Number(peopleAffected)) || Number(peopleAffected) < 1) {
      errs.peopleAffected = 'Estimated people affected must be at least 1.';
    }

    const trimmedDesc = description.trim();
    if (!trimmedDesc) {
      errs.description = 'Description is required.';
    } else if (trimmedDesc.length < 10) {
      errs.description = 'Description must be at least 10 characters long.';
    } else if (trimmedDesc.length > 1000) {
      errs.description = 'Description cannot exceed 1000 characters.';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      title: true,
      location: true,
      peopleAffected: true,
      description: true,
    });

    if (!validate()) {
      setError('Please resolve the highlighted validation errors.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload: IssueUpdateDTO = {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        peopleAffected: Number(peopleAffected),
      };

      const updated = await citizenService.updateIssue(issue.id, payload);
      onUpdated(updated);
      onClose();
    } catch (err: any) {
      const msg = err.message || 'Failed to update report.';
      setError(msg);
      if (err.fieldErrors) {
        setFieldErrors((prev) => ({ ...prev, ...err.fieldErrors }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  const handleChange = (field: string, val: string | number) => {
    if (field === 'title') setTitle(String(val));
    if (field === 'location') setLocation(String(val));
    if (field === 'peopleAffected') setPeopleAffected(Number(val));
    if (field === 'description') setDescription(String(val));

    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (error) setError(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-elevated transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-red-500">
            Citizen Self-Service (UPDATE)
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Edit Community Report #{issue.id}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            You can update the description, landmark, or affected population estimate.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 mb-4 flex items-center space-x-2 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4" noValidate>
          {/* Title */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="edit-title" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Title <span className="text-red-500">*</span>
              </label>
              <span className={`text-[11px] ${title.length > 100 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                {title.length} / 100
              </span>
            </div>
            <input
              id="edit-title"
              type="text"
              value={title}
              maxLength={100}
              onChange={(e) => handleChange('title', e.target.value)}
              onBlur={() => handleBlur('title')}
              className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-elevated border text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                touched.title && fieldErrors.title
                  ? 'border-red-500 focus:ring-red-500/30'
                  : 'border-slate-200 dark:border-white/10 focus:ring-red-500/30 focus:border-red-500'
              }`}
            />
            {touched.title && fieldErrors.title && (
              <p className="text-xs text-red-500 font-medium flex items-center space-x-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{fieldErrors.title}</span>
              </p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="edit-location" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Location / Street <span className="text-red-500">*</span>
              </label>
              <span className={`text-[11px] ${location.length > 120 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                {location.length} / 120
              </span>
            </div>
            <input
              id="edit-location"
              type="text"
              value={location}
              maxLength={120}
              onChange={(e) => handleChange('location', e.target.value)}
              onBlur={() => handleBlur('location')}
              className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-elevated border text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                touched.location && fieldErrors.location
                  ? 'border-red-500 focus:ring-red-500/30'
                  : 'border-slate-200 dark:border-white/10 focus:ring-red-500/30 focus:border-red-500'
              }`}
            />
            {touched.location && fieldErrors.location && (
              <p className="text-xs text-red-500 font-medium flex items-center space-x-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{fieldErrors.location}</span>
              </p>
            )}
          </div>

          {/* People Affected */}
          <div className="space-y-1">
            <label htmlFor="edit-people" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Estimated People Affected <span className="text-red-500">*</span>
            </label>
            <input
              id="edit-people"
              type="number"
              min={1}
              max={50000}
              value={peopleAffected}
              onChange={(e) => handleChange('peopleAffected', e.target.value)}
              onBlur={() => handleBlur('peopleAffected')}
              className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-elevated border text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                touched.peopleAffected && fieldErrors.peopleAffected
                  ? 'border-red-500 focus:ring-red-500/30'
                  : 'border-slate-200 dark:border-white/10 focus:ring-red-500/30 focus:border-red-500'
              }`}
            />
            {touched.peopleAffected && fieldErrors.peopleAffected && (
              <p className="text-xs text-red-500 font-medium flex items-center space-x-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{fieldErrors.peopleAffected}</span>
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="edit-desc" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Description <span className="text-red-500">*</span>
              </label>
              <span className={`text-[11px] ${description.length > 1000 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                {description.length} / 1000
              </span>
            </div>
            <textarea
              id="edit-desc"
              rows={4}
              value={description}
              maxLength={1000}
              onChange={(e) => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-elevated border text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all resize-y ${
                touched.description && fieldErrors.description
                  ? 'border-red-500 focus:ring-red-500/30'
                  : 'border-slate-200 dark:border-white/10 focus:ring-red-500/30 focus:border-red-500'
              }`}
            />
            {touched.description && fieldErrors.description && (
              <p className="text-xs text-red-500 font-medium flex items-center space-x-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{fieldErrors.description}</span>
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-surface-elevated cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 shadow-[0_4px_14px_rgba(239,68,68,0.4)] hover:shadow-[0_4px_20px_rgba(239,68,68,0.6)] flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
