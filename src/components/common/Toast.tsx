import React, { useEffect } from 'react';
import { useGrievance } from '../../context/GrievanceContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, clearToast } = useGrievance();

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        clearToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, clearToast]);

  if (!toastMessage) return null;

  const bgConfig = {
    success: 'bg-emerald-900 border-emerald-700 text-emerald-100',
    info: 'bg-blue-950 border-blue-800 text-blue-100',
    warning: 'bg-amber-950 border-amber-700 text-amber-100',
    error: 'bg-red-950 border-red-700 text-red-100'
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-fade-in shadow-xl">
      <div
        className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg ${
          bgConfig[toastMessage.type]
        }`}
      >
        {icons[toastMessage.type]}
        <div className="flex-1 text-sm font-medium leading-snug">
          {toastMessage.text}
        </div>
        <button
          onClick={clearToast}
          className="text-slate-400 hover:text-white transition-colors p-0.5 rounded"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
