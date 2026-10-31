import React, { useState } from 'react';
import { useGrievance } from '../context/GrievanceContext';
import {
  Grievance,
  GrievanceStatus,
  Department,
  Priority
} from '../types/grievance';
import {
  ArrowLeft,
  UserCheck,
  RefreshCw,
  ShieldAlert,
  StickyNote,
  CheckCircle2,
  RotateCcw,
  Clock,
  Building,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  FileText,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Send
} from 'lucide-react';
import { StatusBadge, PriorityBadge, RiskBadge, EscalatedBadge } from '../components/common/Badge';
import {
  formatDateTime,
  formatDateOnly,
  computeRiskState,
  formatTimeRemaining
} from '../utils/sla';
import { AssignmentModal } from '../components/modals/AssignmentModal';
import { StatusChangeModal } from '../components/modals/StatusChangeModal';
import { EscalateModal } from '../components/modals/EscalateModal';
import { ResolveModal } from '../components/modals/ResolveModal';
import { ReopenModal } from '../components/modals/ReopenModal';
import { CloseConfirmModal } from '../components/modals/CloseConfirmModal';
import { AddNoteModal } from '../components/modals/AddNoteModal';

interface CaseDetailPageProps {
  caseId: string;
  onNavigate: (view: string, caseId?: string) => void;
}

