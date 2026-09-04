import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Loader2 } from 'lucide-react';
import { Issue, IssueUpdateDTO, Severity } from '../../types/issue';

interface EditIssueModalProps {
  issue: Issue | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: number, data: IssueUpdateDTO) => Promise<void>;
}

export const EditIssueModal: React.FC<EditIssueModalProps> = ({
  issue,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState<Severity>('MEDIUM');
  const [peopleAffected, setPeopleAffected] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (issue) {
      setTitle(issue.title);
      setDescription(issue.description);
      setLocation(issue.location);
      setSeverity(issue.severity);
      setPeopleAffected(issue.peopleAffected);
      setError(null);
    }
  }, [issue]);

  if (!isOpen || !issue) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || title.trim().length < 5) {
      setError('Title must be at least 5 characters long.');
      return;
    }
    if (title.trim().length > 100) {
      setError('Title cannot exceed 100 characters.');
      return;
    }
    if (!location.trim() || location.trim().length < 3) {
      setError('Location / landmark must be at least 3 characters long.');
      return;
    }
    if (location.trim().length > 120) {
      setError('Location cannot exceed 120 characters.');
      return;
    }
    if (!peopleAffected || Number(peopleAffected) < 1) {
      setError('Estimated people affected must be at least 1.');
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      setError('Description must be at least 10 characters long.');
      return;
    }
    if (description.trim().length > 1000) {
      setError('Description cannot exceed 1000 characters.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onUpdate(issue.id, {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        severity,
        peopleAffected: Number(peopleAffected),
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update report.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface border border-subtle rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-subtle pb-4">
          <div>
            <h3 className="text-lg font-bold text-heading">Edit Community Report</h3>
            <p className="text-xs text-muted">Report #{issue.id} • Category: {issue.category}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-surface-elevated text-muted hover:text-heading transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-heading">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full glass-input"
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-heading">
              Location / Landmark
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full glass-input"
              required
            />
          </div>

          {/* Severity & Affected Population */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-heading">
                Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as Severity)}
                className="w-full glass-input"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-heading">
                People Affected
              </label>
              <input
                type="number"
                min="1"
                value={peopleAffected}
                onChange={(e) => setPeopleAffected(parseInt(e.target.value) || 1)}
                className="w-full glass-input"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-heading">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full glass-input resize-none"
              required
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-subtle">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-muted hover:text-heading bg-surface-elevated transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-[0_4px_16px_rgba(239,68,68,0.4)] transition-all flex items-center space-x-1.5"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
