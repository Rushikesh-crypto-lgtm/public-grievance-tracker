export type GrievanceStatus =
  | 'Submitted'
  | 'Acknowledged'
  | 'In Progress'
  | 'Awaiting Information'
  | 'Resolved'
  | 'Closed';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type RiskState = 'ON TRACK' | 'AT RISK' | 'OVERDUE';

export type Department =
  | 'Roads & Infrastructure'
  | 'Water Supply'
  | 'Electricity'
  | 'Sanitation'
  | 'Street Lighting'
  | 'Public Safety'
  | 'Waste Management'
  | 'Transportation'
  | 'Other';

export interface AuditEvent {
  id: string;
  timestamp: string;
  user: string;
  role: 'Citizen' | 'Staff' | 'Manager' | 'System';
  action: string;
  description: string;
  note?: string;
}

export interface InternalNote {
  id: string;
  author: string;
  role: string;
  text: string;
  createdAt: string;
}

export interface Grievance {
  id: string;
  title: string;
  category: Department;
  subcategory?: string;
  description: string;
  incidentDate: string;
  area: string;
  address?: string;
  attachmentName?: string;
  // Citizen contact info (shielded from public tracking)
  reporterName: string;
  reporterEmail: string;
  reporterPhone: string;
  // Lifecycle
  status: GrievanceStatus;
  priority: Priority;
  department: Department | 'Unassigned';
  assignedOfficer: string;
  submittedAt: string;
  targetResolutionDate: string;
  simulatedTimeShiftHours?: number; // Demo simulation helper
  // Escalation
  isEscalated: boolean;
  escalationReason?: string;
  escalationNote?: string;
  escalatedAt?: string;
  // Resolution
  resolutionNote?: string;
  resolutionEvidence?: string;
  resolvedAt?: string;
  closedAt?: string;
  // Audit & Notes
  auditTrail: AuditEvent[];
  internalNotes: InternalNote[];
}

export type UserRole = 'citizen' | 'staff' | 'manager';

export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  department?: Department;
  designation: string;
  avatar?: string;
}

export interface NotificationItem {
  id: string;
  caseId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  read: boolean;
  createdAt: string;
}

export const DEPARTMENT_OFFICERS: Record<Department, string[]> = {
  'Roads & Infrastructure': ['Rahul Kumar', 'Ananya Sharma', 'Vikram Singh', 'Pradeep Reddy'],
  'Water Supply': ['Suresh Varma', 'Kavitha Rao', 'Mohammed Zameer'],
  'Electricity': ['Ramesh Chandran', 'Sneha Patel', 'Ajay Varma'],
  'Sanitation': ['Sunita Devi', 'Kalyan Chakravarthy', 'Deepak Joshi'],
  'Street Lighting': ['Arun Venkatesh', 'Manish Gupta'],
  'Public Safety': ['Inspector R. Naidu', 'Officer Neha Agarwal'],
  'Waste Management': ['Pooja Hegde', 'Naveen Kumar'],
  'Transportation': ['Divya Nambiar', 'Raghavendra Rao'],
  'Other': ['General Desk Staff', 'Admin Helpdesk']
};

export const HYDERABAD_AREAS = [
  'Gachibowli',
  'Hitech City',
  'Madhapur',
  'Kukatpally',
  'Secunderabad',
  'Banjara Hills',
  'Jubilee Hills',
  'Kondapur',
  'Begumpet',
  'Ameerpet',
  'Miyapur',
  'Mehdipatnam'
];

export const SLA_HOURS_BY_PRIORITY: Record<Priority, number> = {
  LOW: 7 * 24,      // 7 days = 168h
  MEDIUM: 5 * 24,   // 5 days = 120h
  HIGH: 3 * 24,     // 3 days = 72h
  CRITICAL: 24      // 24 hours
};
