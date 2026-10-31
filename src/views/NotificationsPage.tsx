import React from 'react';
import { useGrievance } from '../context/GrievanceContext';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  CheckCheck,
  Building,
  Info
} from 'lucide-react';
import { formatDateTime } from '../utils/sla';

interface NotificationsPageProps {
  onNavigate: (view: string, caseId?: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigate }) => {
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useGrievance();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Notifications & Alerts</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 text-xs font-bold bg-red-100 text-red-700 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time notifications regarding case assignments, SLA breaches, escalations, and closures.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="px-3.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 divide-y divide-slate-100 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            <Bell className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
            <p className="font-semibold text-slate-700 text-sm">No notifications</p>
            <p className="text-slate-400 mt-0.5">You are fully caught up with all case updates.</p>
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationRead(n.id);
                if (n.caseId) {
                  onNavigate('case-detail', n.caseId);
                }
              }}
              className={`p-4 hover:bg-blue-50/50 cursor-pointer transition-colors flex items-start gap-4 ${
                !n.read ? 'bg-blue-50/30' : ''
              }`}
            >
              {/* Type Icon */}
              <div className="mt-0.5">
                {n.type === 'alert' ? (
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                ) : n.type === 'warning' ? (
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                ) : n.type === 'success' ? (
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Info className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {formatDateTime(n.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                {n.caseId && (
                  <span className="inline-block font-mono text-[11px] font-semibold text-blue-600 hover:underline pt-0.5">
                    Inspect Case {n.caseId} →
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
