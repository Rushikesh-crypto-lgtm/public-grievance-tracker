import React, { useState } from 'react';
import { Department, DEPARTMENT_OFFICERS } from '../../types/grievance';
import { X, UserCheck } from 'lucide-react';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  currentDepartment: string;
  currentOfficer: string;
  onAssign: (department: Department, officer: string, note?: string) => void;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  caseId,
  currentDepartment,
  currentOfficer,
  onAssign
}) => {
  const departments = Object.keys(DEPARTMENT_OFFICERS) as Department[];

  const initialDept = departments.includes(currentDepartment as Department)
    ? (currentDepartment as Department)
    : 'Roads & Infrastructure';

  const [selectedDept, setSelectedDept] = useState<Department>(initialDept);
  const [selectedOfficer, setSelectedOfficer] = useState<string>(
    DEPARTMENT_OFFICERS[initialDept][0] || ''
  );
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleDeptChange = (dept: Department) => {
    setSelectedDept(dept);
    const officers = DEPARTMENT_OFFICERS[dept] || [];
    setSelectedOfficer(officers[0] || 'Unassigned');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOfficer) return;
    onAssign(selectedDept, selectedOfficer, note.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Assign Case Ownership</h3>
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
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedDept}
              onChange={e => handleDeptChange(e.target.value as Department)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Designated Officer <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedOfficer}
              onChange={e => setSelectedOfficer(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
            >
              {(DEPARTMENT_OFFICERS[selectedDept] || []).map(officer => (
                <option key={officer} value={officer}>
                  {officer}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">
              Currently assigned: {currentOfficer || 'None'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Internal Assignment Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={2}
              placeholder="e.g. Assigned to ward team leader for immediate site inspection."
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
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
            >
              Assign Case
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
