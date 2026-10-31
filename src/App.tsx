/**
 * Public Grievance Tracker
 * "Every grievance. One accountable journey."
 */

import React, { useState, useEffect } from 'react';
import { GrievanceProvider, useGrievance } from './context/GrievanceContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DemoBanner } from './components/layout/DemoBanner';
import { Toast } from './components/common/Toast';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

// Views
import { LandingPage } from './views/LandingPage';
import { RegisterGrievancePage } from './views/RegisterGrievancePage';
import { TrackGrievancePage } from './views/TrackGrievancePage';
import { AboutPage } from './views/AboutPage';
import { LoginPage } from './views/LoginPage';
import { StaffDashboardPage } from './views/StaffDashboardPage';
import { ManagerDashboardPage } from './views/ManagerDashboardPage';
import { CaseDetailPage } from './views/CaseDetailPage';
import { NotificationsPage } from './views/NotificationsPage';

function AppContent() {
  const { currentRole, setRole } = useGrievance();

  // Navigation State
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('PG-2026-00124');
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);

  // Hash Routing support for browser back/forward and direct links
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return;

      const parts = hash.split('/');
      const view = parts[0];
      const param = parts[1];

      if (view) {
        setCurrentView(view);
      }
      if (param) {
        setSelectedCaseId(param);
      }
    };

    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Keyboard shortcut: Cmd+K or Ctrl+K to open global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigateTo = (view: string, caseId?: string) => {
    setCurrentView(view);
    if (caseId) {
      setSelectedCaseId(caseId);
      window.location.hash = `${view}/${caseId}`;
    } else {
      window.location.hash = view;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSearchedCase = (caseId: string) => {
    if (currentRole === 'citizen') {
      navigateTo('track', caseId);
    } else {
      navigateTo('case-detail', caseId);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* 1. Global Hackathon Demo Bar */}
      <DemoBanner
        onNavigateCase={caseId => {
          if (currentRole === 'citizen') {
            navigateTo('track', caseId);
          } else {
            navigateTo('case-detail', caseId);
          }
        }}
        onNavigateView={view => navigateTo(view)}
      />

      {/* 2. Civic Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* 3. Main Dynamic Content */}
      <main className="flex-1">
        {currentView === 'home' && <LandingPage onNavigate={navigateTo} />}

        {currentView === 'register' && <RegisterGrievancePage onNavigate={navigateTo} />}

        {currentView === 'track' && (
          <TrackGrievancePage initialCaseId={selectedCaseId} onNavigate={navigateTo} />
        )}

        {currentView === 'about' && <AboutPage onNavigate={navigateTo} />}

        {currentView === 'login' && <LoginPage onNavigate={navigateTo} />}

        {/* Staff Views */}
        {currentView === 'staff-dashboard' && (
          <StaffDashboardPage viewMode="dashboard" onNavigate={navigateTo} />
        )}
        {currentView === 'staff-my-cases' && (
          <StaffDashboardPage viewMode="my-cases" onNavigate={navigateTo} />
        )}

        {/* Shared / Manager Views */}
        {currentView === 'all-cases' && (
          currentRole === 'manager' ? (
            <ManagerDashboardPage viewMode="all-cases" onNavigate={navigateTo} />
          ) : (
            <StaffDashboardPage viewMode="all-cases" onNavigate={navigateTo} />
          )
        )}

        {currentView === 'escalations' && (
          currentRole === 'manager' ? (
            <ManagerDashboardPage viewMode="escalations" onNavigate={navigateTo} />
          ) : (
            <StaffDashboardPage viewMode="escalations" onNavigate={navigateTo} />
          )
        )}

        {currentView === 'manager-dashboard' && (
          <ManagerDashboardPage viewMode="dashboard" onNavigate={navigateTo} />
        )}

        {currentView === 'analytics' && (
          <ManagerDashboardPage viewMode="analytics" onNavigate={navigateTo} />
        )}

        {currentView === 'case-detail' && (
          <CaseDetailPage caseId={selectedCaseId} onNavigate={navigateTo} />
        )}

        {currentView === 'notifications' && (
          <NotificationsPage onNavigate={navigateTo} />
        )}
      </main>

      {/* 4. Global Search Modal */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectCase={handleSelectSearchedCase}
      />

      {/* 5. Real-time Toast Notifications */}
      <Toast />

      {/* 6. Civic Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export default function App() {
  return (
    <GrievanceProvider>
      <AppContent />
    </GrievanceProvider>
  );
}
