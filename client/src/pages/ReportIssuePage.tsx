import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IssueCreateDTO, Issue } from '../types/issue';
import { citizenService } from '../services/citizenService';
import { useAuth } from '../hooks/useAuth';
import { IssueForm } from '../components/citizen/IssueForm';
import {
  CheckCircle2,
  AlertTriangle,
  Shield,
  FileText,
  Clock,
  Layers,
  PhoneCall,
} from 'lucide-react';
import { SriLankanLion } from '../components/common/SriLankanLion';
import { getPriorityBadgeColor } from '../utils/priority';
import { EmergencyModal } from '../components/common/EmergencyModal';

export const ReportIssuePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [createdIssue, setCreatedIssue] = useState<Issue | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [emergencyModalOpen, setEmergencyModalOpen] = useState<boolean>(false);

  const handleSubmit = async (formData: IssueCreateDTO) => {
    setSubmitting(true);
    setSubmitError(null);
    setFieldErrors({});

    try {
      const payload: IssueCreateDTO = {
        ...formData,
        reportedBy: currentUser.id,
        reportedByName: currentUser.fullName,
      };

      const newIssue = await citizenService.createIssue(payload);
      setCreatedIssue(newIssue);
    } catch (err: any) {
      console.error('Submission failed:', err);
      const msg = err.message || 'Unable to register issue. Please retry.';
      setSubmitError(msg);
      if (err.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Success Confirmation Screen
  if (createdIssue) {
    const badge = getPriorityBadgeColor(createdIssue.priorityLevel);

    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto animate-fadeIn">
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 shadow-2xl text-center relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Success Checkmark */}
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 shadow-[0_0_24px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
            Report Successfully Dispatched
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1 mb-2">
            Issue #{createdIssue.id} Registered
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
            Your community issue has been validated and injected into the public Sri Lankan Community Priority Queue.
          </p>

          {/* Summary Box */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-surface-elevated border border-slate-200 dark:border-white/5 text-left mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400">{createdIssue.category}</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}>
                {createdIssue.priorityLevel} Priority ({createdIssue.priorityScore} pts)
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{createdIssue.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{createdIssue.location}</p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/issues"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 shadow-[0_4px_16px_rgba(239,68,68,0.4)] hover:shadow-[0_4px_24px_rgba(239,68,68,0.6)] transition-all"
            >
              <Layers className="w-4 h-4" />
              <span>View in Community Feed</span>
            </Link>

            <Link
              to="/my-reports"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-full text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-surface-elevated hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Go to My Reports</span>
            </Link>

            <button
              onClick={() => setCreatedIssue(null)}
              className="w-full sm:w-auto text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white py-2"
            >
              Report Another Issue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 mb-2">
          <SriLankanLion size={15} color="#EF4444" accentColor="#991B1B" />
          <span>Citizen Intake Portal (CREATE)</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Report a Neighborhood Problem
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
          Report potholes, blocked drains, water leaks, or streetlights. Your input is transparently ranked for municipal response.
        </p>
      </div>

      {/* Guidelines Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 flex items-start space-x-2.5">
          <Shield className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-slate-900 dark:text-white block">Transparent Algorithm</span>
            <span className="text-slate-500 dark:text-slate-400">Deterministic scoring prevents bias.</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 flex items-start space-x-2.5">
          <Clock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-slate-900 dark:text-white block">Track Progress</span>
            <span className="text-slate-500 dark:text-slate-400">Lifecycle status updates in real-time.</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 flex items-start space-x-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-slate-900 dark:text-white block">Community Endorsement</span>
            <span className="text-slate-500 dark:text-slate-400">Neighbors can upvote your report.</span>
          </div>
        </div>
      </div>

      {/* Emergency Helpline Notice Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-500/10 via-rose-500/5 to-transparent border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-900 dark:text-white block">
              Urgent Public Hazard or Life Emergency?
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              For active fires, fallen live power lines, medical trauma, or flash floods, dial <strong>119</strong> (Police), <strong>1990</strong> (Ambulance), or <strong>117</strong> (Disaster Centre).
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setEmergencyModalOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold whitespace-nowrap self-start sm:self-auto transition-colors cursor-pointer shadow-sm"
        >
          Emergency Directory
        </button>
      </div>

      {/* Main Form Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 shadow-xl relative">
        {submitError && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 mb-6 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        <IssueForm
          onSubmit={handleSubmit}
          isSubmitting={submitting}
          submitButtonText="Submit Community Report"
          serverErrors={fieldErrors}
        />
      </div>

      <EmergencyModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
      />
    </div>
  );
};
