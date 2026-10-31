import React, { useState, useEffect } from 'react';
import { useGrievance } from '../context/GrievanceContext';
import { Grievance, GrievanceStatus } from '../types/grievance';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Building,
  MapPin,
  Calendar,
  ArrowRight,
  FileText,
  AlertCircle
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { formatDateTime, formatDateOnly, computeRiskState, formatTimeRemaining } from '../utils/sla';

interface TrackGrievancePageProps {
  initialCaseId?: string;
  onNavigate: (view: string, caseId?: string) => void;
}

export const TrackGrievancePage: React.FC<TrackGrievancePageProps> = ({
  initialCaseId,
  onNavigate
}) => {
  const { getGrievanceById, grievances } = useGrievance();
  const [searchId, setSearchId] = useState(initialCaseId || '');
  const [searchedCase, setSearchedCase] = useState<Grievance | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialCaseId) {
      setSearchId(initialCaseId);
      performSearch(initialCaseId);
    }
  }, [initialCaseId]);

  const performSearch = (idToSearch: string) => {
    const trimmed = idToSearch.trim();
    if (!trimmed) {
      setErrorMessage('Please enter a valid Case ID.');
      setSearchedCase(null);
      setHasSearched(false);
      return;
    }

    const found = getGrievanceById(trimmed);
    setHasSearched(true);
    if (found) {
      setSearchedCase(found);
      setErrorMessage(null);
    } else {
      setSearchedCase(null);
      setErrorMessage(
        `Case ID "${trimmed}" not found in the public registry. Please verify the ID format (e.g. PG-2026-00124) and try again.`
      );
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchId);
  };

  // 6 standard lifecycle stages for public timeline
  const LIFECYCLE_STAGES: GrievanceStatus[] = [
    'Submitted',
    'Acknowledged',
    'In Progress',
    'Awaiting Information',
    'Resolved',
    'Closed'
  ];

  const getStageIndex = (st: GrievanceStatus): number => {
    return LIFECYCLE_STAGES.indexOf(st);
  };

  const currentStageIndex = searchedCase ? getStageIndex(searchedCase.status) : -1;
  const riskState = searchedCase ? computeRiskState(searchedCase) : 'ON TRACK';
  const remainingInfo = searchedCase ? formatTimeRemaining(searchedCase) : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* Header & Search Bar */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          Citizen Transparency Portal
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Track Your Public Grievance
        </h1>
        <p className="text-sm text-slate-600">
          Enter your unique Case ID below to track real-time departmental actions, inspection milestones, and SLA target dates.
        </p>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="pt-4 max-w-lg mx-auto">
          <div className="relative flex items-center shadow-sm rounded-xl">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchId}
              onChange={e => {
                setSearchId(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Enter Case ID (e.g. PG-2026-00124)"
              className="w-full pl-12 pr-32 py-3.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
            />
            <button
              type="submit"
              className="absolute right-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Track Case
            </button>
          </div>
        </form>

        {/* Demo Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-500">
          <span className="text-[11px] text-slate-400">Quick Test Cases:</span>
          {['PG-2026-00124', 'PG-2026-00118', 'PG-2026-00112', 'PG-2026-00105'].map(id => (
            <button
              key={id}
              onClick={() => {
                setSearchId(id);
                performSearch(id);
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-md border border-slate-200 font-mono transition-colors"
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {errorMessage && (
        <div className="max-w-xl mx-auto p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-xs text-red-800 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">{errorMessage}</p>
            <p className="text-red-600">
              Check if you have copied the full identifier without spaces.
            </p>
          </div>
        </div>
      )}

      {/* Case Found View */}
      {searchedCase && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden space-y-6 animate-fade-in">
          {/* Header Card */}
          <div className="p-6 sm:p-8 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-sm sm:text-base font-extrabold text-blue-400 bg-blue-950 px-2.5 py-1 rounded border border-blue-800">
                  {searchedCase.id}
                </span>
                <StatusBadge status={searchedCase.status} />
                <PriorityBadge priority={searchedCase.priority} />
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                {searchedCase.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {searchedCase.department}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {searchedCase.area}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Submitted: {formatDateOnly(searchedCase.submittedAt)}
                </span>
              </div>
            </div>

            {/* Overdue / Target Badge on Top Right */}
            <div className="text-left md:text-right shrink-0">
              {riskState === 'OVERDUE' ? (
                <div className="inline-block bg-red-600 text-white px-3.5 py-2 rounded-xl text-left border border-red-500 shadow-md">
                  <div className="flex items-center gap-1.5 text-xs font-black tracking-wider uppercase">
                    <AlertTriangle className="w-4 h-4 text-white" />
                    OVERDUE
                  </div>
                  <p className="text-[11px] font-mono font-medium text-red-100 mt-0.5">
                    {remainingInfo?.text}
                  </p>
                </div>
              ) : searchedCase.status === 'Resolved' || searchedCase.status === 'Closed' ? (
                <div className="inline-block bg-emerald-950 text-emerald-300 border border-emerald-800 px-3.5 py-2 rounded-xl text-left">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    COMPLETED
                  </div>
                  <p className="text-[11px] text-emerald-200 mt-0.5">
                    Resolved on {searchedCase.resolvedAt ? formatDateOnly(searchedCase.resolvedAt) : 'Recently'}
                  </p>
                </div>
              ) : (
                <div className="inline-block bg-slate-800 border border-slate-700 px-3.5 py-2 rounded-xl text-left">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Target Resolution</p>
                  <p className="text-xs font-bold text-slate-200 mt-0.5">
                    {formatDateOnly(searchedCase.targetResolutionDate)}
                  </p>
                  <p className="text-[11px] text-blue-400 font-medium">
                    {remainingInfo?.text}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Large Visual Status Timeline */}
          <div className="px-6 sm:px-8 py-6 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-6">
              Lifecycle Progress
            </h3>

            {/* Desktop Horizontal Stepper */}
            <div className="hidden md:flex items-center justify-between relative">
              {/* Connecting line */}
              <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />

              {LIFECYCLE_STAGES.map((st, idx) => {
                const isCompleted = currentStageIndex > idx || searchedCase.status === 'Closed';
                const isCurrent = searchedCase.status === st && searchedCase.status !== 'Closed';
                const isPastOrCurrent = currentStageIndex >= idx;

                return (
                  <div key={st} className="flex flex-col items-center relative z-10 text-center px-1">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-xs ${
                        isCurrent
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100 scale-110'
                          : isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-slate-400 border-2 border-slate-300'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>

                    <span
                      className={`text-xs mt-2 font-medium max-w-[90px] leading-tight ${
                        isCurrent
                          ? 'text-blue-900 font-bold'
                          : isCompleted
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {st}
                    </span>

                    {isCurrent && (
                      <span className="mt-1 px-1.5 py-0.2 bg-blue-100 text-blue-800 text-[10px] rounded-full font-semibold">
                        Current
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile Vertical Stepper */}
            <div className="md:hidden space-y-4">
              {LIFECYCLE_STAGES.map((st, idx) => {
                const isCompleted = currentStageIndex > idx || searchedCase.status === 'Closed';
                const isCurrent = searchedCase.status === st && searchedCase.status !== 'Closed';

                return (
                  <div key={st} className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isCurrent
                          ? 'bg-blue-600 text-white ring-2 ring-blue-200'
                          : isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4 text-white" /> : idx + 1}
                    </div>
                    <div className="flex-1">
                      <span
                        className={`text-xs font-semibold ${
                          isCurrent ? 'text-blue-900' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                        }`}
                      >
                        {st}
                      </span>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        Active Stage
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resolution Card if Resolved or Closed */}
          {(searchedCase.status === 'Resolved' || searchedCase.status === 'Closed') && (
            <div className="mx-6 sm:mx-8 p-6 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Department Resolution Summary</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-white p-4 rounded-lg border border-emerald-100">
                {searchedCase.resolutionNote || 'The reported issue was inspected and resolved as per municipal engineering protocols.'}
              </p>
              <div className="flex flex-wrap items-center justify-between text-xs text-emerald-900 pt-1">
                <span>
                  Resolution Date: {searchedCase.resolvedAt ? formatDateTime(searchedCase.resolvedAt) : 'Logged'}
                </span>
                {searchedCase.resolutionEvidence && (
                  <span className="font-semibold text-emerald-700">
                    Inspection Evidence Attached: {searchedCase.resolutionEvidence}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Grievance Details & Public Activity Log */}
          <div className="px-6 sm:px-8 pb-8 grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left: Case Information */}
            <div className="md:col-span-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Grievance Description
              </h4>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {searchedCase.description}
              </div>

              {searchedCase.address && (
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Address / Landmark: </span>
                  {searchedCase.address}
                </div>
              )}

              {searchedCase.attachmentName && (
                <div className="flex items-center gap-2 text-xs text-slate-600 p-2.5 bg-slate-100 rounded-lg">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Citizen Evidence Uploaded: {searchedCase.attachmentName}</span>
                </div>
              )}

              {/* Privacy Notice Reminder */}
              <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-lg text-[11px] text-blue-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  Citizen contact numbers and internal staff coordination notes are shielded in compliance with Public Privacy Standards.
                </span>
              </div>
            </div>

            {/* Right: Public Audit History (Only citizen-safe events) */}
            <div className="md:col-span-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Public Action Timeline
              </h4>

              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200">
                {searchedCase.auditTrail
                  .filter(ev => ev.role === 'Citizen' || ev.role === 'System' || ev.action.includes('Status') || ev.action.includes('Resolved') || ev.action.includes('Closed'))
                  .map(event => (
                    <div key={event.id} className="relative flex items-start gap-4 text-xs">
                      <div className="w-6 h-6 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center shrink-0 z-10">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      </div>
                      <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                          <span className="font-semibold text-slate-700">{event.action}</span>
                          <span>{formatDateTime(event.timestamp)}</span>
                        </div>
                        <p className="text-slate-600">{event.description}</p>
                        {event.note && (
                          <p className="mt-1 text-[11px] text-slate-500 italic bg-white p-1.5 rounded border border-slate-100">
                            &quot;{event.note}&quot;
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
