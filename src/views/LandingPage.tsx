import React, { useState } from 'react';
import { useGrievance } from '../context/GrievanceContext';
import {
  FilePlus,
  Search,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Clock,
  Building2,
  Users,
  AlertTriangle,
  Flame,
  ChevronRight,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';

interface LandingPageProps {
  onNavigate: (view: string, caseId?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { grievances } = useGrievance();
  const [quickTrackId, setQuickTrackId] = useState('');

  // Live calculated stats for hero preview
  const totalCases = grievances.length;
  const resolvedCount = grievances.filter(g => g.status === 'Resolved' || g.status === 'Closed').length;
  const inProgressCount = grievances.filter(g => g.status === 'In Progress' || g.status === 'Acknowledged').length;
  const overdueCount = grievances.filter(g => {
    if (g.status === 'Resolved' || g.status === 'Closed') return false;
    const eff = new Date(g.targetResolutionDate).getTime() - (g.simulatedTimeShiftHours || 0) * 3600000;
    return eff < Date.now();
  }).length;

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTrackId.trim()) {
      onNavigate('track', quickTrackId.trim());
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-300 text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Official Municipal Grievance Redressal System
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Your grievance deserves an{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                  accountable response.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Submit a public grievance, receive a unique case ID, and track its journey from submission to resolution with clear deadlines and transparent ownership.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('register')}
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-lg shadow-lg shadow-blue-900/40 transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <FilePlus className="w-4 h-4 text-blue-200" />
                  <span>Register a Grievance</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('track')}
                  className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-lg border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-slate-400" />
                  <span>Track a Grievance</span>
                </button>
              </div>

              {/* Quick Case ID Lookup Input */}
              <form onSubmit={handleQuickTrack} className="pt-4 max-w-md">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={quickTrackId}
                    onChange={e => setQuickTrackId(e.target.value)}
                    placeholder="Have a Case ID? (e.g. PG-2026-00124)"
                    className="w-full pl-10 pr-24 py-2.5 bg-slate-800/90 border border-slate-700 rounded-lg text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-md transition-colors"
                  >
                    Track
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Interactive Live Dashboard Preview */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-2xl backdrop-blur-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
                  <div className="flex items-center gap-2.5">
                    <Activity className="w-5 h-5 text-blue-400" />
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-wide">
                        Civic Operations Live Status
                      </h3>
                      <p className="text-[11px] text-slate-400">Hyderabad Metropolitan Region</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                    REAL-TIME SLA
                  </span>
                </div>

                {/* KPI Counter Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <p className="text-[11px] text-slate-400 font-medium">Total Registered</p>
                    <p className="text-2xl font-extrabold text-white mt-1">{totalCases}</p>
                    <span className="text-[10px] text-blue-400 flex items-center gap-1 mt-1 font-mono">
                      100% Trackable
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <p className="text-[11px] text-slate-400 font-medium">Successfully Resolved</p>
                    <p className="text-2xl font-extrabold text-emerald-400 mt-1">{resolvedCount}</p>
                    <span className="text-[10px] text-emerald-500 flex items-center gap-1 mt-1 font-mono">
                      Audited & Signed
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <p className="text-[11px] text-slate-400 font-medium">Under Active Work</p>
                    <p className="text-2xl font-extrabold text-blue-400 mt-1">{inProgressCount}</p>
                    <span className="text-[10px] text-blue-300 flex items-center gap-1 mt-1 font-mono">
                      Field Assigned
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <p className="text-[11px] text-slate-400 font-medium">Overdue Escalations</p>
                    <p className="text-2xl font-extrabold text-amber-400 mt-1">{overdueCount}</p>
                    <span className="text-[10px] text-amber-500 flex items-center gap-1 mt-1 font-mono">
                      Manager Oversight
                    </span>
                  </div>
                </div>

                {/* Seeded Demo Case Quick Link */}
                <div
                  onClick={() => onNavigate('case-detail', 'PG-2026-00124')}
                  className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/80 hover:border-blue-600 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono font-bold text-blue-400">PG-2026-00124</span>
                    <span className="text-[10px] bg-blue-900/70 text-blue-200 px-2 py-0.5 rounded font-semibold">
                      Featured Demo Case
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-200 line-clamp-1 group-hover:text-blue-300">
                    Hazardous deep pothole near junction (Gachibowli)
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/60 text-[11px] text-slate-400">
                    <span>Officer: Rahul Kumar</span>
                    <span className="text-blue-400 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Inspect Workflow <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Making public grievances visible, owned, and resolvable.
          </h2>
          <p className="text-slate-600 mt-2 text-sm">
            A modern public redressal architecture that eliminates lost complaints, unassigned tasks, and ignored deadlines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Benefit 1 */}
          <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-6">
              <FilePlus className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              01 • Intake
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">1. Submit</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              “Create a traceable grievance in minutes.” Provide incident details, area, and photo evidence to receive an immutable tracking ID.
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-6">
              <Clock className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              02 • Accountability
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">2. Track</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              “Follow every important status update.” Watch your complaint transition from Submitted to Acknowledged, In Progress, and Resolution with SLA countdowns.
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
              03 • Proof of Work
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">3. Resolve</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              “See how your grievance moves toward resolution.” Officers must provide documented resolution notes and verification evidence before closure.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section (4 Steps) */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Transparent Case Lifecycle
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              How the System Operates
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              From civic citizen reporting to official engineering sign-off.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative">
              <div className="text-2xl font-black text-blue-600/30 mb-2 font-mono">01</div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Submit</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Citizen submits issue with category and locality. System assigns priority and strict SLA deadline.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative">
              <div className="text-2xl font-black text-indigo-600/30 mb-2 font-mono">02</div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Assign</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Routed to the designated department (Roads, Water, Electricity) and owned by an accountable field officer.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative">
              <div className="text-2xl font-black text-amber-600/30 mb-2 font-mono">03</div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Act</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Officers acknowledge and execute field repair. If deadlines lapse, automated escalation alerts the Zonal Manager.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative">
              <div className="text-2xl font-black text-emerald-600/30 mb-2 font-mono">04</div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Resolve</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Repair signed off with documented resolution notes and evidence. Reopening permitted if citizen is dissatisfied.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Public Resolution Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Recently Resolved Grievances</h3>
            <p className="text-xs text-slate-500">
              Verified public grievances completed by zonal municipal teams.
            </p>
          </div>
          <button
            onClick={() => onNavigate('track')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto"
          >
            Track specific complaint <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {grievances
            .filter(g => g.status === 'Resolved' || g.status === 'Closed')
            .slice(0, 3)
            .map(item => (
              <div
                key={item.id}
                onClick={() => onNavigate('track', item.id)}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 cursor-pointer transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-700">{item.id}</span>
                  <StatusBadge status={item.status} size="sm" />
                </div>
                <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">{item.title}</h4>
                <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic line-clamp-2">
                  &quot;{item.resolutionNote || 'Work inspected and certified resolved.'}&quot;
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>{item.area}</span>
                  <span className="text-emerald-700 font-medium">Verified by Department</span>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};
