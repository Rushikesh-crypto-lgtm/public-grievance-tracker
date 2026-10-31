import React, { useState } from 'react';
import { useGrievance } from '../../context/GrievanceContext';
import {
  FileText,
  Search,
  Bell,
  Menu,
  X,
  Shield,
  User,
  Users,
  LogOut,
  LogIn,
  Layers,
  ChevronDown,
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { formatDateTime } from '../../utils/sla';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, caseId?: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenSearch }) => {
  const { currentRole, currentUser, logout, notifications, unreadCount, markNotificationRead } = useGrievance();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleNav = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Civic Branding */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNav(currentRole === 'citizen' ? 'home' : currentRole === 'staff' ? 'staff-dashboard' : 'manager-dashboard')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold shadow-sm group-hover:bg-blue-800 transition-colors">
                <Building2 className="w-5 h-5 text-blue-200" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 text-base sm:text-lg tracking-tight group-hover:text-blue-900 transition-colors">
                    Public Grievance Tracker
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Every grievance. One accountable journey.
                </p>
              </div>
            </button>
          </div>

          {/* Center Navigation Links based on Role */}
          <nav className="hidden md:flex items-center gap-1">
            {currentRole === 'citizen' && (
              <>
                <button
                  onClick={() => handleNav('home')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'home'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'register'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Register Grievance
                </button>
                <button
                  onClick={() => handleNav('track')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'track'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Track Grievance
                </button>
                <button
                  onClick={() => handleNav('about')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'about'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  About
                </button>
              </>
            )}

            {currentRole === 'staff' && (
              <>
                <button
                  onClick={() => handleNav('staff-dashboard')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'staff-dashboard'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleNav('staff-my-cases')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'staff-my-cases'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  My Cases
                </button>
                <button
                  onClick={() => handleNav('all-cases')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'all-cases'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  All Cases
                </button>
                <button
                  onClick={() => handleNav('escalations')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'escalations'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Escalations
                </button>
              </>
            )}

            {currentRole === 'manager' && (
              <>
                <button
                  onClick={() => handleNav('manager-dashboard')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'manager-dashboard'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Operations Overview
                </button>
                <button
                  onClick={() => handleNav('all-cases')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'all-cases'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  All Cases
                </button>
                <button
                  onClick={() => handleNav('escalations')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'escalations'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Escalations
                </button>
                <button
                  onClick={() => handleNav('analytics')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'analytics'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Analytics
                </button>
              </>
            )}
          </nav>

          {/* Right Header Utilities: Search, Notifications, Profile / Login */}
          <div className="flex items-center gap-2">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
              title="Search cases (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Search Cases...</span>
              <kbd className="hidden lg:inline px-1 py-0.2 bg-white rounded text-[10px] text-slate-400 border border-slate-300 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-fade-in">
                  <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Notifications
                      </span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.2 text-[10px] bg-red-100 text-red-700 font-semibold rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleNav('notifications')}
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      View all
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-xs text-slate-400">No notifications.</p>
                    ) : (
                      notifications.slice(0, 5).map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.caseId) {
                              onNavigate('case-detail', n.caseId);
                              setNotificationsOpen(false);
                            }
                          }}
                          className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                            !n.read ? 'bg-blue-50/40' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {n.type === 'alert' ? (
                              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                            ) : n.type === 'success' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            ) : (
                              <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1 space-y-0.5">
                              <p className="font-semibold text-slate-800">{n.title}</p>
                              <p className="text-slate-600 line-clamp-2">{n.message}</p>
                              <span className="text-[10px] text-slate-400">
                                {formatDateTime(n.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile / Auth Area */}
            {currentRole === 'citizen' ? (
              <button
                onClick={() => handleNav('login')}
                className="flex items-center gap-1.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Staff Portal</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-semibold text-slate-900 leading-tight">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                    {currentUser.role}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold border border-blue-200">
                  {currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()}
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-md transition-colors"
                  title="Logout to Citizen View"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 animate-fade-in">
          {currentRole === 'citizen' && (
            <>
              <button
                onClick={() => handleNav('home')}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
              >
                Home
              </button>
              <button
                onClick={() => handleNav('register')}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
              >
                Register Grievance
              </button>
              <button
                onClick={() => handleNav('track')}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
              >
                Track Grievance
              </button>
              <button
                onClick={() => handleNav('about')}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
              >
                About Platform
              </button>
            </>
          )}

          {currentRole === 'staff' && (
            <>
              <button
                onClick={() => handleNav('staff-dashboard')}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNav('staff-my-cases')}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
              >
                My Cases
              </button>
              <button
                onClick={() => handleNav('all-cases')}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
              >
                All Cases
              </button>
              <button
                onClick={() => handleNav('escalations')}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
              >
                Escalations
              </button>
            </>
          )}

          {currentRole === 'manager' && (
            <>
              <button
                onClick={() => handleNav('manager-dashboard')}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
              >
                Operations Dashboard
              </button>
              <button
                onClick={() => handleNav('all-cases')}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
              >
                All Cases
              </button>
              <button
                onClick={() => handleNav('escalations')}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
              >
                Escalations
              </button>
              <button
                onClick={() => handleNav('analytics')}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
              >
                Analytics & SLA
              </button>
            </>
          )}

          <div className="pt-2 border-t border-slate-100">
            {currentRole === 'citizen' ? (
              <button
                onClick={() => handleNav('login')}
                className="w-full text-center py-2 text-sm font-semibold bg-blue-900 text-white rounded-lg"
              >
                Staff Portal Login
              </button>
            ) : (
              <button
                onClick={logout}
                className="w-full text-center py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-lg"
              >
                Switch to Citizen View
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
