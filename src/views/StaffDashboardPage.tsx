import React, { useState, useMemo } from 'react';
import { useGrievance } from '../context/GrievanceContext';
import { Grievance, Priority, RiskState, GrievanceStatus, Department } from '../types/grievance';
import {
  FileText,
  UserCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Building,
  MapPin,
  ChevronRight,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { StatusBadge, PriorityBadge, RiskBadge, EscalatedBadge } from '../components/common/Badge';
import { computeRiskState, formatTimeRemaining, formatDateOnly } from '../utils/sla';

interface StaffDashboardPageProps {
  viewMode?: 'dashboard' | 'my-cases' | 'all-cases' | 'escalations';
  onNavigate: (view: string, caseId?: string) => void;
}

export const StaffDashboardPage: React.FC<StaffDashboardPageProps> = ({
  viewMode = 'dashboard',
  onNavigate
}) => {
  const { grievances, currentUser } = useGrievance();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [showFilters, setShowFilters] = useState(false);

  // Computed statistics
  const assignedToMeCount = grievances.filter(
    g => g.assignedOfficer && g.assignedOfficer.toLowerCase() === currentUser.name.toLowerCase()
  ).length;

  const inProgressCount = grievances.filter(g => g.status === 'In Progress').length;
  const awaitingInfoCount = grievances.filter(g => g.status === 'Awaiting Information').length;
  
  const dueSoonCount = grievances.filter(g => {
    return computeRiskState(g) === 'AT RISK';
  }).length;

  const overdueCount = grievances.filter(g => {
    return computeRiskState(g) === 'OVERDUE';
  }).length;

  const resolvedCount = grievances.filter(
    g => g.status === 'Resolved' || g.status === 'Closed'
  ).length;

  // Filtered grievances list
  const filteredGrievances = useMemo(() => {
    return grievances.filter(g => {
      // view mode constraints
      if (viewMode === 'my-cases') {
        if (!g.assignedOfficer || g.assignedOfficer.toLowerCase() !== currentUser.name.toLowerCase()) {
          return false;
        }
      } else if (viewMode === 'escalations') {
        if (!g.isEscalated) return false;
      }

      // search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          g.id.toLowerCase().includes(q) ||
          g.title.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          g.area.toLowerCase().includes(q) ||
          g.assignedOfficer.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // department
      if (filterDepartment !== 'ALL' && g.department !== filterDepartment) {
        return false;
      }

      // priority
      if (filterPriority !== 'ALL' && g.priority !== filterPriority) {
        return false;
      }

      // status
      if (filterStatus !== 'ALL' && g.status !== filterStatus) {
        return false;
      }

      // risk
      if (filterRisk !== 'ALL') {
        const r = computeRiskState(g);
        if (r !== filterRisk) return false;
      }

      return true;
    });
  }, [grievances, viewMode, currentUser.name, searchQuery, filterDepartment, filterPriority, filterStatus, filterRisk]);

  // Priority Attention Cases for dashboard view (Overdue or At Risk or Escalated)
  const attentionCases = useMemo(() => {
    return grievances.filter(g => {
      if (g.status === 'Resolved' || g.status === 'Closed') return false;
      const risk = computeRiskState(g);
      return risk === 'OVERDUE' || risk === 'AT RISK' || g.isEscalated;
    });
  }, [grievances]);

  const resetFilters = () => {
    setSearchQuery('');
    setFilterDepartment('ALL');
    setFilterPriority('ALL');
    setFilterStatus('ALL');
    setFilterRisk('ALL');
  };

  const getPageTitle = () => {
    switch (viewMode) {
      case 'my-cases':
        return {
          title: `My Assigned Grievances (${assignedToMeCount})`,
          subtitle: `Cases assigned directly to Officer ${currentUser.name} across municipal operations.`
        };
      case 'escalations':
        return {
          title: `Escalated Grievances Queue (${grievances.filter(g => g.isEscalated).length})`,
          subtitle: 'Complaints flagged with high urgency or deadline violations requiring priority response.'
        };
      case 'all-cases':
        return {
          title: `All Civic Grievances (${grievances.length})`,
          subtitle: 'Complete central repository of grievances across all departments and localities.'
        };
      case 'dashboard':
      default:
        return {
          title: 'Field Case Operations Desk',
          subtitle: `Active grievance queue and SLA resolution workflow for ${currentUser.name}.`
        };
    }
  };

  const { title, subtitle } = getPageTitle();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 uppercase tracking-wide">
              {currentUser.designation}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Dept: {currentUser.department || 'All Municipal Zones'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
        </div>

        {/* View Switch Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => onNavigate('staff-dashboard')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              viewMode === 'dashboard'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('staff-my-cases')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              viewMode === 'my-cases'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Cases ({assignedToMeCount})
          </button>
          <button
            onClick={() => onNavigate('all-cases')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              viewMode === 'all-cases'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Cases
          </button>
          <button
            onClick={() => onNavigate('escalations')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
              viewMode === 'escalations'
                ? 'bg-white text-red-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-red-700'
            }`}
          >
            Escalations
          </button>
        </div>
      </div>

      {/* Metric Cards (Only shown on Dashboard view or top overview) */}
      {viewMode === 'dashboard' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* 1. Assigned to Me */}
          <div
            onClick={() => onNavigate('staff-my-cases')}
            className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">My Cases</span>
              <UserCheck className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{assignedToMeCount}</div>
            <p className="text-[10px] text-slate-400 mt-1">Directly assigned</p>
          </div>

          {/* 2. In Progress */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">In Progress</span>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            </div>
            <div className="text-2xl font-bold text-blue-700">{inProgressCount}</div>
            <p className="text-[10px] text-slate-400 mt-1">Field active</p>
          </div>

          {/* 3. Awaiting Info */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Awaiting Info</span>
              <HelpCircle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-amber-600">{awaitingInfoCount}</div>
            <p className="text-[10px] text-slate-400 mt-1">Citizen input pending</p>
          </div>

          {/* 4. Due Soon */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Due Soon</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-amber-700">{dueSoonCount}</div>
            <p className="text-[10px] text-amber-600 font-medium mt-1">≤30% SLA left</p>
          </div>

          {/* 5. Overdue */}
          <div className="p-4 bg-white rounded-xl border border-red-200 shadow-xs bg-red-50/20">
            <div className="flex items-center justify-between text-red-700 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Overdue</span>
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-2xl font-extrabold text-red-600">{overdueCount}</div>
            <p className="text-[10px] text-red-700 font-medium mt-1">SLA target elapsed</p>
          </div>

          {/* 6. Resolved */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Resolved</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-600">{resolvedCount}</div>
            <p className="text-[10px] text-slate-400 mt-1">Verified completions</p>
          </div>
        </div>
      )}

      {/* Featured Urgent Cases Card (if on Dashboard) */}
      {viewMode === 'dashboard' && attentionCases.length > 0 && (
        <div className="bg-amber-50/60 rounded-xl p-5 border border-amber-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <h3 className="text-sm font-bold text-amber-900">
                Cases Requiring Immediate Attention ({attentionCases.length})
              </h3>
            </div>
            <span className="text-xs text-amber-700 font-medium">Overdue, At-Risk, or Escalated</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {attentionCases.slice(0, 3).map(c => {
              const risk = computeRiskState(c);
              const rem = formatTimeRemaining(c);
              return (
                <div
                  key={c.id}
                  onClick={() => onNavigate('case-detail', c.id)}
                  className="bg-white p-3.5 rounded-lg border border-amber-300 hover:border-amber-500 cursor-pointer transition-all shadow-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-slate-900">{c.id}</span>
                    <RiskBadge risk={risk} size="sm" />
                  </div>
                  <p className="text-xs font-semibold text-slate-800 line-clamp-1">{c.title}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>{c.area}</span>
                    <span className={risk === 'OVERDUE' ? 'font-bold text-red-600' : 'text-amber-700'}>
                      {rem.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by ID, Title, Locality, Category, or Officer..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          {/* Filter Toggle and Reset Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-2 text-xs font-medium rounded-lg border flex items-center gap-1.5 transition-colors ${
                showFilters || filterDepartment !== 'ALL' || filterPriority !== 'ALL' || filterStatus !== 'ALL' || filterRisk !== 'ALL'
                  ? 'bg-blue-50 border-blue-300 text-blue-800 font-semibold'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {(filterDepartment !== 'ALL' || filterPriority !== 'ALL' || filterStatus !== 'ALL' || filterRisk !== 'ALL') && (
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              )}
            </button>

            {(searchQuery || filterDepartment !== 'ALL' || filterPriority !== 'ALL' || filterStatus !== 'ALL' || filterRisk !== 'ALL') && (
              <button
                onClick={resetFilters}
                className="px-2.5 py-2 text-xs text-slate-500 hover:text-red-600 rounded-lg transition-colors flex items-center gap-1"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Filter Dropdowns */}
        {showFilters && (
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in">
            {/* Department */}
            <div>
              <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">
                Department
              </label>
              <select
                value={filterDepartment}
                onChange={e => setFilterDepartment(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              >
                <option value="ALL">All Departments</option>
                <option value="Roads & Infrastructure">Roads & Infrastructure</option>
                <option value="Water Supply">Water Supply</option>
                <option value="Electricity">Electricity</option>
                <option value="Sanitation">Sanitation</option>
                <option value="Street Lighting">Street Lighting</option>
                <option value="Public Safety">Public Safety</option>
                <option value="Waste Management">Waste Management</option>
                <option value="Transportation">Transportation</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">
                Priority
              </label>
              <select
                value={filterPriority}
                onChange={e => setFilterPriority(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              >
                <option value="ALL">All Priorities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="Acknowledged">Acknowledged</option>
                <option value="In Progress">In Progress</option>
                <option value="Awaiting Information">Awaiting Info</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* SLA Risk */}
            <div>
              <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">
                SLA Risk
              </label>
              <select
                value={filterRisk}
                onChange={e => setFilterRisk(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              >
                <option value="ALL">All Risks</option>
                <option value="ON TRACK">On Track</option>
                <option value="AT RISK">At Risk (≤30%)</option>
                <option value="OVERDUE">Overdue</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Main Grievances Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th scope="col" className="px-4 py-3.5">Case ID</th>
                <th scope="col" className="px-4 py-3.5">Title & Locality</th>
                <th scope="col" className="px-4 py-3.5">Category</th>
                <th scope="col" className="px-4 py-3.5">Priority</th>
                <th scope="col" className="px-4 py-3.5">Owner</th>
                <th scope="col" className="px-4 py-3.5">Status</th>
                <th scope="col" className="px-4 py-3.5">Deadline & Risk</th>
                <th scope="col" className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGrievances.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-slate-700">No grievances found matching this view.</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting your active filters.</p>
                  </td>
                </tr>
              ) : (
                filteredGrievances.map(c => {
                  const risk = computeRiskState(c);
                  const rem = formatTimeRemaining(c);

                  return (
                    <tr
                      key={c.id}
                      onClick={() => onNavigate('case-detail', c.id)}
                      className={`hover:bg-blue-50/50 cursor-pointer transition-colors ${
                        c.isEscalated ? 'bg-red-50/20' : ''
                      }`}
                    >
                      {/* Case ID */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-blue-700 hover:underline">
                            {c.id}
                          </span>
                          {c.isEscalated && <EscalatedBadge size="sm" />}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {formatDateOnly(c.submittedAt)}
                        </span>
                      </td>

                      {/* Title & Locality */}
                      <td className="px-4 py-3.5 max-w-xs">
                        <p className="font-semibold text-slate-900 truncate">{c.title}</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{c.area}</span>
                        </p>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                          <Building className="w-3 h-3 text-slate-400" />
                          {c.category}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <PriorityBadge priority={c.priority} size="sm" />
                      </td>

                      {/* Owner */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`font-medium ${c.assignedOfficer === 'Unassigned' ? 'text-amber-700 italic' : 'text-slate-800'}`}>
                          {c.assignedOfficer}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <StatusBadge status={c.status} size="sm" />
                      </td>

                      {/* Deadline & Risk */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="space-y-1">
                          <RiskBadge risk={risk} size="sm" />
                          <p className={`text-[10px] font-mono ${risk === 'OVERDUE' ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
                            {rem.text}
                          </p>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onNavigate('case-detail', c.id);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors inline-flex items-center gap-1"
                        >
                          <span>Manage</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
