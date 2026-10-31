import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Grievance,
  GrievanceStatus,
  UserRole,
  UserProfile,
  Department,
  Priority,
  NotificationItem,
  SLA_HOURS_BY_PRIORITY
} from '../types/grievance';
import { INITIAL_GRIEVANCES, INITIAL_NOTIFICATIONS } from '../data/mockData';
import { computeRiskState } from '../utils/sla';

const STORAGE_KEY = 'pgt_grievances_state_v1';
const NOTIF_STORAGE_KEY = 'pgt_notifications_state_v1';
const ROLE_STORAGE_KEY = 'pgt_active_role_v1';

export const DEMO_PROFILES: Record<UserRole, UserProfile> = {
  citizen: {
    name: 'Citizen Portal',
    email: 'citizen@pgt.demo',
    role: 'citizen',
    designation: 'Public Resident'
  },
  staff: {
    name: 'Rahul Kumar',
    email: 'staff@pgt.demo',
    role: 'staff',
    department: 'Roads & Infrastructure',
    designation: 'Senior Field Officer',
    avatar: 'RK'
  },
  manager: {
    name: 'Ananya Sharma',
    email: 'manager@pgt.demo',
    role: 'manager',
    designation: 'Operations Director & Chief Zonal Grievance Officer',
    avatar: 'AS'
  }
};

