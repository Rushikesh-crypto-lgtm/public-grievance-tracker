import React from 'react';
import { Building2, ShieldCheck, HelpCircle, Lock, Mail, Phone, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              Public Grievance Tracker
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Every grievance. One accountable journey. Making civic service requests visible, owned, and resolvable with transparent lifecycle auditing.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Citizen Data Privacy Protected
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px] mb-3">
              Citizen Services
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('register')}
                  className="hover:text-white transition-colors"
                >
                  Register a Grievance
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('track')}
                  className="hover:text-white transition-colors"
                >
                  Track Grievance by ID
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  Why Grievance Tracker?
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('login')}
                  className="hover:text-white transition-colors text-blue-400"
                >
                  Department Staff Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Civic Governance & SLA */}
          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px] mb-3">
              Service Guarantees
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                <span>Critical Hazards: 24h SLA</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>High Priority: 72h SLA</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                <span>Medium Priority: 5-Day SLA</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <span>Low Priority: 7-Day SLA</span>
              </li>
            </ul>
          </div>

          {/* Hackathon Disclaimer & Civic Notice */}
          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px] mb-3">
              Hackathon Demonstration
            </h4>
            <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 space-y-2">
              <p className="text-[11px] text-slate-300 leading-snug">
                This application is an interactive prototype designed for a college civic-tech hackathon.
              </p>
              <p className="text-[10px] text-slate-400">
                All records, officers, and phone numbers are fictional demonstration data. All updates persist in local browser storage.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 Public Grievance Tracker. Built with civic integrity.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3" /> SSL 256-Bit Encrypted
            </span>
            <span>WCAG 2.1 AA Compliant</span>
            <span>Hyderabad Municipal Zone</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