export const CaseDetailPage: React.FC<CaseDetailPageProps> = ({ caseId, onNavigate }) => {
  const {
    getGrievanceById,
    currentRole,
    currentUser,
    assignGrievance,
    updateStatus,
    escalateGrievance,
    resolveGrievance,
    closeGrievance,
    reopenGrievance,
    addInternalNote,
    simulateDeadline
  } = useGrievance();

  const caseItem = getGrievanceById(caseId);

  // Modals state
  const [assignOpen, setAssignOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [escalateOpen, setEscalateOpen] = useState(false);
  const [resolveOpen, setResolveOpen] = useState(false);
  const [reopenOpen, setReopenOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);

  // Quick internal note inline input
  const [quickNote, setQuickNote] = useState('');

  if (!caseItem) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">Case Record Not Found</h2>
        <p className="text-sm text-slate-500 mt-1">
          Case ID <span className="font-mono text-blue-600 font-semibold">{caseId}</span> does not exist in the active registry.
        </p>
        <button
          onClick={() => onNavigate(currentRole === 'citizen' ? 'home' : 'staff-dashboard')}
          className="mt-6 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const risk = computeRiskState(caseItem);
  const remaining = formatTimeRemaining(caseItem);

  const LIFECYCLE_STAGES: GrievanceStatus[] = [
    'Submitted',
    'Acknowledged',
    'In Progress',
    'Awaiting Information',
    'Resolved',
    'Closed'
  ];

  const currentStageIdx = LIFECYCLE_STAGES.indexOf(caseItem.status);

  const handleQuickNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickNote.trim()) {
      addInternalNote(caseItem.id, quickNote.trim());
      setQuickNote('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            if (currentRole === 'manager') onNavigate('manager-dashboard');
            else if (currentRole === 'staff') onNavigate('staff-dashboard');
            else onNavigate('track', caseItem.id);
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {currentRole === 'manager' ? 'Operations Overview' : currentRole === 'staff' ? 'My Queue' : 'Grievance Tracker'}</span>
        </button>

        {/* Public Tracker Shortcut for Citizen perspective */}
        <button
          onClick={() => onNavigate('track', caseItem.id)}
          className="text-xs text-blue-600 hover:underline font-medium flex items-center gap-1"
        >
          <span>View Public Citizen Tracking Page</span>
        </button>
      </div>

      {/* Main Case Header */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-base font-extrabold text-blue-800 bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
                {caseItem.id}
              </span>
              <StatusBadge status={caseItem.status} />
              <PriorityBadge priority={caseItem.priority} />
              <RiskBadge risk={risk} />
              {caseItem.isEscalated && <EscalatedBadge />}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {caseItem.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                {caseItem.department}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {caseItem.area}
              </span>
              <span className="flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                Assigned: <strong className="text-slate-700 ml-1">{caseItem.assignedOfficer}</strong>
              </span>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Assign Case */}
            <button
              onClick={() => setAssignOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Assign</span>
            </button>

            {/* Advance Status */}
            {caseItem.status !== 'Closed' && (
              <button
                onClick={() => setStatusOpen(true)}
                className="px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                <span>Change Status</span>
              </button>
            )}

            {/* Escalate (if not already escalated) */}
            {!caseItem.isEscalated && caseItem.status !== 'Resolved' && caseItem.status !== 'Closed' && (
              <button
                onClick={() => setEscalateOpen(true)}
                className="px-3.5 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                <span>Escalate</span>
              </button>
            )}

            {/* Add Internal Note */}
            <button
              onClick={() => setNoteOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <StickyNote className="w-3.5 h-3.5 text-slate-600" />
              <span>Add Note</span>
            </button>

            {/* Resolve Case */}
            {caseItem.status !== 'Resolved' && caseItem.status !== 'Closed' && (
              <button
                onClick={() => setResolveOpen(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Resolve Case</span>
              </button>
            )}

            {/* Close Case */}
            {caseItem.status === 'Resolved' && (
              <button
                onClick={() => setCloseOpen(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Close Case</span>
              </button>
            )}

            {/* Reopen Case */}
            {(caseItem.status === 'Resolved' || caseItem.status === 'Closed') && (
              <button
                onClick={() => setReopenOpen(true)}
                className="px-3.5 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                <span>Reopen Case</span>
              </button>
            )}
          </div>
        </div>

        {/* Status Stepper Progression */}
        <div className="py-2">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
            <span>Lifecycle Milestone Progression</span>
            <span>Current Stage: <strong className="text-blue-700">{caseItem.status}</strong></span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {LIFECYCLE_STAGES.map((st, idx) => {
              const isDone = currentStageIdx > idx || caseItem.status === 'Closed';
              const isCurrent = caseItem.status === st && caseItem.status !== 'Closed';

              return (
                <div
                  key={st}
                  className={`p-2.5 rounded-lg border text-center transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : isDone
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1 text-[11px] font-semibold">
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-current text-[9px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                    )}
                    <span className="truncate">{st}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Grid: LEFT Details / RIGHT SLA Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          {/* LEFT 7 Cols: Detailed Information & Reporter Card */}
          <div className="lg:col-span-7 space-y-6">
            {/* Grievance Narrative */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Full Description & Incident Details
              </h3>
              <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                {caseItem.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Locality / Area</span>
                  <span className="font-semibold text-slate-800">{caseItem.area}</span>
                  {caseItem.address && (
                    <p className="text-slate-500 text-[11px] mt-0.5">{caseItem.address}</p>
                  )}
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Reported Incident Date</span>
                  <span className="font-semibold text-slate-800">{caseItem.incidentDate}</span>
                </div>
              </div>

              {caseItem.attachmentName && (
                <div className="pt-2">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Uploaded Citizen Attachment
                  </span>
                  <div className="inline-flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg text-xs text-blue-700 font-medium">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>{caseItem.attachmentName}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Reporter Contact Info (Staff authorized view) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Reporter Contact Information</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Staff Access Authorized
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Name</span>
                  <span className="font-semibold text-slate-800">{caseItem.reporterName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Phone</span>
                  <span className="font-mono font-medium text-slate-800 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {caseItem.reporterPhone}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Email</span>
                  <span className="font-mono text-slate-800 flex items-center gap-1 mt-0.5 truncate">
                    <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                    {caseItem.reporterEmail}
                  </span>
                </div>
              </div>
            </div>

            {/* Resolution Statement (if resolved) */}
            {caseItem.resolutionNote && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Department Resolution Record</span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-emerald-100">
                  {caseItem.resolutionNote}
                </p>
                <div className="flex justify-between text-[11px] text-emerald-800 pt-1">
                  <span>Signed off on: {caseItem.resolvedAt ? formatDateTime(caseItem.resolvedAt) : 'Logged'}</span>
                  {caseItem.resolutionEvidence && (
                    <span className="font-semibold">Evidence: {caseItem.resolutionEvidence}</span>
                  )}
                </div>
              </div>
            )}

            {/* Internal Staff Notes & Quick Form */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <StickyNote className="w-4 h-4 text-indigo-600" />
                  <span>Internal Staff Coordination Notes ({caseItem.internalNotes.length})</span>
                </div>
                <span className="text-[10px] text-slate-400">Shielded from Public View</span>
              </div>

              {/* Notes List */}
              <div className="space-y-2.5 max-h-48 overflow-y-auto">
                {caseItem.internalNotes.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">No internal operational notes added yet.</p>
                ) : (
                  caseItem.internalNotes.map(n => (
                    <div key={n.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-semibold text-slate-700">{n.author} ({n.role})</span>
                        <span>{formatDateTime(n.createdAt)}</span>
                      </div>
                      <p className="text-slate-700">{n.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Quick Note Input */}
              <form onSubmit={handleQuickNoteSubmit} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={quickNote}
                  onChange={e => setQuickNote(e.target.value)}
                  placeholder="Type a quick internal update..."
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!quickNote.trim()}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold disabled:opacity-40 transition-colors flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Save</span>
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT 5 Cols: Deadline Card & Demo Controls */}
          <div className="lg:col-span-5 space-y-6">
            {/* Deadline & SLA Monitor Card */}
            <div className={`rounded-xl border p-6 space-y-4 shadow-xs ${
              risk === 'OVERDUE'
                ? 'bg-red-50/50 border-red-300'
                : risk === 'AT RISK'
                ? 'bg-amber-50/50 border-amber-300'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className={`w-5 h-5 ${risk === 'OVERDUE' ? 'text-red-600' : 'text-blue-600'}`} />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    SLA Deadline Monitor
                  </h3>
                </div>
                <RiskBadge risk={risk} />
              </div>

              <div className="space-y-3 py-2 border-y border-slate-200/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Target Resolution:</span>
                  <span className="font-bold text-slate-800">
                    {formatDateTime(caseItem.targetResolutionDate)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Remaining SLA:</span>
                  <span className={`font-mono font-bold ${
                    risk === 'OVERDUE' ? 'text-red-600 text-sm' : 'text-slate-900'
                  }`}>
                    {remaining.text}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">SLA Priority Tier:</span>
                  <PriorityBadge priority={caseItem.priority} size="sm" />
                </div>
              </div>

              {/* Escalation details if active */}
              {caseItem.isEscalated && (
                <div className="p-3 bg-red-100/70 border border-red-300 rounded-lg text-xs text-red-900 space-y-1">
                  <div className="flex items-center gap-1 font-bold">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-700" />
                    <span>Active Case Escalation</span>
                  </div>
                  <p>Reason: <strong className="text-red-950">{caseItem.escalationReason}</strong></p>
                  {caseItem.escalationNote && (
                    <p className="text-[11px] text-red-800 italic">&quot;{caseItem.escalationNote}&quot;</p>
                  )}
                  {caseItem.escalatedAt && (
                    <p className="text-[10px] text-red-600">Escalated: {formatDateTime(caseItem.escalatedAt)}</p>
                  )}
                </div>
              )}

              {/* DEMO SIMULATION CONTROLS (Hackathon presentation testing - Req 37) */}
              <div className="p-4 bg-slate-900 rounded-xl text-white space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>DEMO TIME SIMULATION (For Judges)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Simulate time passing to test SLA transitions, overdue alerts, and manager escalation workflows:
                </p>

                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => simulateDeadline(caseItem.id, 'normal')}
                    className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-medium transition-colors"
                  >
                    Normal
                  </button>

                  <button
                    type="button"
                    onClick={() => simulateDeadline(caseItem.id, 'due-soon')}
                    className="px-2 py-1.5 bg-amber-900/60 hover:bg-amber-800/80 text-amber-200 border border-amber-700 rounded text-[11px] font-medium transition-colors"
                  >
                    Due Soon
                  </button>

                  <button
                    type="button"
                    onClick={() => simulateDeadline(caseItem.id, 'overdue')}
                    className="px-2 py-1.5 bg-red-900/80 hover:bg-red-800 text-white border border-red-700 rounded text-[11px] font-bold transition-colors"
                  >
                    Overdue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity & Full Audit Timeline */}
        <div className="pt-8 border-t border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Complete Activity & Audit Timeline
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {caseItem.auditTrail.length} recorded events
            </span>
          </div>

          <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 py-2">
            {caseItem.auditTrail.map((ev, index) => (
              <div key={ev.id} className="relative pl-6">
                {/* Node icon */}
                <div className={`absolute -left-2 top-0.5 w-4 h-4 rounded-full border-2 border-white ${
                  ev.action.includes('Resolved')
                    ? 'bg-emerald-600'
                    : ev.action.includes('Escalated')
                    ? 'bg-red-600'
                    : ev.action.includes('Assigned')
                    ? 'bg-blue-600'
                    : 'bg-slate-500'
                }`} />

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-slate-500">
                    <span className="font-mono text-[11px]">{formatDateTime(ev.timestamp)}</span>
                    <span className="font-semibold text-slate-800">
                      {ev.user} <span className="text-slate-400 font-normal">({ev.role})</span>
                    </span>
                  </div>

                  <p className="font-bold text-slate-900">{ev.action}</p>
                  <p className="text-slate-700">{ev.description}</p>

                  {ev.note && (
                    <div className="p-2 bg-white rounded border border-slate-200 text-slate-600 italic">
                      &quot;{ev.note}&quot;
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals for lifecycle actions */}
      <AssignmentModal
        isOpen={assignOpen}
        onClose={() => setAssignOpen(false)}
        caseId={caseItem.id}
        currentDepartment={caseItem.department}
        currentOfficer={caseItem.assignedOfficer}
        onAssign={(dept, officer, note) => assignGrievance(caseItem.id, dept, officer, note)}
      />

      <StatusChangeModal
        isOpen={statusOpen}
        onClose={() => setStatusOpen(false)}
        caseId={caseItem.id}
        currentStatus={caseItem.status}
        onUpdateStatus={(st, note) => updateStatus(caseItem.id, st, note)}
      />

      <EscalateModal
        isOpen={escalateOpen}
        onClose={() => setEscalateOpen(false)}
        caseId={caseItem.id}
        onEscalate={(reason, note) => escalateGrievance(caseItem.id, reason, note)}
      />

      <ResolveModal
        isOpen={resolveOpen}
        onClose={() => setResolveOpen(false)}
        caseId={caseItem.id}
        onResolve={(note, evidence) => resolveGrievance(caseItem.id, note, evidence)}
      />

      <ReopenModal
        isOpen={reopenOpen}
        onClose={() => setReopenOpen(false)}
        caseId={caseItem.id}
        onReopen={reason => reopenGrievance(caseItem.id, reason)}
      />

      <CloseConfirmModal
        isOpen={closeOpen}
        onClose={() => setCloseOpen(false)}
        caseId={caseItem.id}
        onConfirmClose={note => closeGrievance(caseItem.id, note)}
      />

      <AddNoteModal
        isOpen={noteOpen}
        onClose={() => setNoteOpen(false)}
        caseId={caseItem.id}
        onAddNote={note => addInternalNote(caseItem.id, note)}
      />
    </div>
  );
};
