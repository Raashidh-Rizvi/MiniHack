import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Sparkles,
  Cpu,
  Cloud,
  Compass,
  Waves,
  Droplet,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { calculatePriorityScore, getPriorityBadgeColor } from '../utils/priority';
import { Severity } from '../types/issue';

export const LandingPage: React.FC = () => {
  // Interactive Hero Calculator State
  const [calcSeverity, setCalcSeverity] = useState<Severity>('HIGH');
  const [calcPeople, setCalcPeople] = useState<number>(120);

  const previewScore = calculatePriorityScore(calcSeverity, calcPeople, 12);
  const previewBadge = getPriorityBadgeColor(previewScore.level);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* =========================================================================
          HERO SECTION (2-Column Split matching Reference Architecture)
          ========================================================================= */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Ambient Crimson Radial Flare behind Hero Mockup */}
        <div className="absolute top-10 right-0 w-[550px] h-[550px] bg-red-600/15 dark:bg-red-500/20 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-1/2 left-0 w-[350px] h-[350px] bg-red-600/10 dark:bg-red-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Proposition & Dual CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 shadow-[0_0_16px_rgba(239,68,68,0.15)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GramaFix® Civic Intelligence Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              Transform Your Data into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">
                Unstoppable Community Action.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Make better municipal decisions, drive transparent civic triage, and fix neighborhood problems with Sri Lanka's leading community prioritization engine.
            </p>

            {/* Dual CTA Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/report"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-[0_4px_24px_rgba(239,68,68,0.45)] hover:shadow-[0_4px_32px_rgba(239,68,68,0.65)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 text-center"
              >
                Report an Issue
              </Link>

              <Link
                to="/issues"
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center justify-center space-x-1 group text-center"
              >
                <span className="underline decoration-slate-300 dark:decoration-slate-700 underline-offset-4 group-hover:decoration-red-500">
                  Explore Community Feed
                </span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Trust highlights */}
            <div className="pt-4 flex items-center justify-center lg:justify-start space-x-6 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-red-500" />
                <span>Deterministic Scoring</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-red-500" />
                <span>Zero Microservices Overhead</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-red-500" />
                <span>Sri Lankan Context</span>
              </div>
            </div>
          </div>

          {/* Right Column: Perspective Analytics Dashboard Preview Card */}
          <div className="lg:col-span-6 relative">
            {/* Perspective Card Container */}
            <div className="relative rounded-3xl bg-slate-900 dark:bg-surface/90 border border-slate-700/60 dark:border-white/10 shadow-[0_24px_50px_-12px_rgba(239,68,68,0.25)] p-5 sm:p-7 backdrop-blur-xl text-white">
              {/* Dashboard Mockup Top Bar */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 ml-2">GramaFix Executive Dashboard</span>
                </div>
                <div className="flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                  <span>Live Queue</span>
                </div>
              </div>

              {/* Mini Sparkline Chart simulation */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-[10px] text-slate-400">Total Reports</div>
                  <div className="text-xl font-bold text-white mt-0.5 tabular-nums">412</div>
                  <div className="text-[10px] text-emerald-400 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-0.5" /> +18% this week
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-[10px] text-slate-400">Avg Priority Score</div>
                  <div className="text-xl font-bold text-red-400 mt-0.5 tabular-nums">78.4</div>
                  <div className="text-[10px] text-red-400/80 mt-1">High Severity</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-[10px] text-slate-400">Resolved Rate</div>
                  <div className="text-xl font-bold text-white mt-0.5 tabular-nums">92%</div>
                  <div className="text-[10px] text-sky-400 mt-1">Under 48 hours</div>
                </div>
              </div>

              {/* Interactive priority simulation inside preview */}
              <div className="p-4 rounded-2xl bg-black/40 border border-red-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Live Impact Simulation</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${previewBadge.bg} ${previewBadge.text} ${previewBadge.border}`}>
                    Score: {previewScore.score}/100 ({previewScore.level})
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Severity: {calcSeverity}</span>
                    <div className="flex space-x-1">
                      {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const).map((sev) => (
                        <button
                          key={sev}
                          type="button"
                          onClick={() => setCalcSeverity(sev)}
                          className={`px-1.5 py-0.5 rounded text-[10px] ${
                            calcSeverity === sev ? 'bg-red-500 text-white' : 'bg-white/10 text-slate-400'
                          }`}
                        >
                          {sev[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Affected Population:</span>
                    <span className="text-white font-bold">{calcPeople} people</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={400}
                    step={10}
                    value={calcPeople}
                    onChange={(e) => setCalcPeople(Number(e.target.value))}
                    className="w-full accent-red-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Sample Ranked Issue Row */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-slate-200 font-medium truncate max-w-[200px]">
                    Blocked Culvert, Matale Hindu College
                  </span>
                </div>
                <span className="text-red-400 font-bold">Priority #1</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          TOP 3 FEATURE CARDS (Directly matching SAS AI/Cloud/Automation layout)
          ========================================================================= */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: AI & Machine Learning -> Deterministic Priority Engine */}
          <div className="p-7 rounded-3xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 hover:border-red-500/40 shadow-sm hover:shadow-[0_12px_32px_-8px_rgba(239,68,68,0.2)] transition-all duration-300 group">
            {/* Glowing Red Icon Badge */}
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-[0_6px_20px_rgba(239,68,68,0.4)] flex items-center justify-center text-white mb-5 group-hover:scale-105 transition-transform duration-300">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Impact & Priority Engine
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Transparent deterministic scoring weighted by severity (40%), population impact (30%), urgency (20%), and report age (10%).
            </p>
          </div>

          {/* Card 2: Cloud Analytics -> Municipal Coordination Cloud */}
          <div className="p-7 rounded-3xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 hover:border-red-500/40 shadow-sm hover:shadow-[0_12px_32px_-8px_rgba(239,68,68,0.2)] transition-all duration-300 group">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-[0_6px_20px_rgba(239,68,68,0.4)] flex items-center justify-center text-white mb-5 group-hover:scale-105 transition-transform duration-300">
              <Cloud className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Cloud Coordination
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Connects citizens, neighborhood representatives, and municipal councils in a synchronized, real-time resolution pipeline.
            </p>
          </div>

          {/* Card 3: Intelligent Automation -> Civilian Endorsement */}
          <div className="p-7 rounded-3xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 hover:border-red-500/40 shadow-sm hover:shadow-[0_12px_32px_-8px_rgba(239,68,68,0.2)] transition-all duration-300 group">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-[0_6px_20px_rgba(239,68,68,0.4)] flex items-center justify-center text-white mb-5 group-hover:scale-105 transition-transform duration-300">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Civilian Upvoting Weight
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Prevents duplicate complaints by allowing residents to add community endorsements, escalating genuine crises to the top.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SOLUTIONS BY CIVIC SECTOR (Directly matching "Solutions by Industry")
          ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Solutions by Civic Sector
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
            Targeted civic intelligence and municipal workflow acceleration across everyday infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Sector 1: Roads */}
          <div className="p-6 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 hover:border-red-500/40 shadow-sm transition-all duration-300 flex flex-col justify-between h-full group">
            <div>
              <div className="text-red-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Road Infrastructure
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                Potholes, collapsed culverts, dangerous blind intersections, and road surface hazards.
              </p>
            </div>
            <Link
              to="/issues?category=ROAD"
              className="inline-flex items-center text-xs font-bold text-red-500 dark:text-red-400 group-hover:text-red-600 transition-colors"
            >
              <span>Explore Road Reports</span>
              <span className="ml-1 transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>

          {/* Sector 2: Drainage */}
          <div className="p-6 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 hover:border-red-500/40 shadow-sm transition-all duration-300 flex flex-col justify-between h-full group">
            <div>
              <div className="text-red-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Waves className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Drainage & Floods
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                Blocked concrete canals, monsoon overflow points, and dengue mosquito breeding water.
              </p>
            </div>
            <Link
              to="/issues?category=DRAINAGE"
              className="inline-flex items-center text-xs font-bold text-red-500 dark:text-red-400 group-hover:text-red-600 transition-colors"
            >
              <span>Explore Drainage</span>
              <span className="ml-1 transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>

          {/* Sector 3: Water */}
          <div className="p-6 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 hover:border-red-500/40 shadow-sm transition-all duration-300 flex flex-col justify-between h-full group">
            <div>
              <div className="text-red-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Droplet className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Water Supply
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                Pipeline leaks, burst water mains, contamination risks, and pressure drops.
              </p>
            </div>
            <Link
              to="/issues?category=WATER"
              className="inline-flex items-center text-xs font-bold text-red-500 dark:text-red-400 group-hover:text-red-600 transition-colors"
            >
              <span>Explore Water</span>
              <span className="ml-1 transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>

          {/* Sector 4: Streetlights */}
          <div className="p-6 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 hover:border-red-500/40 shadow-sm transition-all duration-300 flex flex-col justify-between h-full group">
            <div>
              <div className="text-red-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Lightbulb className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Street Lighting
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                Broken fixtures, dark pedestrian school lanes, electrical sparks, and timer faults.
              </p>
            </div>
            <Link
              to="/issues?category=STREETLIGHT"
              className="inline-flex items-center text-xs font-bold text-red-500 dark:text-red-400 group-hover:text-red-600 transition-colors"
            >
              <span>Explore Lighting</span>
              <span className="ml-1 transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          TRUSTED BY BAR (Matching monochrome enterprise logos in reference)
          ========================================================================= */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-white/5">
        <h3 className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">
          Trusted by Sri Lankan Municipal & Civic Partners
        </h3>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70 dark:opacity-60 grayscale hover:grayscale-0 transition-all">
          <div className="flex items-center space-x-2 font-bold text-slate-700 dark:text-slate-300 text-sm">
            <span className="text-xl">🏛️</span>
            <span>Matale Municipal Council</span>
          </div>

          <div className="flex items-center space-x-2 font-bold text-slate-700 dark:text-slate-300 text-sm">
            <span className="text-xl">🌿</span>
            <span>Central Province RDA</span>
          </div>

          <div className="flex items-center space-x-2 font-bold text-slate-700 dark:text-slate-300 text-sm">
            <span className="text-xl">⚡</span>
            <span>Ceylon Electricity Board</span>
          </div>

          <div className="flex items-center space-x-2 font-bold text-slate-700 dark:text-slate-300 text-sm">
            <span className="text-xl">💧</span>
            <span>NWSDB Water Board</span>
          </div>

          <div className="flex items-center space-x-2 font-bold text-slate-700 dark:text-slate-300 text-sm">
            <span className="text-xl">🇱🇰</span>
            <span>Grama Niladhari Division</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FINAL CTA BANNER
          ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent border border-red-500/20 shadow-xl relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-red-500/15 rounded-full blur-2xl pointer-events-none" />

          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
            Ready to Prioritize & Fix Your Neighborhood?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-8">
            Submit your community report in under 60 seconds. Transparent, deterministic, and community-powered.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/report"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-[0_4px_24px_rgba(239,68,68,0.45)] hover:shadow-[0_4px_32px_rgba(239,68,68,0.65)] transition-all"
            >
              Submit a Report Now
            </Link>
            <Link
              to="/issues"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-surface border border-slate-200 dark:border-white/10 hover:border-red-500/40 transition-colors"
            >
              Browse Public Feed
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
