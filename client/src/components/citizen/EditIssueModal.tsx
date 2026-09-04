import React, { useState } from 'react';
import { Issue, IssueUpdateDTO } from '../../types/issue';
import { citizenService } from '../../services/citizenService';
import { X, Save, AlertCircle } from 'lucide-react';

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim()) {
      setError('Please fill in all required fields.');
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
      setError(err.message || 'Failed to update report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-elevated transition-colors"
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
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 mb-4 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-elevated border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Location / Street
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-elevated border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Estimated People Affected
            </label>
            <input
              type="number"
              min={1}
              max={1000}
              value={peopleAffected}
              onChange={(e) => setPeopleAffected(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-elevated border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-elevated border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-surface-elevated"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 shadow-[0_4px_14px_rgba(239,68,68,0.4)] hover:shadow-[0_4px_20px_rgba(239,68,68,0.6)] flex items-center space-x-1.5 transition-all"
            >
              {loading ? (
                <span>Saving...</span>
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
