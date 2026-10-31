import { Grievance, GrievanceStatus, Priority, RiskState } from '../types/grievance';

/**
 * Computes remaining milliseconds taking into account simulated time shifts
 */
export function getEffectiveTargetAndRemaining(grievance: Grievance, currentTime = new Date()) {
  const targetDate = new Date(grievance.targetResolutionDate);
  const shiftHours = grievance.simulatedTimeShiftHours || 0;
  
  // Shift moves effective deadline forward or backwards
  const effectiveTarget = new Date(targetDate.getTime() - shiftHours * 60 * 60 * 1000);
  const submittedDate = new Date(grievance.submittedAt);
  
  const totalDurationMs = Math.max(1, effectiveTarget.getTime() - submittedDate.getTime());
  const remainingMs = effectiveTarget.getTime() - currentTime.getTime();
  
  return {
    effectiveTarget,
    totalDurationMs,
    remainingMs
  };
}

export function computeRiskState(grievance: Grievance, currentTime = new Date()): RiskState {
  // If already resolved or closed, it's not overdue or at risk
  if (grievance.status === 'Resolved' || grievance.status === 'Closed') {
    return 'ON TRACK';
  }

  const { totalDurationMs, remainingMs } = getEffectiveTargetAndRemaining(grievance, currentTime);

  if (remainingMs <= 0) {
    return 'OVERDUE';
  }

  const remainingRatio = remainingMs / totalDurationMs;
  if (remainingRatio <= 0.3) {
    return 'AT RISK';
  }

  return 'ON TRACK';
}

export function formatTimeRemaining(grievance: Grievance, currentTime = new Date()): {
  text: string;
  isOverdue: boolean;
  hours: number;
} {
  if (grievance.status === 'Resolved') {
    return { text: 'Resolved', isOverdue: false, hours: 0 };
  }
  if (grievance.status === 'Closed') {
    return { text: 'Closed', isOverdue: false, hours: 0 };
  }

  const { remainingMs } = getEffectiveTargetAndRemaining(grievance, currentTime);
  const totalHours = Math.round(remainingMs / (1000 * 60 * 60));

  if (remainingMs <= 0) {
    const overdueMs = Math.abs(remainingMs);
    const overdueHours = Math.floor(overdueMs / (1000 * 60 * 60));
    const overdueDays = Math.floor(overdueHours / 24);
    const remHours = overdueHours % 24;

    if (overdueDays > 0) {
      return {
        text: `Overdue by ${overdueDays}d ${remHours}h`,
        isOverdue: true,
        hours: -overdueHours
      };
    }
    return {
      text: `Overdue by ${Math.max(1, overdueHours)} hours`,
      isOverdue: true,
      hours: -overdueHours
    };
  }

  const remHours = totalHours;
  if (remHours >= 48) {
    const days = Math.floor(remHours / 24);
    const h = remHours % 24;
    return { text: `${days} days ${h > 0 ? `${h}h` : ''} remaining`, isOverdue: false, hours: remHours };
  }

  return { text: `${Math.max(1, remHours)} hours remaining`, isOverdue: false, hours: remHours };
}

export function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  } catch {
    return isoString;
  }
}

export function formatDateOnly(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  } catch {
    return isoString;
  }
}

export function getAvailableStatusTransitions(currentStatus: GrievanceStatus): GrievanceStatus[] {
  switch (currentStatus) {
    case 'Submitted':
      return ['Acknowledged'];
    case 'Acknowledged':
      return ['In Progress'];
    case 'In Progress':
      return ['Awaiting Information', 'Resolved'];
    case 'Awaiting Information':
      return ['In Progress'];
    case 'Resolved':
      return ['Closed', 'In Progress']; // in progress via reopen
    case 'Closed':
      return ['In Progress']; // reopen
    default:
      return [];
  }
}
