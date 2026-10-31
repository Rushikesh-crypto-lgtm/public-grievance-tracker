import React from 'react';
import { useGrievance } from '../../context/GrievanceContext';
import { Shield, User, Users, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';
import { UserRole } from '../../types/grievance';

interface DemoBannerProps {
  onNavigateCase?: (caseId: string) => void;
  onNavigateView?: (view: string) => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onNavigateCase, onNavigateView }) => {
  const { currentRole, setRole, resetToDemoData } = useGrievance();

  return (
    <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Hackathon Judge Banner */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-blue-600 text-white font-semibold px-2 py-0.5 rounded text-[11px] uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            Hackathon Demo Mode
          </span>
          <span className="hidden sm:inline text-slate-400">
            Switch perspectives anytime to test the full lifecycle:
          </span>
        </div>

        {/* Center: Role Switcher Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-0.5 rounded-md border border-slate-700">
          <button
            onClick={() => {
              setRole('citizen');
              if (onNavigateView) onNavigateView('home');
            }}
            className={`px-2.5 py-1 rounded font-medium transition-colors flex items-center gap-1.5 ${
              currentRole === 'citizen'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <User className="w-3 h-3" />
            Citizen
          </button>

          <button
            onClick={() => {
              setRole('staff');
              if (onNavigateView) onNavigateView('staff-dashboard');
            }}
            className={`px-2.5 py-1 rounded font-medium transition-colors flex items-center gap-1.5 ${
              currentRole === 'staff'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Shield className="w-3 h-3" />
            Staff (Rahul)
          </button>

          <button
            onClick={() => {
              setRole('manager');
              if (onNavigateView) onNavigateView('manager-dashboard');
            }}
            className={`px-2.5 py-1 rounded font-medium transition-colors flex items-center gap-1.5 ${
              currentRole === 'manager'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Users className="w-3 h-3" />
            Manager (Ananya)
          </button>
        </div>

        {/* Right: Quick actions for Demo Case & Reset */}
        <div className="flex items-center gap-2">
          {onNavigateCase && (
            <button
              onClick={() => onNavigateCase('PG-2026-00124')}
              className="inline-flex items-center gap-1 bg-blue-900/60 hover:bg-blue-800/80 text-blue-200 border border-blue-700 px-2.5 py-1 rounded font-mono font-medium transition-colors"
              title="Open primary demo case PG-2026-00124"
            >
              Demo Case: PG-2026-00124
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          <button
            onClick={() => {
              if (window.confirm('Reset all demo grievances and test history to original state?')) {
                resetToDemoData();
              }
            }}
            className="inline-flex items-center gap-1 text-slate-400 hover:text-red-400 hover:bg-slate-800 px-2 py-1 rounded transition-colors"
            title="Reset seeded database to initial state"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">Reset Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
