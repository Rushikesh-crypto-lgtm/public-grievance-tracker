import React from 'react';
import { GrievanceStatus, Priority, RiskState } from '../../types/grievance';
import { AlertTriangle, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  switch (priority) {
    case 'CRITICAL':
      return (
        <span className={`inline-flex items-center gap-1 rounded font-semibold tracking-wider bg-red-100 text-red-800 border border-red-300 ${sizeClasses}`}>
          <AlertTriangle className="w-3 h-3 text-red-600" />
          CRITICAL
        </span>
      );
    case 'HIGH':
      return (
        <span className={`inline-flex items-center gap-1 rounded font-medium tracking-wide bg-amber-100 text-amber-900 border border-amber-300 ${sizeClasses}`}>
          HIGH
        </span>
      );
    case 'MEDIUM':
      return (
        <span className={`inline-flex items-center gap-1 rounded font-medium tracking-wide bg-blue-100 text-blue-800 border border-blue-200 ${sizeClasses}`}>
          MEDIUM
        </span>
      );
    case 'LOW':
    default:
      return (
        <span className={`inline-flex items-center gap-1 rounded font-medium tracking-wide bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}>
          LOW
        </span>
      );
  }
};

interface StatusBadgeProps {
  status: GrievanceStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  switch (status) {
    case 'Submitted':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
          Submitted
        </span>
      );
    case 'Acknowledged':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          Acknowledged
        </span>
      );
    case 'In Progress':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-800 border border-blue-300 font-medium ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
          In Progress
        </span>
      );
    case 'Awaiting Information':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Awaiting Info
        </span>
      );
    case 'Resolved':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-medium ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Resolved
        </span>
      );
    case 'Closed':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
          Closed
        </span>
      );
  }
};

interface RiskBadgeProps {
  risk: RiskState;
  size?: 'sm' | 'md';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ risk, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  switch (risk) {
    case 'OVERDUE':
      return (
        <span className={`inline-flex items-center gap-1 rounded bg-red-50 text-red-700 border border-red-300 font-bold tracking-wider ${sizeClasses}`}>
          <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
          OVERDUE
        </span>
      );
    case 'AT RISK':
      return (
        <span className={`inline-flex items-center gap-1 rounded bg-amber-50 text-amber-800 border border-amber-300 font-semibold tracking-wide ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          AT RISK
        </span>
      );
    case 'ON TRACK':
    default:
      return (
        <span className={`inline-flex items-center gap-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          ON TRACK
        </span>
      );
  }
};

export const EscalatedBadge: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-bold';
  return (
    <span className={`inline-flex items-center gap-1 rounded bg-rose-600 text-white shadow-xs tracking-wider uppercase ${sizeClasses}`}>
      <ShieldAlert className="w-3.5 h-3.5 text-white" />
      Escalated
    </span>
  );
};
