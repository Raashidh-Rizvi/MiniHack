import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  AlertTriangle,
  CheckCircle2,
  Target,
  Scale,
  Users,
  ShieldCheck,
  Building2,
  MapPin,
  PhoneCall,
  ArrowRight,
  Calculator,
  Sparkles,
  HeartHandshake,
  Clock,
  ShieldAlert,
  Zap,
  Download,
  Printer,
  Code2,
  FileDown,
  Check,
} from 'lucide-react';
import { SriLankanLion } from '../components/common/SriLankanLion';
import { EmergencyModal } from '../components/common/EmergencyModal';
import { generateAboutPdf } from '../utils/generateAboutPdf';

export const AboutPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'why' | 'fixes' | 'goals' | 'focus' | 'importance' | 'team'>('why');
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Interactive Priority Score Playground state
  const [calcSeverity, setCalcSeverity] = useState<number>(4);
  const [calcImpact, setCalcImpact] = useState<number>(5);
  const [calcUrgency, setCalcUrgency] = useState<number>(3);
  const [calcAge, setCalcAge] = useState<number>(2);

  // Priority formula calculation: (Severity * 0.40) + (Impact * 0.30) + (Urgency * 0.20) + (Age * 0.10)
  const calculatedScore = (
    calcSeverity * 0.4 +
    calcImpact * 0.3 +
    calcUrgency * 0.2 +
    calcAge * 0.1
  ).toFixed(2);

  const getScoreBadge = (score: number) => {
    if (score >= 4.0) return { label: 'CRITICAL PRIORITY', color: 'bg-red-500/20 text-red-500 border-red-500/40' };
    if (score >= 3.0) return { label: 'HIGH PRIORITY', color: 'bg-orange-500/20 text-orange-500 border-orange-500/40' };
    if (score >= 2.0) return { label: 'MEDIUM PRIORITY', color: 'bg-sky-500/20 text-sky-500 border-sky-500/40' };
    return { label: 'LOW PRIORITY', color: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/40' };
  };

  const currentBadge = getScoreBadge(parseFloat(calculatedScore));

  const developers = [
    {
      member: 'Member 1',
      name: 'Raashidh M.R',
      id: 'IT24104191',
      role: 'Priority Queue & Feed Discovery',
      branch: 'feature/officer-portal',
      color: 'from-red-500 to-rose-600',
      badgeColor: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
      contributions: [
        'Community Feed Discovery: Neighborhood issue exploration, search, and category filtering',
        'Community Priority Queue: Impact-ranked queue display with real-time score sorting',
        'Community Upvoting & Issue Endorsement system preventing duplicate submissions',
        'Public Priority Score visualization, community engagement, and transparency indicators',
        'REST Endpoints: Community issues discovery feed and upvoting integration',
      ],
    },
    {
      member: 'Member 2',
      name: 'Atheek M.F',
      id: 'IT24103933',
      role: 'Department Officer Portal & Reporting Journey',
      branch: 'feature/citizen-intake',
      color: 'from-teal-500 to-emerald-600',
      badgeColor: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
      contributions: [
        'Department Officer Dashboard (/officer) & assigned municipal issue triage',
        'Complete Reporting Journey: Issue intake form, validation, and Leaflet location selector',
        'Officer field investigation note logging & photographic evidence verification',
        'Status progression controls: REPORTED → UNDER REVIEW → IN PROGRESS → RESOLVED',
        'REST Endpoints: GET /api/officer/queue, PUT /api/officer/issues/:id/status, reporting intake',
      ],
    },
    {
      member: 'Member 3',
      name: 'Ahamed M.A.W',
      id: 'IT24103352',
      role: 'System Administrator',
      branch: 'IT24103352',
      color: 'from-indigo-500 to-violet-600',
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      contributions: [
        'Executive Admin Dashboard (/admin) with cross-district analytics, metrics, and KPIs',
        'Global priority queue moderation and cross-departmental officer workload assignment',
        'Deterministic Community Priority Score mathematical calculation engine',
        'Verified server sessions, token guards, and multi-tier role authorization',
        'REST Endpoints: GET /api/admin/stats, PUT /api/admin/issues/:id/triage, Mongo auth',
      ],
    },
  ];

  const handleDownloadDocumentation = () => {
    try {
      generateAboutPdf();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const tabs = [
    { id: 'why', label: '1. Why This Exists', icon: Compass, summary: 'Sri Lankan local governance realities' },
    { id: 'fixes', label: '2. What It Fixes', icon: CheckCircle2, summary: '5 systemic civic dilemmas solved' },
    { id: 'goals', label: '3. The Core Goal', icon: Target, summary: 'Mission, vision & deterministic scoring' },
    { id: 'focus', label: '4. Strategic Focus', icon: Scale, summary: '3-Tier roles & geospatial queue' },
    { id: 'importance', label: '5. Why It Matters', icon: HeartHandshake, summary: 'Public safety & civic impact' },
    { id: 'team', label: '6. Engineering Team', icon: Users, summary: 'Developers & system creators' },
  ] as const;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* =========================================================================
          HERO SECTION & DOWNLOAD CONTROLS
          ========================================================================= */}
      <section className="relative text-center space-y-6 pt-6 pb-4">
        {/* Ambient Crimson Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-red-600/10 dark:bg-red-500/15 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 shadow-sm">
          <SriLankanLion size={16} color="#EF4444" accentColor="#991B1B" />
          <span>About GramaFix • Civic Intelligence Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Empowering Sri Lankan Communities to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-red-600">
            Report, Prioritize & Fix.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          GramaFix is an open civic coordination platform connecting residents, Grama Niladhari ward officers,
          and municipal councils through transparent deterministic priority queues and real-time lifecycle tracking.
        </p>

        {/* Academic Period & Hackathon Timeline Badge */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-slate-100/90 dark:bg-surface-elevated border border-slate-200 dark:border-white/10 text-xs shadow-sm">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            📅 Academic Period: <span className="text-red-600 dark:text-red-400 font-black">August – September 2026</span>
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600 dark:text-slate-400">
            Module: <strong className="text-slate-800 dark:text-slate-200">SE3090 Frameworks</strong>
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600 dark:text-slate-400">
            Sprint: <strong className="text-slate-800 dark:text-slate-200">September 2026 (Mini Hackathon)</strong>
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
            Submitted: 4th September 2026
          </span>
        </div>

        {/* Action Buttons: Download PDF Documentation & Print */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleDownloadDocumentation}
            className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm liquid-btn-crimson text-white shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>PDF Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Documentation (PDF)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm liquid-btn-glass text-slate-700 dark:text-slate-200 transition-all flex items-center gap-2 cursor-pointer"
            title="Print or export this page as PDF"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print / Save PDF</span>
          </button>
        </div>

        {/* Quick Trust Highlights Pill Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-surface border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-red-500" />
            24 Municipal Councils & 276 Pradeshiya Sabhas
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-surface border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            14,000+ Grama Niladhari Divisions
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-surface border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-red-500" />
            Deterministic Priority Formula
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-surface border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-indigo-500" />
            3 Developers • SE3090 Mini Hackathon
          </span>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE NAVIGATION TABS
          ========================================================================= */}
      <section className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-1.5 bg-slate-100/80 dark:bg-[#121722]/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-3 px-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer text-center sm:text-left ${
                  isActive
                    ? 'liquid-pill-active shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-red-500' : 'text-slate-400'}`} />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            TAB CONTENT 1: WHY THIS IS THERE
            ========================================================================= */}
        {activeTab === 'why' && (
          <div className="bg-white dark:bg-[#121722] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-white/10 shadow-xl space-y-8 animate-fadeIn">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Compass className="w-3.5 h-3.5" />
                <span>The Origin & Civic Context</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Why GramaFix Exists: The Sri Lankan Local Governance Reality
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                In Sri Lanka, local administration is decentralized across 24 Municipal Councils, 41 Urban Councils, 
                276 Pradeshiya Sabhas, and over 14,000 Grama Niladhari divisions. While this institutional structure is 
                extensive, the everyday mechanism for residents to report and resolve civic infrastructure hazards 
                remains fragmented, manual, and opaque.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#181F2E] border border-slate-200 dark:border-white/5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Disorganized Reporting Channels</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Residents rely on handwritten petitions, informal phone calls, personal connections, or heated social media posts. 
                  These scattered complaints lack unique identifiers, GPS locations, or verifiable timestamps.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#181F2E] border border-slate-200 dark:border-white/5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">The Bureaucratic Black Hole</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Once a paper complaint is handed to an office desk or Grama Niladhari officer, citizens have zero visibility 
                  into whether the issue was inspected, forwarded to municipal engineers, or discarded into a filing cabinet.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#181F2E] border border-slate-200 dark:border-white/5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Regional Infrastructure Disparity</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Suburban and rural Pradeshiya Sabha areas frequently get neglected while commercial urban wards receive swift fixes. 
                  GramaFix provides a standardized digital platform to make local governance equitable across all provinces.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-red-500/10 via-rose-500/5 to-transparent border border-red-500/20 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-red-500" />
                <span>The GramaFix Proposition</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                GramaFix was created to replace this broken status quo with an open, modern, and trustworthy civic management 
                system where every Sri Lankan citizen has an audible voice, every hazardous pothole or broken streetlight is 
                geocoded, and municipal authorities are equipped with a clear, impact-sorted workflow.
              </p>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB CONTENT 2: WHAT IT FIXES
            ========================================================================= */}
        {activeTab === 'fixes' && (
          <div className="bg-white dark:bg-[#121722] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-white/10 shadow-xl space-y-8 animate-fadeIn">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg text-xs font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Systemic Pain Points Eradicated</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                What GramaFix Fixes: The Five Broken Dilemmas Solved
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                Traditional civic complaint workflows in Sri Lanka suffer from five critical failure points. 
                GramaFix systematically replaces each failure point with an engineered digital solution.
              </p>
            </div>

            <div className="space-y-4">
              {/* Dilemma 1 */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#181F2E] border border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20">
                      DILEMMA 1
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Lost, Forgotten, and Misplaced Complaints</h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    <strong className="text-red-500">The Problem:</strong> Paper letters and verbal complaints vanish into bureaucratic drawers with zero accountability.
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <strong>GramaFix Fix:</strong> Permanent digital audit trail with unique report IDs, high-resolution photo evidence, timestamp, and geographic coordinates.
                  </p>
                </div>
                <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex-shrink-0 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>100% Traceable</span>
                </div>
              </div>

              {/* Dilemma 2 */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#181F2E] border border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20">
                      DILEMMA 2
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Subjective Prioritization & Political Favoritism</h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    <strong className="text-red-500">The Problem:</strong> Repairs are often expedited based on personal connections, political lobbying, or who shouts loudest.
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <strong>GramaFix Fix:</strong> Transparent mathematical formula based on verified severity (40%), affected population (30%), urgency (20%), and report age (10%).
                  </p>
                </div>
                <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex-shrink-0 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Zero Bias</span>
                </div>
              </div>

              {/* Dilemma 3 */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#181F2E] border border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20">
                      DILEMMA 3
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Duplicate Report Deluges</h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    <strong className="text-red-500">The Problem:</strong> 40 residents call the municipal council regarding the same broken culvert, overwhelming desk operators.
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <strong>GramaFix Fix:</strong> Community Feed with One-Click Upvoting: Neighbors endorse the existing issue, automatically boosting its priority score without cluttering the queue.
                  </p>
                </div>
                <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex-shrink-0 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Community Weight</span>
                </div>
              </div>

              {/* Dilemma 4 */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#181F2E] border border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20">
                      DILEMMA 4
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Zero Transparency on Issue Progress</h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    <strong className="text-red-500">The Problem:</strong> Citizens have no feedback mechanism—did someone inspect it? Are replacement parts ordered? Is it solved?
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <strong>GramaFix Fix:</strong> Clear 4-Stage Public Status Tracking (REPORTED → UNDER REVIEW → IN PROGRESS → RESOLVED) with officer updates and photos.
                  </p>
                </div>
                <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex-shrink-0 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Real-Time Status</span>
                </div>
              </div>

              {/* Dilemma 5 */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#181F2E] border border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20">
                      DILEMMA 5
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Field Officer Triage Chaos</h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    <strong className="text-red-500">The Problem:</strong> Municipal repair crews receive haphazard verbal instructions with no map coordinates or severity filters.
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <strong>GramaFix Fix:</strong> Officer Portal with interactive OpenStreetMap Leaflet pins, department filtering (Roads, Water, Electricity, Sanitation), and quick triage.
                  </p>
                </div>
                <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex-shrink-0 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Optimized Triage</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB CONTENT 3: THE CORE GOAL
            ========================================================================= */}
        {activeTab === 'goals' && (
          <div className="bg-white dark:bg-[#121722] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-white/10 shadow-xl space-y-8 animate-fadeIn">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <Target className="w-3.5 h-3.5" />
                <span>Mission & Mathematical Precision</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                The Core Goal: Civic Transparency Through Deterministic Logic
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                Our vision is to replace subjective guesswork with an objective, data-backed community priority score. 
                Below is the exact deterministic mathematical formula that powers the GramaFix priority engine.
              </p>
            </div>

            {/* Formula Banner */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#181F2E] border border-slate-200 dark:border-white/10 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-black tracking-wider uppercase text-red-500 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4" />
                  GramaFix Deterministic Scoring Formula
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Range: 1.00 (Routine) to 5.00 (Critical Emergency)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#0A0D14] border border-slate-200 dark:border-white/10 font-mono text-xs sm:text-sm md:text-base text-slate-900 dark:text-white overflow-x-auto text-center font-bold">
                Priority Score = (Severity × 0.40) + (Impact × 0.30) + (Urgency × 0.20) + (Age × 0.10)
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-[#121722] border border-slate-200 dark:border-white/5 space-y-1">
                  <span className="font-bold text-red-500">40% Severity</span>
                  <p className="text-slate-500 dark:text-slate-400">Physical danger or structural hazard scale (1–5)</p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-[#121722] border border-slate-200 dark:border-white/5 space-y-1">
                  <span className="font-bold text-orange-500">30% Impact</span>
                  <p className="text-slate-500 dark:text-slate-400">Volume of affected citizens & upvotes (1–5)</p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-[#121722] border border-slate-200 dark:border-white/5 space-y-1">
                  <span className="font-bold text-sky-500">20% Urgency</span>
                  <p className="text-slate-500 dark:text-slate-400">Time-sensitive escalation risk (1–5)</p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-[#121722] border border-slate-200 dark:border-white/5 space-y-1">
                  <span className="font-bold text-emerald-500">10% Age Factor</span>
                  <p className="text-slate-500 dark:text-slate-400">Days elapsed to prevent neglect of older issues</p>
                </div>
              </div>
            </div>

            {/* Interactive Sandbox */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white dark:bg-black/60 border border-red-500/30 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-red-500" />
                    <span>Interactive Priority Engine Simulator</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Adjust the sliders below to see how GramaFix calculates triage priority in real-time.
                  </p>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Calculated Score</span>
                    <span className="text-2xl font-black text-white">{calculatedScore}</span>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border ${currentBadge.color}`}>
                    {currentBadge.label}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
                {/* Severity Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between font-bold">
                    <span>Severity (40%)</span>
                    <span className="text-red-400">{calcSeverity}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={calcSeverity}
                    onChange={(e) => setCalcSeverity(parseInt(e.target.value))}
                    className="w-full accent-red-500 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400">Hazard intensity to life or property</p>
                </div>

                {/* Impact Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between font-bold">
                    <span>Impact (30%)</span>
                    <span className="text-orange-400">{calcImpact}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={calcImpact}
                    onChange={(e) => setCalcImpact(parseInt(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400">Residents affected / endorsements</p>
                </div>

                {/* Urgency Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between font-bold">
                    <span>Urgency (20%)</span>
                    <span className="text-sky-400">{calcUrgency}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={calcUrgency}
                    onChange={(e) => setCalcUrgency(parseInt(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400">Speed of deterioration if untreated</p>
                </div>

                {/* Age Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between font-bold">
                    <span>Age Weight (10%)</span>
                    <span className="text-emerald-400">{calcAge}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={calcAge}
                    onChange={(e) => setCalcAge(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400">Duration in queue waiting for response</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB CONTENT 4: STRATEGIC FOCUS
            ========================================================================= */}
        {activeTab === 'focus' && (
          <div className="bg-white dark:bg-[#121722] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-white/10 shadow-xl space-y-8 animate-fadeIn">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg text-xs font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                <Scale className="w-3.5 h-3.5" />
                <span>Three-Tier Synergy & Spatial Intelligence</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Strategic Focus: Harmonizing Citizens, Officers & Administrators
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                GramaFix brings all civic stakeholders into one seamless operational loop. 
                Each user tier is equipped with specialized tools tailored to their civic role.
              </p>
            </div>

            {/* Three Roles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Role 1: Citizen */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#181F2E] border border-slate-200 dark:border-white/5 space-y-4 hover:border-red-500/40 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center font-bold">
                  <Users className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-red-500 tracking-wider">MEMBER TIER 1</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Citizen & Resident</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    The eyes and ears of Sri Lankan neighborhoods. Citizens discover problems and submit reports with ease.
                  </p>
                </div>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Leaflet GPS interactive map pinpointing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Photo uploads with severity tagging</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>One-click community upvoting / endorsement</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Personal "My Reports" tracking journey</span>
                  </li>
                </ul>
              </div>

              {/* Role 2: Officer */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#181F2E] border border-slate-200 dark:border-white/5 space-y-4 hover:border-teal-500/40 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-500 flex items-center justify-center font-bold">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-teal-500 tracking-wider">MEMBER TIER 2</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Department Officer</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Field engineers, ward supervisors, and Grama Niladhari inspectors who triage and execute repairs.
                  </p>
                </div>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0" />
                    <span>Assigned ward workload & priority queue</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0" />
                    <span>Status management (Under Review / In Progress)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0" />
                    <span>Internal investigation notes & photos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0" />
                    <span>Final resolution verification log</span>
                  </li>
                </ul>
              </div>

              {/* Role 3: Admin */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#181F2E] border border-slate-200 dark:border-white/5 space-y-4 hover:border-indigo-500/40 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">MEMBER TIER 3</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">System Administrator</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Municipal executives overseeing holistic municipal health, policy enforcement, and audit logs.
                  </p>
                </div>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <span>System-wide priority queue moderation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <span>Cross-departmental resource balancing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <span>Verified officer role provisioning & auth</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <span>Audit logs and municipal performance metrics</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Geospatial Focus Highlight */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#181F2E] border border-slate-200 dark:border-white/5 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-7 h-7" />
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Open-Source Leaflet & OpenStreetMap Integration
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  GramaFix utilizes lightweight, open-source Leaflet mapping. This allows users to drop a pin precisely 
                  on the hazardous road section or broken culvert, eliminating proprietary map licensing fees and 
                  ensuring smooth performance on low-bandwidth connections across rural and suburban Sri Lanka.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB CONTENT 5: WHY IT IS IMPORTANT
            ========================================================================= */}
        {activeTab === 'importance' && (
          <div className="bg-white dark:bg-[#121722] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-white/10 shadow-xl space-y-8 animate-fadeIn">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Value & Societal Significance</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Why GramaFix Is Important: Tangible Community Impact
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                Civic infrastructure isn't just about roads and pipes—it is directly tied to human safety, disease control, 
                economic livelihood, and trust in public institutions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#181F2E] border border-slate-200 dark:border-white/5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center font-bold">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Saving Lives & Preventing Disasters</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Submerged culverts during monsoon rains cause flash floods that submerge homes. Open storm drains cause pedestrian 
                  falls and fatal motorcycle accidents. Broken streetlights leave school routes dark. GramaFix surfaces these life-safety 
                  hazards to the top of the queue before tragedy occurs.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#181F2E] border border-slate-200 dark:border-white/5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Dengue Control & Public Sanitation</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Stagnant drainage water and uncollected municipal refuse are primary vector breeding sites for dengue fever mosquitoes. 
                  By enabling residents to immediately log garbage dumps and blocked canals with photographic evidence, public health 
                  crews can clear them rapidly.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#181F2E] border border-slate-200 dark:border-white/5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Maximizing Limited Municipal Budgets</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Local authorities operate with constrained equipment and budgets. The GramaFix deterministic priority engine 
                  ensures municipal crews, asphalt supplies, and backhoes are directed to where they provide the greatest community 
                  benefit rather than being squandered on ad-hoc repairs.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#181F2E] border border-slate-200 dark:border-white/5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Restoring Civic Trust & Active Citizenship</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  When citizens see their reports honored with real-world fixes, civic apathy gives way to active neighborhood pride. 
                  GramaFix restores faith in grassroots democracy and promotes community-driven stewardship across Sri Lanka.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB CONTENT 6: ENGINEERING TEAM & DEVELOPERS
            ========================================================================= */}
        {activeTab === 'team' && (
          <div className="bg-white dark:bg-[#121722] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-white/10 shadow-xl space-y-8 animate-fadeIn">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <Code2 className="w-3.5 h-3.5" />
                <span>Engineered for SE3090 Mini Hackathon</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Meet the Developers Behind GramaFix
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                GramaFix was engineered by a dedicated 3-member development team under Software Engineering Frameworks (SE3090), 
                combining full-stack capabilities across citizen reporting, municipal officer triage, and administrative governance.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {developers.map((dev) => (
                <div
                  key={dev.id}
                  className="p-6 rounded-3xl bg-slate-50 dark:bg-[#181F2E] border border-slate-200 dark:border-white/5 space-y-5 hover:border-red-500/30 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header with Avatar & Student ID */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${dev.color} text-white font-black text-lg flex items-center justify-center shadow-md`}
                        >
                          {dev.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight">
                            {dev.name}
                          </h3>
                          <span className="font-mono text-xs text-slate-500 dark:text-slate-400 font-bold">
                            {dev.id}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg border ${dev.badgeColor}`}>
                        {dev.member}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Primary Responsibility</h4>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {dev.role}
                      </p>
                      <span className="inline-block font-mono text-[11px] text-slate-500 bg-slate-200/60 dark:bg-white/5 px-2 py-0.5 rounded">
                        Branch: {dev.branch}
                      </span>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Contributions</h4>
                      <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                        {dev.contributions.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span className="leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>SE3090 Frameworks</span>
                    <span className="font-bold text-slate-600 dark:text-slate-300">Verified Contributor</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* =========================================================================
          PERSISTENT ENGINEERING TEAM SHOWCASE BANNER
          (Ensures developers are credited on the page even when other tabs are viewed)
          ========================================================================= */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-[#121722] border border-slate-200 dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-red-500 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" />
              Core Engineering Team
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Developed by Raashidh M.R, Atheek M.F & Ahamed M.A.W
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              SE3090 – Software Engineering Frameworks • Academic Period: <strong>August – September 2026</strong> (Submitted: 4th September 2026)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('team')}
              className="px-4 py-2 rounded-xl text-xs font-bold liquid-pill-active shadow-sm transition-all cursor-pointer"
            >
              View Full Team Profiles
            </button>
            <button
              type="button"
              onClick={handleDownloadDocumentation}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 liquid-btn-glass transition-all flex items-center gap-1.5 cursor-pointer"
              title="Download documentation as PDF"
            >
              <FileDown className="w-3.5 h-3.5 text-red-500" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {developers.map((dev) => (
            <div
              key={dev.id}
              className="p-3 rounded-2xl bg-white dark:bg-[#181F2E] border border-slate-200 dark:border-white/5 flex items-center space-x-3"
            >
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${dev.color} text-white font-bold text-xs flex items-center justify-center flex-shrink-0`}
              >
                {dev.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {dev.name}
                </p>
                <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                  {dev.id} • {dev.member}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          ACTION CALL TO ACTION FOOTER BANNER
          ========================================================================= */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-2xl relative overflow-hidden">
        {/* Subtle geometric pattern */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full inline-block">
              Be the Change in Your Neighborhood
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to Report a Problem or Explore Your Community Feed?
            </h3>
            <p className="text-sm text-white/80 leading-relaxed">
              Join thousands of Sri Lankan citizens who are transforming neighborhood complaints into collective action.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={handleDownloadDocumentation}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 bg-white/95 hover:bg-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-red-600" />
              <span>Download Whitepaper (PDF)</span>
            </button>

            <Link
              to="/report"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-sm font-bold text-white liquid-btn-glass border-white/30 shadow-lg transition-all text-center flex items-center justify-center gap-2"
            >
              <span>Report an Issue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/issues"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-sm font-bold text-white liquid-btn-glass border-white/25 transition-all text-center flex items-center justify-center gap-2"
            >
              <span>Explore Feed</span>
            </Link>

            <button
              type="button"
              onClick={() => setEmergencyModalOpen(true)}
              className="w-full sm:w-auto px-4 py-3.5 rounded-2xl text-xs font-bold text-white liquid-btn-glass border-white/30 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Hotlines (119 / 1990)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Global Emergency Modal */}
      <EmergencyModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
      />
    </div>
  );
};

export default AboutPage;