interface GrievanceContextType {
  grievances: Grievance[];
  currentRole: UserRole;
  currentUser: UserProfile;
  notifications: NotificationItem[];
  unreadCount: number;
  toastMessage: { text: string; type: 'success' | 'info' | 'warning' | 'error' } | null;
  showToast: (text: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  clearToast: () => void;
  setRole: (role: UserRole) => void;
  loginAs: (role: UserRole) => void;
  logout: () => void;
  getGrievanceById: (id: string) => Grievance | undefined;
  addGrievance: (data: {
    title: string;
    category: Department;
    subcategory?: string;
    description: string;
    incidentDate: string;
    area: string;
    address?: string;
    attachmentName?: string;
    reporterName: string;
    reporterEmail: string;
    reporterPhone: string;
    priority?: Priority;
  }) => Grievance;
  assignGrievance: (caseId: string, department: Department, officer: string, note?: string) => void;
  updateStatus: (caseId: string, newStatus: GrievanceStatus, note?: string) => void;
  escalateGrievance: (caseId: string, reason: string, note?: string) => void;
  resolveGrievance: (caseId: string, resolutionNote: string, resolutionEvidence?: string) => void;
  closeGrievance: (caseId: string, note?: string) => void;
  reopenGrievance: (caseId: string, reason: string) => void;
  addInternalNote: (caseId: string, text: string) => void;
  simulateDeadline: (caseId: string, mode: 'normal' | 'due-soon' | 'overdue') => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetToDemoData: () => void;
}

const GrievanceContext = createContext<GrievanceContextType | undefined>(undefined);

export const GrievanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [grievances, setGrievances] = useState<Grievance[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_GRIEVANCES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(NOTIF_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(ROLE_STORAGE_KEY);
      if (saved === 'staff' || saved === 'manager' || saved === 'citizen') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'citizen';
  });

  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'info' | 'warning' | 'error';
  } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(grievances));
  }, [grievances]);

  useEffect(() => {
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(ROLE_STORAGE_KEY, currentRole);
  }, [currentRole]);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setToastMessage({ text, type });
  };

  const clearToast = () => {
    setToastMessage(null);
  };

  const setRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const loginAs = (role: UserRole) => {
    setCurrentRole(role);
    showToast(`Logged in as ${DEMO_PROFILES[role].name} (${role.toUpperCase()})`, 'info');
  };

  const logout = () => {
    setCurrentRole('citizen');
    showToast('Logged out to Citizen view', 'info');
  };

  const currentUser = DEMO_PROFILES[currentRole];

  const unreadCount = notifications.filter(n => !n.read).length;

  const getGrievanceById = (id: string): Grievance | undefined => {
    return grievances.find(g => g.id.toLowerCase() === id.trim().toLowerCase());
  };

  const addGrievance = (data: {
    title: string;
    category: Department;
    subcategory?: string;
    description: string;
    incidentDate: string;
    area: string;
    address?: string;
    attachmentName?: string;
    reporterName: string;
    reporterEmail: string;
    reporterPhone: string;
    priority?: Priority;
  }): Grievance => {
    // Generate next case ID: e.g. find maximum existing PG-2026-00XXX and increment
    const existingNumbers = grievances
      .map(g => {
        const match = g.id.match(/PG-2026-(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(n => !isNaN(n));
    const nextNum = Math.max(...existingNumbers, 126) + 1;
    const formattedId = `PG-2026-${String(nextNum).padStart(5, '0')}`;

    const priority: Priority = data.priority || 'HIGH';
    const now = new Date();
    const slaHours = SLA_HOURS_BY_PRIORITY[priority] || 72;
    const targetDate = new Date(now.getTime() + slaHours * 60 * 60 * 1000);

    const newGrievance: Grievance = {
      id: formattedId,
      title: data.title || `${data.category} Issue in ${data.area}`,
      category: data.category,
      subcategory: data.subcategory,
      description: data.description,
      incidentDate: data.incidentDate || now.toISOString().split('T')[0],
      area: data.area,
      address: data.address,
      attachmentName: data.attachmentName,
      reporterName: data.reporterName,
      reporterEmail: data.reporterEmail,
      reporterPhone: data.reporterPhone,
      status: 'Submitted',
      priority,
      department: data.category, // Auto-route to respective department
      assignedOfficer: 'Unassigned',
      submittedAt: now.toISOString(),
      targetResolutionDate: targetDate.toISOString(),
      simulatedTimeShiftHours: 0,
      isEscalated: false,
      auditTrail: [
        {
          id: `aud-${Date.now()}-1`,
          timestamp: now.toISOString(),
          user: data.reporterName || 'Citizen',
          role: 'Citizen',
          action: 'Case Created',
          description: `Grievance submitted for ${data.category} in ${data.area}.`,
          note: data.attachmentName ? `Attached file: ${data.attachmentName}` : undefined
        },
        {
          id: `aud-${Date.now()}-2`,
          timestamp: new Date(now.getTime() + 1000).toISOString(),
          user: 'System Router',
          role: 'System',
          action: 'Case Routed',
          description: `Auto-routed to department: ${data.category}. Priority: ${priority} (${slaHours}h SLA target).`
        }
      ],
      internalNotes: []
    };

    setGrievances(prev => [newGrievance, ...prev]);

    // Add notification for staff/manager
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      caseId: formattedId,
      title: 'New Citizen Grievance',
      message: `Case ${formattedId} lodged by ${data.reporterName} in ${data.area}.`,
      type: 'info',
      read: false,
      createdAt: now.toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(`Grievance ${formattedId} successfully registered!`, 'success');
    return newGrievance;
  };

  const assignGrievance = (caseId: string, department: Department, officer: string, note?: string) => {
    const now = new Date().toISOString();
    setGrievances(prev =>
      prev.map(g => {
        if (g.id !== caseId) return g;

        const auditItem = {
          id: `aud-${Date.now()}`,
          timestamp: now,
          user: currentUser.name,
          role: currentUser.role === 'manager' ? ('Manager' as const) : ('Staff' as const),
          action: 'Case Assigned',
          description: `Department set to ${department}, assigned to ${officer}.`,
          note: note ? `Assignment note: ${note}` : undefined
        };

        return {
          ...g,
          department,
          assignedOfficer: officer,
          auditTrail: [auditItem, ...g.auditTrail]
        };
      })
    );

    // Add notification for the assigned officer
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      caseId,
      title: 'Case Assigned to You',
      message: `Case ${caseId} assigned to ${officer} by ${currentUser.name}.`,
      type: 'info',
      read: false,
      createdAt: now
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(`Case ${caseId} assigned to ${officer} (${department})`, 'success');
  };

  const updateStatus = (caseId: string, newStatus: GrievanceStatus, note?: string) => {
    const now = new Date().toISOString();
    setGrievances(prev =>
      prev.map(g => {
        if (g.id !== caseId) return g;

        const oldStatus = g.status;
        const auditItem = {
          id: `aud-${Date.now()}`,
          timestamp: now,
          user: currentUser.name,
          role: currentUser.role === 'manager' ? ('Manager' as const) : ('Staff' as const),
          action: 'Status Changed',
          description: `${oldStatus} → ${newStatus}`,
          note: note ? note : undefined
        };

        return {
          ...g,
          status: newStatus,
          auditTrail: [auditItem, ...g.auditTrail]
        };
      })
    );

    showToast(`Status updated to ${newStatus}`, 'success');
  };

  const escalateGrievance = (caseId: string, reason: string, note?: string) => {
    const now = new Date().toISOString();
    setGrievances(prev =>
      prev.map(g => {
        if (g.id !== caseId) return g;

        const auditItem = {
          id: `aud-${Date.now()}`,
          timestamp: now,
          user: currentUser.name,
          role: currentUser.role === 'manager' ? ('Manager' as const) : ('Staff' as const),
          action: 'Case Escalated',
          description: `Escalated by ${currentUser.name}. Reason: ${reason}`,
          note: note ? note : undefined
        };

        return {
          ...g,
          isEscalated: true,
          escalationReason: reason,
          escalationNote: note,
          escalatedAt: now,
          auditTrail: [auditItem, ...g.auditTrail]
        };
      })
    );

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      caseId,
      title: 'Grievance Escalated',
      message: `Case ${caseId} has been escalated: "${reason}". Requires manager intervention.`,
      type: 'warning',
      read: false,
      createdAt: now
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(`Case ${caseId} escalated to Manager oversight!`, 'warning');
  };

  const resolveGrievance = (caseId: string, resolutionNote: string, resolutionEvidence?: string) => {
    const now = new Date().toISOString();
    setGrievances(prev =>
      prev.map(g => {
        if (g.id !== caseId) return g;

        const auditItem = {
          id: `aud-${Date.now()}`,
          timestamp: now,
          user: currentUser.name,
          role: currentUser.role === 'manager' ? ('Manager' as const) : ('Staff' as const),
          action: 'Case Resolved',
          description: `${g.status} → Resolved`,
          note: `Resolution: ${resolutionNote}${resolutionEvidence ? ` (Evidence: ${resolutionEvidence})` : ''}`
        };

        return {
          ...g,
          status: 'Resolved',
          resolutionNote,
          resolutionEvidence,
          resolvedAt: now,
          auditTrail: [auditItem, ...g.auditTrail]
        };
      })
    );

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      caseId,
      title: 'Case Resolved',
      message: `Case ${caseId} has been resolved by ${currentUser.name}.`,
      type: 'success',
      read: false,
      createdAt: now
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(`Case ${caseId} marked as Resolved!`, 'success');
  };

  const closeGrievance = (caseId: string, note?: string) => {
    const now = new Date().toISOString();
    setGrievances(prev =>
      prev.map(g => {
        if (g.id !== caseId) return g;

        const auditItem = {
          id: `aud-${Date.now()}`,
          timestamp: now,
          user: currentUser.name,
          role: currentUser.role === 'manager' ? ('Manager' as const) : ('Staff' as const),
          action: 'Case Closed',
          description: `${g.status} → Closed`,
          note: note ? note : 'Case officially closed after citizen satisfaction window.'
        };

        return {
          ...g,
          status: 'Closed',
          closedAt: now,
          auditTrail: [auditItem, ...g.auditTrail]
        };
      })
    );

    showToast(`Case ${caseId} officially closed!`, 'success');
  };

  const reopenGrievance = (caseId: string, reason: string) => {
    const now = new Date().toISOString();
    setGrievances(prev =>
      prev.map(g => {
        if (g.id !== caseId) return g;

        const auditItem = {
          id: `aud-${Date.now()}`,
          timestamp: now,
          user: currentUser.name,
          role: currentUser.role === 'manager' ? ('Manager' as const) : ('Staff' as const),
          action: 'Case Reopened',
          description: `${g.status} → In Progress`,
          note: `Reopened reason: ${reason}`
        };

        return {
          ...g,
          status: 'In Progress',
          auditTrail: [auditItem, ...g.auditTrail]
        };
      })
    );

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      caseId,
      title: 'Case Reopened',
      message: `Case ${caseId} was reopened by ${currentUser.name}: ${reason}`,
      type: 'warning',
      read: false,
      createdAt: now
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(`Case ${caseId} reopened to In Progress`, 'warning');
  };

  const addInternalNote = (caseId: string, text: string) => {
    const now = new Date().toISOString();
    setGrievances(prev =>
      prev.map(g => {
        if (g.id !== caseId) return g;

        const newNote = {
          id: `not-${Date.now()}`,
          author: currentUser.name,
          role: currentUser.role,
          text,
          createdAt: now
        };

        const auditItem = {
          id: `aud-${Date.now()}`,
          timestamp: now,
          user: currentUser.name,
          role: currentUser.role === 'manager' ? ('Manager' as const) : ('Staff' as const),
          action: 'Internal Note Added',
          description: 'Added an internal operational note.',
          note: text
        };

        return {
          ...g,
          internalNotes: [...g.internalNotes, newNote],
          auditTrail: [auditItem, ...g.auditTrail]
        };
      })
    );

    showToast('Internal note saved to case', 'info');
  };

  const simulateDeadline = (caseId: string, mode: 'normal' | 'due-soon' | 'overdue') => {
    setGrievances(prev =>
      prev.map(g => {
        if (g.id !== caseId) return g;

        let shiftHours = 0;
        if (mode === 'due-soon') {
          // Make it due in ~2 hours (less than 30% remaining -> AT RISK)
          const target = new Date(g.targetResolutionDate);
          const submitted = new Date(g.submittedAt);
          const now = new Date();
          const totalDuration = target.getTime() - submitted.getTime();
          // We want effective remaining to be ~2 hours
          const desiredTarget = now.getTime() + 2 * 60 * 60 * 1000;
          shiftHours = (target.getTime() - desiredTarget) / (60 * 60 * 1000);
        } else if (mode === 'overdue') {
          // Make it overdue by 18 hours
          const target = new Date(g.targetResolutionDate);
          const now = new Date();
          const desiredTarget = now.getTime() - 18 * 60 * 60 * 1000;
          shiftHours = (target.getTime() - desiredTarget) / (60 * 60 * 1000);
        } else {
          // normal
          shiftHours = 0;
        }

        return {
          ...g,
          simulatedTimeShiftHours: shiftHours
        };
      })
    );

    const modeLabel =
      mode === 'overdue'
        ? 'Case simulated as OVERDUE'
        : mode === 'due-soon'
        ? 'Case simulated as AT RISK (Due soon)'
        : 'Case reset to NORMAL target time';
    showToast(modeLabel, mode === 'overdue' ? 'error' : 'info');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const resetToDemoData = () => {
    setGrievances(INITIAL_GRIEVANCES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentRole('citizen');
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(NOTIF_STORAGE_KEY);
    localStorage.removeItem(ROLE_STORAGE_KEY);
    showToast('Seeded demo data reset successfully!', 'info');
  };

  return (
    <GrievanceContext.Provider
      value={{
        grievances,
        currentRole,
        currentUser,
        notifications,
        unreadCount,
        toastMessage,
        showToast,
        clearToast,
        setRole,
        loginAs,
        logout,
        getGrievanceById,
        addGrievance,
        assignGrievance,
        updateStatus,
        escalateGrievance,
        resolveGrievance,
        closeGrievance,
        reopenGrievance,
        addInternalNote,
        simulateDeadline,
        markNotificationRead,
        markAllNotificationsRead,
        resetToDemoData
      }}
    >
      {children}
    </GrievanceContext.Provider>
  );
};

export const useGrievance = () => {
  const context = useContext(GrievanceContext);
  if (!context) {
    throw new Error('useGrievance must be used within a GrievanceProvider');
  }
  return context;
};
