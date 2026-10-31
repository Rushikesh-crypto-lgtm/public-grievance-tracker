import React from 'react';
import {
  Building2,
  FileText,
  UserCheck,
  Clock,
  ShieldCheck,
  Activity,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (view: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12 animate-fade-in">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
          <Building2 className="w-3.5 h-3.5" />
          Civic Governance Charter
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Why Public Grievance Tracker?
        </h1>

        <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
          Public grievances can become difficult to resolve when responsibility, priority and deadlines are separated. Public Grievance Tracker creates one traceable case lifecycle so every grievance has an owner, a visible status and a clear path to resolution.
        </p>
      </div>

      {/* 5 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Pillar 1: Intake */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">1. Intake</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Standardized citizen intake with category mapping, geolocation, and automatic SLA tiering. No complaint gets lost in paper registers.
          </p>
        </div>

        {/* Pillar 2: Ownership */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">2. Ownership</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every case is explicitly assigned to a designated municipal engineer. Named accountability guarantees that someone is personally on the hook for remedial action.
          </p>
        </div>

        {/* Pillar 3: Deadlines */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">3. Deadlines</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Strict Service Level Agreements (SLAs) ranging from 24 hours for Critical electric/safety hazards to 7 days for Low priority maintenance.
          </p>
        </div>

        {/* Pillar 4: Accountability */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">4. Accountability</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every transition, note, reassignment, and sign-off creates an immutable audit entry with actor, role, and exact timestamp. Reopening is enabled if repairs fail.
          </p>
        </div>

        {/* Pillar 5: Operations */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3 md:col-span-2 lg:col-span-2">
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">5. Operations & Escalation</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Zonal directors and managers monitor bottleneck departments in real time. Cases exceeding target SLA or flagged for high risk are escalated directly to executive queues for immediate intervention.
          </p>
        </div>
      </div>

      {/* SLA Matrix Table */}
      <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Official Redressal SLA Standards</h2>
        <p className="text-xs text-slate-600">
          Target resolution timelines enforced across the municipal grievance lifecycle:
        </p>

        <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">Severity Level</th>
                <th className="px-4 py-3">Resolution SLA Target</th>
                <th className="px-4 py-3">Risk Escalation Trigger</th>
                <th className="px-4 py-3">Example Issues</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-3 font-bold text-red-700">CRITICAL</td>
                <td className="px-4 py-3 font-semibold">24 Hours</td>
                <td className="px-4 py-3 text-red-600">Immediate after 24h</td>
                <td className="px-4 py-3 text-slate-600">Live electric wire, fallen tree blocking ambulance</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-amber-800">HIGH</td>
                <td className="px-4 py-3 font-semibold">3 Days (72h)</td>
                <td className="px-4 py-3 text-amber-700">≤22 hours remaining</td>
                <td className="px-4 py-3 text-slate-600">Deep road pothole, contaminated water supply</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-blue-700">MEDIUM</td>
                <td className="px-4 py-3 font-semibold">5 Days (120h)</td>
                <td className="px-4 py-3 text-amber-700">≤36 hours remaining</td>
                <td className="px-4 py-3 text-slate-600">Dark streetlights, voltage fluctuations</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-700">LOW</td>
                <td className="px-4 py-3 font-semibold">7 Days (168h)</td>
                <td className="px-4 py-3 text-amber-700">≤50 hours remaining</td>
                <td className="px-4 py-3 text-slate-600">Faded speed breaker paint, paver block leveling</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-blue-900 rounded-2xl p-8 text-white text-center space-y-4">
        <h3 className="text-xl font-bold">Experience the Complete Prototype</h3>
        <p className="text-xs sm:text-sm text-blue-200 max-w-xl mx-auto">
          Test the seamless journey from citizen submission to field assignment, deadline monitoring, escalation, resolution, and public verification.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onNavigate('register')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Register a Grievance</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigate('track')}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold text-xs transition-colors border border-white/20 cursor-pointer"
          >
            Track Existing Case
          </button>
        </div>
      </div>
    </div>
  );
};
