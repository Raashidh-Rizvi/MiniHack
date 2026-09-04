import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  PlusCircle,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Users,
  Compass,
  Waves,
  Droplet,
  Trash2,
  Lightbulb,
  ShieldCheck,
  TrendingUp,
  Activity,
  BarChart3,
  ArrowUpRight,
} from 'lucide-react';
import { SriLankanLion } from '../components/common/SriLankanLion';
import { feedService } from '../services/feedService';
import { Issue } from '../types/issue';

export const HomePage: React.FC = () => {
  const [allIssues, setAllIssues] = useState<Issue[]>([]);

  useEffect(() => {
    feedService
      .getIssues()
      .then((data: Issue[]) => setAllIssues(data))
      .catch(() => setAllIssues([]));
  }, []);

  const criticalCount = allIssues.filter((r) => r.priorityLevel === 'CRITICAL').length;
  const resolvedCount = allIssues.filter((r) => r.status === 'RESOLVED').length;

  return (
    <div className="space-y-20 py-6 sm:py-10">
      {/* 4.2 Hero Section Architecture (Two-Column Split Layout with Crimson Radial Glow) */}
      <section className="relative overflow-hidden pt-4 pb-8">
        {/* Ambient Radial Red Glows */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[radial-gradient(circle,rgba(239,68,68,0.22)_0%,transparent_70%)] pointer-events-none blur-2xl" />
        <div className="absolute -top-12 right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(239,68,68,0.18)_0%,transparent_70%)] pointer-events-none blur-3xl" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column (Value Proposition) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Subtitle Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-crimson-500/10 border border-crimson-500/30 text-crimson-500 text-xs font-semibold">
              <span className="flex h-2 w-2 rounded-full bg-crimson-500 animate-ping" />
              <span>Civic-Tech Prioritization Engine 🇱🇰</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold text-heading tracking-tight leading-[1.12]">
              Report. Prioritize.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-crimson-500 to-amber-500">
                Fix.
              </span>
            </h1>

            {/* Two-Sentence Descriptive Subcopy */}
            <p className="text-base sm:text-lg text-muted leading-relaxed max-w-xl">
              Transform local neighborhood complaints into a deterministic, ranked <span className="text-heading font-semibold underline decoration-crimson-500 decoration-2">Community Priority Queue</span>. 
              Equipping residents and local authorities with transparent impact scoring so urgent hazards are fixed first.
            </p>

            {/* Dual CTA Group (Section 7.1) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                to="/report"
                className="px-7 py-3.5 rounded-full text-white font-semibold text-sm bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-[0_4px_20px_rgba(239,68,68,0.45)] hover:shadow-[0_4px_28px_rgba(239,68,68,0.65)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report an Issue</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/issues"
                className="px-6 py-3.5 rounded-full text-muted hover:text-heading font-semibold text-sm border border-subtle hover:border-crimson-500/40 hover:bg-surface-elevated transition-all flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4 text-crimson-500" />
                <span>Explore Community Feed</span>
              </Link>
            </div>

            {/* Key Micro-indicators */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-muted">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Deterministic Scoring</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-crimson-500" />
                <span>Transparent Audit Trail</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-sky-400" />
                <span>Mobile-First Intake</span>
              </span>
            </div>
          </div>

          {/* Right Column (Hero Preview Dashboard - Section 4.2) */}
          <div className="lg:col-span-5 relative">
            {/* Ambient Background Glow Behind Card */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(239,68,68,0.30)_0%,transparent_70%)] blur-2xl pointer-events-none transform -rotate-3 scale-105" />

            {/* High-Tech Dashboard Floating Card */}
            <div className="relative rounded-3xl p-6 glass-panel border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-5 transition-transform duration-300 hover:scale-[1.02]">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-subtle pb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="w-3 h-3 rounded-full bg-crimson-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-heading">
                    Live Priority Queue
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-elevated text-muted border border-subtle">
                  REAL-TIME
                </span>
              </div>

              {/* Metric Hero Snippet */}
              <div className="p-4 rounded-2xl bg-surface-elevated border border-subtle flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-muted block">Highest Ranked Need</span>
                  <p className="text-sm font-bold text-heading truncate max-w-[200px]">Hazardous Pothole Bus Lane</p>
                  <span className="text-[11px] text-muted">Peradeniya Rd, Kandy</span>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                    94 SCORE
                  </span>
                  <p className="text-[10px] text-rose-400 font-bold uppercase mt-1">CRITICAL</p>
                </div>
              </div>

              {/* Sparkline & Mini Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-surface border border-subtle">
                  <div className="flex items-center space-x-1 text-muted text-[10px] uppercase font-bold mb-1">
                    <SriLankanLion size={12} color="#EF4444" accentColor="#991B1B" />
                    <span>Critical</span>
                  </div>
                  <p className="text-lg font-black text-crimson-500">{criticalCount}</p>
                </div>

                <div className="p-3 rounded-xl bg-surface border border-subtle">
                  <div className="flex items-center space-x-1 text-muted text-[10px] uppercase font-bold mb-1">
                    <TrendingUp className="w-3 h-3 text-amber-500" />
                    <span>In Review</span>
                  </div>
                  <p className="text-lg font-black text-amber-400">04</p>
                </div>

                <div className="p-3 rounded-xl bg-surface border border-subtle">
                  <div className="flex items-center space-x-1 text-muted text-[10px] uppercase font-bold mb-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>Resolved</span>
                  </div>
                  <p className="text-lg font-black text-emerald-400">{resolvedCount}</p>
                </div>
              </div>

              {/* Simulated Impact Sparkline Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] text-muted font-medium">
                  <span>Community Priority Distribution</span>
                  <span className="text-crimson-500 font-bold">88.4% Efficiency</span>
                </div>
                <div className="h-2 w-full rounded-full bg-surface-elevated overflow-hidden flex">
                  <div className="h-full bg-crimson-500 w-[45%]" />
                  <div className="h-full bg-amber-500 w-[25%]" />
                  <div className="h-full bg-sky-500 w-[15%]" />
                  <div className="h-full bg-emerald-500 w-[15%]" />
                </div>
              </div>

              {/* Card Footer Link */}
              <Link
                to="/my-reports"
                className="w-full py-2.5 rounded-xl bg-surface border border-subtle hover:border-crimson-500/40 text-center text-xs font-semibold text-heading flex items-center justify-center space-x-1.5 transition-colors"
              >
                <span>Inspect My Submissions</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-crimson-500" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4.5 Social Proof / Trust Bar */}
      <section className="pt-2 pb-6 border-y border-subtle">
        <div className="text-center space-y-4">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted">
            TRUSTED ACROSS SRI LANKAN MUNICIPALITIES & NEIGHBORHOODS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75 hover:opacity-100 transition-opacity">
            <span className="font-extrabold text-sm sm:text-base tracking-wider text-muted hover:text-heading transition-colors">
              🏛️ MATALE MUNICIPAL COUNCIL
            </span>
            <span className="font-extrabold text-sm sm:text-base tracking-wider text-muted hover:text-heading transition-colors">
              🏛️ KANDY URBAN DEVELOPMENT
            </span>
            <span className="font-extrabold text-sm sm:text-base tracking-wider text-muted hover:text-heading transition-colors">
              🏛️ COLOMBO METRO ZONES
            </span>
            <span className="font-extrabold text-sm sm:text-base tracking-wider text-muted hover:text-heading transition-colors">
              🏛️ GALLE HERITAGE WARD
            </span>
          </div>
        </div>
      </section>

      {/* 4.3 3-Column Top Feature Cards (Section 7.2 Markup Pattern) */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-heading">
            Enterprise Civic Governance
          </h2>
          <p className="text-sm text-muted">
            Built from the ground up for high-impact decision making and neighborhood collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: 60-Second Citizen Intake */}
          <div className="p-6 rounded-2xl bg-surface border border-subtle hover:border-red-500/40 transition-all duration-300 group hover:shadow-card-glow">
            {/* Glowing Crimson Icon Badge (Section 7.2) */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-[0_4px_16px_rgba(239,68,68,0.4)] flex items-center justify-center text-white mb-4 group-hover:scale-105 transition-transform duration-300">
              <PlusCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-heading mb-2">60-Second Citizen Intake</h3>
            <p className="text-sm text-muted leading-relaxed">
              Mobile-first responsive forms with real-time field validation, civic category routing, and instant priority previews.
            </p>
          </div>

          {/* Card 2: Deterministic Impact Scoring */}
          <div className="p-6 rounded-2xl bg-surface border border-subtle hover:border-red-500/40 transition-all duration-300 group hover:shadow-card-glow">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-[0_4px_16px_rgba(239,68,68,0.4)] flex items-center justify-center text-white mb-4 group-hover:scale-105 transition-transform duration-300">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-heading mb-2">Deterministic Priority Engine</h3>
            <p className="text-sm text-muted leading-relaxed">
              Transparent 4-factor formula: Severity (40%) + Population (30%) + Urgency (20%) + Report Age (10%) eliminating political bias.
            </p>
          </div>

          {/* Card 3: Resident Self-Service Lifecycle */}
          <div className="p-6 rounded-2xl bg-surface border border-subtle hover:border-red-500/40 transition-all duration-300 group hover:shadow-card-glow">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-[0_4px_16px_rgba(239,68,68,0.4)] flex items-center justify-center text-white mb-4 group-hover:scale-105 transition-transform duration-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-heading mb-2">Self-Service Lifecycle</h3>
            <p className="text-sm text-muted leading-relaxed">
              Complete resident control to view, correct, update, or withdraw filed reports before final municipal resolution.
            </p>
          </div>
        </div>
      </section>

      {/* 4.4 4-Column Category Cards ("Civic Categories" - Section 7.3 Markup Pattern) */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-heading">Civic Problem Domains</h2>
            <p className="text-xs sm:text-sm text-muted">Direct dispatch routes to local authority departments</p>
          </div>
          <Link
            to="/report"
            className="text-xs sm:text-sm font-semibold text-crimson-500 hover:text-crimson-600 flex items-center space-x-1"
          >
            <span>Report a problem now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Compass className="w-7 h-7" />,
              title: 'Road Infrastructure',
              desc: 'Potholes, broken culverts, and roadway erosion risking commuter safety.',
              cat: 'ROAD',
            },
            {
              icon: <Waves className="w-7 h-7" />,
              title: 'Drainage & Floods',
              desc: 'Clogged canal networks, flash flooding, and monsoon water stagnation.',
              cat: 'DRAINAGE',
            },
            {
              icon: <Droplet className="w-7 h-7" />,
              title: 'Water Supply',
              desc: 'Main pipeline bursts, low pressure zones, and drinking water disruptions.',
              cat: 'WATER',
            },
            {
              icon: <Trash2 className="w-7 h-7" />,
              title: 'Waste Management',
              desc: 'Uncollected domestic refuse, illegal dumpsites, and bin overflow.',
              cat: 'WASTE',
            },
            {
              icon: <Lightbulb className="w-7 h-7" />,
              title: 'Street Lighting',
              desc: 'Dark pedestrian lanes, blown sodium lamps, and faulty junction lighting.',
              cat: 'STREETLIGHT',
            },
            {
              icon: <AlertTriangle className="w-7 h-7" />,
              title: 'Traffic Hazards',
              desc: 'Blind turns, damaged road signs, and high-speed school crossing risks.',
              cat: 'TRAFFIC',
            },
            {
              icon: <Users className="w-7 h-7" />,
              title: 'Public Amenities',
              desc: 'Bus stop shelter damage, broken railings, and playground maintenance.',
              cat: 'OTHER',
            },
            {
              icon: <Sparkles className="w-7 h-7" />,
              title: 'Environmental Risks',
              desc: 'Fallen roadside trees, soil movement, and dengue mosquito breeding zones.',
              cat: 'ENVIRONMENT',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-surface border border-subtle hover:border-red-500/30 transition-all duration-300 flex flex-col justify-between h-full group"
            >
              <div>
                <div className="text-red-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h4 className="text-base font-bold text-heading mb-1">{item.title}</h4>
                <p className="text-xs text-muted mb-4 leading-relaxed">{item.desc}</p>
              </div>
              <Link
                to="/report"
                className="inline-flex items-center text-xs font-semibold text-crimson-500 hover:text-crimson-600 transition-colors"
              >
                <span>Report {item.title}</span>
                <span className="ml-1 transition-transform group-hover:translate-x-1">&rarr;</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner (Obsidian Crimson Flare) */}
      <section className="relative overflow-hidden p-8 sm:p-12 rounded-3xl bg-surface border border-subtle flex flex-col md:flex-row items-center justify-between gap-8 shadow-card">
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-[radial-gradient(circle,rgba(239,68,68,0.25)_0%,transparent_70%)] pointer-events-none blur-2xl" />

        <div className="relative space-y-2 z-10">
          <div className="inline-flex items-center space-x-1.5 text-xs text-crimson-500 font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Community Action Needed</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-heading">
            Notice a hazard in your neighborhood?
          </h3>
          <p className="text-xs sm:text-sm text-muted max-w-xl leading-relaxed">
            Every verified report shifts community focus to where it is needed most. File a report in 60 seconds and track transparent progress.
          </p>
        </div>

        <Link
          to="/report"
          className="relative z-10 px-8 py-4 rounded-full text-white font-bold text-sm bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-[0_4px_20px_rgba(239,68,68,0.45)] hover:shadow-[0_4px_28px_rgba(239,68,68,0.65)] whitespace-nowrap active:scale-95 transition-all"
        >
          Submit Community Report 🇱🇰
        </Link>
      </section>
    </div>
  );
};
