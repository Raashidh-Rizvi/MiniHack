import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ArrowLeft, Info } from 'lucide-react';
import { IssueForm } from '../components/issues/IssueForm';
import { citizenService } from '../services/citizenService';
import { IssueCreateDTO } from '../types/issue';
import { useAuth } from '../hooks/useAuth';

export const ReportIssuePage: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleFormSubmit = async (formData: IssueCreateDTO) => {
    try {
      setSubmitting(true);
      setErrorMessage(null);

      const created = await citizenService.createIssue({
        ...formData,
        reportedBy: currentUser.id,
        reportedByName: currentUser.fullName,
      });

      setSuccessMessage(
        `Report #${created.id} submitted successfully! It has been scored with a priority of ${created.priorityScore}/100 (${created.priorityLevel}).`
      );

      // Scroll to top to see confirmation
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Automatically redirect to My Reports after a brief moment
      setTimeout(() => {
        navigate('/my-reports');
      }, 1800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit report. Please try again.';
      setErrorMessage(msg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to previous page</span>
      </button>

      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <span>Citizen Intake Form</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Report a Community Issue 🇱🇰
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Provide accurate details regarding the hazard or infrastructure issue. Every submission is weighted deterministically and added to the public queue.
        </p>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm flex items-start space-x-3 shadow-lg shadow-emerald-500/10 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
          <div>
            <p className="font-bold">Submission Confirmed!</p>
            <p className="text-xs text-emerald-300/90 mt-0.5">{successMessage}</p>
            <p className="text-[11px] text-emerald-400/80 mt-1 font-semibold">Redirecting to your reports...</p>
          </div>
        </div>
      )}

      {/* Error Notification Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-sm flex items-start space-x-3 shadow-lg shadow-rose-500/10">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
          <div>
            <p className="font-bold">Unable to Submit</p>
            <p className="text-xs text-rose-300/90 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Helpful Guidelines Card */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start space-x-3">
        <Info className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-slate-200">Reporting Guidelines:</span>
          <p>
            Be specific with landmarks (e.g. "Opposite Matale Clock Tower bus halt") and estimate how many neighbors are directly affected. This helps calculate a fair community impact score.
          </p>
        </div>
      </div>

      {/* The Intake Form */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <IssueForm onSubmit={handleFormSubmit} isSubmitting={submitting} />
      </div>
    </div>
  );
};
