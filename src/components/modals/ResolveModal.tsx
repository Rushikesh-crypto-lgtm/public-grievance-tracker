import React, { useState } from 'react';
import { X, CheckCircle, Upload, Paperclip } from 'lucide-react';

interface ResolveModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  onResolve: (resolutionNote: string, resolutionEvidence?: string) => void;
}

export const ResolveModal: React.FC<ResolveModalProps> = ({
  isOpen,
  onClose,
  caseId,
  onResolve
}) => {
  const [resolutionNote, setResolutionNote] = useState('');
  const [evidenceName, setEvidenceName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolutionNote.trim()) {
      setError('A formal resolution note describing remedial action taken is required.');
      return;
    }
    setError(null);
    onResolve(resolutionNote.trim(), evidenceName || undefined);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEvidenceName(file.name);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-emerald-200 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-100 bg-emerald-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Resolve Grievance</h3>
              <p className="text-xs text-emerald-700 font-mono">Case ID: {caseId}</p>
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
              Official Resolution Summary <span className="text-red-500">*</span>
            </label>
            <textarea
              value={resolutionNote}
              onChange={e => {
                setResolutionNote(e.target.value);
                if (error) setError(null);
              }}
              rows={4}
              required
              placeholder="e.g. Road damage repaired and inspected by the department team. Asphalting completed and quality sign-off verified by zonal engineer."
              className={`w-full px-3 py-2 text-sm bg-white border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-800 resize-none ${
                error ? 'border-red-400' : 'border-slate-300'
              }`}
            />
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
            <p className="text-xs text-slate-500 mt-1">
              This summary will be visible to the citizen on the public tracking portal.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Resolution Evidence / Inspection Report (Optional)
            </label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-lg p-3 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-emerald-50/20">
              <Upload className="w-5 h-5 text-slate-400 mb-1" />
              <span className="text-xs font-medium text-slate-700">
                {evidenceName ? (
                  <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <Paperclip className="w-3.5 h-3.5" />
                    {evidenceName}
                  </span>
                ) : (
                  'Attach completion photo or sign-off certificate (PNG, JPG, PDF)'
                )}
              </span>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
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
              className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              Submit Resolution
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
