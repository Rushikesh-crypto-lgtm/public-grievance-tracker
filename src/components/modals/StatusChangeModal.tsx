import React, { useState } from 'react';
import { GrievanceStatus } from '../../types/grievance';
import { getAvailableStatusTransitions } from '../../utils/sla';
import { X, RefreshCw } from 'lucide-react';
import { StatusBadge } from '../common/Badge';

interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  currentStatus: GrievanceStatus;
  onUpdateStatus: (newStatus: GrievanceStatus, note?: string) => void;
}

export const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
  isOpen,
  onClose,
  caseId,
  currentStatus,
  onUpdateStatus
}) => {
  const allowedTransitions = getAvailableStatusTransitions(currentStatus);
  const [selectedStatus, setSelectedStatus] = useState<GrievanceStatus>(
    allowedTransitions[0] || currentStatus
  );
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStatus) return;
    onUpdateStatus(selectedStatus, note.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Advance Case Status</h3>
              <p className="text-xs text-slate-500 font-mono">Case ID: {caseId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Current Status:</span>
            <StatusBadge status={currentStatus} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Select Next Status <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {allowedTransitions.map(st => (
                <label
                  key={st}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedStatus === st
                      ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="nextStatus"
                      value={st}
                      checked={selectedStatus === st}
                      onChange={() => setSelectedStatus(st)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-semibold text-slate-800">{st}</span>
                  </div>
                  <StatusBadge status={st} size="sm" />
                </label>
              ))}

              {allowedTransitions.length === 0 && (
                <p className="text-sm text-slate-500 italic p-3 bg-slate-50 rounded-lg">
                  No standard transitions available from {currentStatus}.
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Reason / Status Update Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
              placeholder="Provide context for this lifecycle change (recorded in public/internal audit log)..."
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={allowedTransitions.length === 0}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              Confirm Status Change
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
