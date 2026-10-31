import React, { useState } from 'react';
import { useGrievance, DEMO_PROFILES } from '../context/GrievanceContext';
import { UserRole } from '../types/grievance';
import {
  Lock,
  Mail,
  Building2,
  Shield,
  Users,
  User,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

interface LoginPageProps {
  onNavigate: (view: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { loginAs, setRole } = useGrievance();
  const [email, setEmail] = useState('staff@pgt.demo');
  const [password, setPassword] = useState('demo1234');
  const [selectedRole, setSelectedRole] = useState<UserRole>('staff');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Map email or selectedRole
    let roleToSet: UserRole = selectedRole;
    if (email.includes('manager')) {
      roleToSet = 'manager';
    } else if (email.includes('staff')) {
      roleToSet = 'staff';
    } else if (email.includes('citizen')) {
      roleToSet = 'citizen';
    }

    loginAs(roleToSet);
    if (roleToSet === 'manager') {
      onNavigate('manager-dashboard');
    } else if (roleToSet === 'staff') {
      onNavigate('staff-dashboard');
    } else {
      onNavigate('home');
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    loginAs(role);
    if (role === 'manager') {
      onNavigate('manager-dashboard');
    } else if (role === 'staff') {
      onNavigate('staff-dashboard');
    } else {
      onNavigate('home');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-8 text-center bg-slate-900 text-white space-y-2">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Public Grievance Tracker</h1>
          <p className="text-xs text-slate-300">
            Authorized Municipal Staff & Manager Portal
          </p>
        </div>

        {/* Demo Accounts Selector Ribbon for Hackathon Judges */}
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>HACKATHON DEMO ACCOUNTS (One-Click)</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('staff')}
              className="p-2.5 bg-white border border-blue-200 hover:border-blue-500 rounded-lg text-left transition-all hover:shadow-xs group cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-blue-700">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                Staff (Rahul Kumar)
              </div>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">staff@pgt.demo</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('manager')}
              className="p-2.5 bg-white border border-blue-200 hover:border-blue-500 rounded-lg text-left transition-all hover:shadow-xs group cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-blue-700">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                Manager (Ananya)
              </div>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">manager@pgt.demo</p>
            </button>
          </div>
        </div>

        {/* Traditional Form */}
        <form onSubmit={handleLogin} className="p-8 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Role Select
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('staff');
                  setEmail('staff@pgt.demo');
                }}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-colors ${
                  selectedRole === 'staff'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Staff / Case Worker
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('manager');
                  setEmail('manager@pgt.demo');
                }}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-colors ${
                  selectedRole === 'manager'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Zonal Manager
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Official Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm rounded-lg transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer pt-2"
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              Return to Citizen Public Portal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
