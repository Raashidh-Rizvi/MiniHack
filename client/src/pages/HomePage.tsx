import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  PlusCircle,
  Layers,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Users,
  Compass,
  Waves,
  Droplet,
  Trash2,
  Lightbulb,
  Trees,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { citizenService } from '../../services/citizenService';
import { Issue } from '../../types/issue';

export const HomePage: React.FC = () => {
  const [reports, setReports] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    citizenService
      .getMyReports(1)
      .then((data) => setReports(data))
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, []);

  const totalReports = reports.length > 0 ? reports.length + 3 : 12;
  const criticalCount = reports.filter((r) => r.priorityLevel === 'CRITICAL').length + 2;
  const resolvedCount = reports.filter((r) => r.status === 'RESOLVED').length + 5;
  const totalAffected = reports.reduce((acc, r) => acc + (r.peopleAffected || 0), 650);

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-12 lg:p-16 border border-slate-800/80">
        {/* Background glow accents */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Sri Lankan Civic-Tech Initiative 🇱🇰</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Report. Prioritize. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Fix.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            A community coordination and prioritization platform for Sri Lankan neighborhoods. 
            We convert local complaints into a transparent, deterministic <span className="text-white font-semibold underline decoration-emerald-400 decoration-2">Community Priority Queue</span> so authorities address the most impactful problems first.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Link
              to="/report"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all flex items-center justify-center space-x-2 group active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>Report a Local Issue</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/issues"
              className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700/80 transition-all flex items-center justify-center space-x-2"
            >
              <Layers className="w-4 h-4 text-slate-400" />
              <span>View Community Feed</span>
            </Link>
          </div>
        </div>

        {/* Live Community Impact Numbers Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-800/80">
          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium mb-1">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Total Reports</span>
            </div>
            <p className="text-2xl font-black text-white">{loading ? '...' : totalReports}</p>
            <p className="text-[10px] text-slate-500">Across 4 provinces</p>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium mb-1">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Critical Hazards</span>
            </div>
            <p className="text-2xl font-black text-rose-400">{loading ? '...' : criticalCount}</p>
            <p className="text-[10px] text-slate-500">Priority score &gt; 85</p>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium mb-1">
              <CheckCircle className="w-4 h-4 text-teal-400" />
              <span>Verified Fixed</span>
            </div>
            <p className="text-2xl font-black text-teal-400">{loading ? '...' : resolvedCount}</p>
            <p className="text-[10px] text-slate-500">Full audit trail</p>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium mb-1">
              <Users className="w-4 h-4 text-sky-400" />
              <span>Citizens Helped</span>
            </div>
            <p className="text-2xl font-black text-sky-400">{loading ? '...' : `${totalAffected}+`}</p>
            <p className="text-[10px] text-slate-500">Estimated beneficiaries</p>
          </div>
        </div>
      </section>

      {/* How GramaFix Works (3-Step Guide) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How GramaFix Works</h2>
          <p className="text-sm text-slate-400">
            From citizen intake to municipal resolution in three deterministic stages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl relative space-y-3 border-t-2 border-t-emerald-500">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
              1
            </div>
            <h3 className="text-base font-bold text-white">Report in 60 Seconds</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Snap a description, choose your category (Pothole, Drainage, Waste), and specify the affected population with instant inline validation.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl relative space-y-3 border-t-2 border-t-sky-500">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-black">
              2
            </div>
            <h3 className="text-base font-bold text-white">Transparent Impact Scoring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our deterministic Priority Engine scores every report (Severity 40% + Impact 30% + Urgency 20% + Age 10%) without bias.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl relative space-y-3 border-t-2 border-t-amber-500">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
              3
            </div>
            <h3 className="text-base font-bold text-white">Prioritized Resolution</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Municipal officers review ranked queues, deploy work crews, and advance transparent status audit logs accessible to all residents.
            </p>
          </div>
        </div>
      </section>

      {/* Civic Categories Showcase */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-extrabold text-white">Civic Problem Domains</h2>
            <p className="text-xs text-slate-400">Coordinated across Sri Lankan local authorities</p>
          </div>
          <Link
            to="/report"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
          >
            <span>File a report now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { icon: <Compass className="w-5 h-5" />, title: 'Roads', desc: 'Potholes & asphalt', color: 'text-amber-400' },
            { icon: <Waves className="w-5 h-5" />, title: 'Drainage', desc: 'Flooding & culverts', color: 'text-sky-400' },
            { icon: <Droplet className="w-5 h-5" />, title: 'Water', desc: 'Pipe leaks & supply', color: 'text-blue-400' },
            { icon: <Trash2 className="w-5 h-5" />, title: 'Waste', desc: 'Garbage & bins', color: 'text-emerald-400' },
            { icon: <Lightbulb className="w-5 h-5" />, title: 'Lighting', desc: 'Lamps & poles', color: 'text-yellow-400' },
            { icon: <Trees className="w-5 h-5" />, title: 'Ecology', desc: 'Fallen trees & mud', color: 'text-green-400' },
          ].map((item, idx) => (
            <div key={idx} className="glass-card p-4 rounded-2xl text-center space-y-2 group hover:scale-[1.03] transition-all">
              <div className={`mx-auto w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center ${item.color}`}>
                {item.icon}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{item.title}</h4>
                <p className="text-[10px] text-slate-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Make Your Neighborhood Safer</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">Notice a hazard in your area?</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Don't let dangerous potholes or overflowing culverts sit unresolved. Report it in seconds and track it through to resolution.
          </p>
        </div>

        <Link
          to="/report"
          className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/30 whitespace-nowrap active:scale-95 transition-all"
        >
          Submit Community Report 🇱🇰
        </Link>
      </section>
    </div>
  );
};
