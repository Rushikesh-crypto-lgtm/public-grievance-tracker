import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface CloseConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  onConfirmClose: (note?: string) => void;
}

export const CloseConfirmModal: React.FC<CloseConfirmModalProps> = ({
  isOpen,
  onClose,
  caseId,
  onConfirmClose
}) => {
  const [closingNote, setClosingNote] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirmClose(closingNote.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Close Case Record</h3>
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

        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
            <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p>
              Closing marks the end of the public grievance lifecycle. The citizen will be notified that the matter is archived as fully satisfied.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Closing Verification Note (Optional)
            </label>
            <textarea
              value={closingNote}
              onChange={e => setClosingNote(e.target.value)}
              rows={3}
              placeholder="e.g. Citizen confirmed resolution over phone. No follow-up required."
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800 resize-none"
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
              type="button"
              onClick={handleConfirm}
              className="px-4 py-2 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors shadow-sm"
            >
              Confirm Closure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
