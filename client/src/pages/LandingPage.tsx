import React from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Cloud,
  Compass,
  Waves,
  Droplet,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
  MapPin,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { SriLankanLion } from '../components/common/SriLankanLion';
import { ExecutiveDashboardPreview } from '../components/landing/ExecutiveDashboardPreview';

export const LandingPage: React.FC = () => {

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
              <SriLankanLion size={15} color="#EF4444" accentColor="#991B1B" />
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
                className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-bold liquid-btn-crimson text-center"
              >
                Report an Issue
              </Link>

              <Link
                to="/issues"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full text-sm font-semibold liquid-btn-glass text-center flex items-center justify-center space-x-1"
              >
                <span>Explore Community Feed</span>
                <ChevronRight className="w-4 h-4" />
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
            <ExecutiveDashboardPreview />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SRI LANKAN PROBLEM STATEMENT SECTION (SE3090 Requirement 2)
          ========================================================================= */}
      <section id="problem-context" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-b from-red-500/5 via-slate-50 to-white dark:from-red-500/10 dark:via-surface-elevated/40 dark:to-surface border border-red-500/20 p-8 sm:p-12 shadow-sm">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 mb-3">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>The Sri Lankan Civic Challenge (Local Context)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Why Sri Lankan Communities Face Critical Repair Delays
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Across Sri Lanka's 14,022 Grama Niladhari divisions, neighborhood infrastructure issues—from monsoon drain blockages to dangerous road culverts—routinely languish for weeks due to three fundamental breakdowns:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center mb-3">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Monsoon Flash Floods & Blocked Drains
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                During tropical monsoons, unmaintained roadside canals overflow into homes, creating dengue breeding hotspots and road washouts. Without rapid reporting, repairs occur only after disaster strikes.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 text-red-500 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Paper Petitions & Zero Visibility
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Citizens must visit Pradeshiya Sabhas or GN offices with manual paper letters that get buried. Residents have no digital receipt, tracking status, or accountability for resolving the issue.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-500 flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Subjective, Biased Triage
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Maintenance units lack mathematical data on how many families or school routes are affected. GramaFix replaces arbitrary decisions with a deterministic Community Priority Score.
              </p>
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
              <SriLankanLion size={26} color="#FFFFFF" accentColor="#EF4444" />
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
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-bold liquid-btn-crimson"
            >
              Submit a Report Now
            </Link>
            <Link
              to="/issues"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full text-sm font-semibold liquid-btn-glass"
            >
              Browse Public Feed
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
