import React, { useState, useMemo } from 'react';
import { useGrievance } from '../context/GrievanceContext';
import { Grievance, Department, Priority, GrievanceStatus } from '../types/grievance';
import {
  Activity,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  ShieldAlert,
  Building,
  TrendingUp,
  Filter,
  Search,
  ArrowRight,
  Layers,
  BarChart2,
  PieChart as PieIcon,
  ChevronRight,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { StatusBadge, PriorityBadge, RiskBadge, EscalatedBadge } from '../components/common/Badge';
import { computeRiskState, formatTimeRemaining, formatDateOnly } from '../utils/sla';

interface ManagerDashboardPageProps {
  viewMode?: 'dashboard' | 'escalations' | 'analytics' | 'all-cases';
  onNavigate: (view: string, caseId?: string) => void;
}

export const ManagerDashboardPage: React.FC<ManagerDashboardPageProps> = ({
  viewMode = 'dashboard',
  onNavigate
}) => {
  const { grievances } = useGrievance();

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterRisk, setFilterRisk] = useState('ALL');
  const [showFilters, setShowFilters] = useState(false);

  // Top Metrics
  const totalCases = grievances.length;
  const openCases = grievances.filter(g => g.status !== 'Resolved' && g.status !== 'Closed').length;
  const overdueCases = grievances.filter(g => computeRiskState(g) === 'OVERDUE');
  const atRiskCases = grievances.filter(g => computeRiskState(g) === 'AT RISK');
  const escalatedCases = grievances.filter(g => g.isEscalated);
  const resolvedCases = grievances.filter(g => g.status === 'Resolved' || g.status === 'Closed');

  // Chart 1: Cases by Status (Donut)
  const statusChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    grievances.forEach(g => {
      counts[g.status] = (counts[g.status] || 0) + 1;
    });

    const colors: Record<string, string> = {
      Submitted: '#38bdf8',
      Acknowledged: '#818cf8',
      'In Progress': '#2563eb',
      'Awaiting Information': '#f59e0b',
      Resolved: '#10b981',
      Closed: '#64748b'
    };

    return Object.keys(counts).map(status => ({
      name: status,
      value: counts[status],
      color: colors[status] || '#94a3b8'
    }));
  }, [grievances]);

  // Chart 2: Cases by Priority (Bar)
  const priorityChartData = useMemo(() => {
    const counts = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
    grievances.forEach(g => {
      counts[g.priority] = (counts[g.priority] || 0) + 1;
    });
    return [
      { name: 'Low', count: counts.LOW, fill: '#64748b' },
      { name: 'Medium', count: counts.MEDIUM, fill: '#3b82f6' },
      { name: 'High', count: counts.HIGH, fill: '#f59e0b' },
      { name: 'Critical', count: counts.CRITICAL, fill: '#ef4444' }
    ];
  }, [grievances]);

  // Chart 3: Cases by Department (Horizontal Bar)
  const departmentChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    grievances.forEach(g => {
      const dept = g.department || 'Other';
      counts[dept] = (counts[dept] || 0) + 1;
    });
    return Object.keys(counts).map(dept => ({
      department: dept.length > 14 ? dept.slice(0, 12) + '...' : dept,
      fullDept: dept,
      count: counts[dept]
    })).sort((a, b) => b.count - a.count);
  }, [grievances]);

  // Chart 4: Resolution Trend
  const resolutionTrendData = [
    { period: '24 Oct', submitted: 4, resolved: 3 },
    { period: '26 Oct', submitted: 6, resolved: 5 },
    { period: '28 Oct', submitted: 9, resolved: 7 },
    { period: '30 Oct', submitted: 11, resolved: 8 },
    { period: '31 Oct', submitted: 14, resolved: 11 }
  ];

  // Cases Requiring Attention (Overdue + Escalated)
  const attentionCases = useMemo(() => {
    return grievances.filter(g => {
      if (g.status === 'Resolved' || g.status === 'Closed') return false;
      return computeRiskState(g) === 'OVERDUE' || g.isEscalated;
    });
  }, [grievances]);

  // Filtered grievances for the main table
  const filteredGrievances = useMemo(() => {
    return grievances.filter(g => {
      if (viewMode === 'escalations' && !g.isEscalated) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          g.id.toLowerCase().includes(q) ||
          g.title.toLowerCase().includes(q) ||
          g.department.toLowerCase().includes(q) ||
          g.assignedOfficer.toLowerCase().includes(q) ||
          g.area.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (filterDepartment !== 'ALL' && g.department !== filterDepartment) return false;
      if (filterPriority !== 'ALL' && g.priority !== filterPriority) return false;
      if (filterStatus !== 'ALL' && g.status !== filterStatus) return false;
      if (filterRisk !== 'ALL') {
        const r = computeRiskState(g);
        if (r !== filterRisk) return false;
      }

      return true;
    });
  }, [grievances, viewMode, searchQuery, filterDepartment, filterPriority, filterStatus, filterRisk]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Operations Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 uppercase tracking-wide">
              Chief Operations Directorate
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Zone: Greater Hyderabad Municipal Region
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {viewMode === 'escalations' ? 'Escalations Command Center' : 'Operations Overview'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Monitor workload, deadlines, escalations and resolution progress in real time.
          </p>
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => onNavigate('manager-dashboard')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              viewMode === 'dashboard'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('escalations')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
              viewMode === 'escalations'
                ? 'bg-white text-red-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-red-700'
            }`}
          >
            Escalations ({escalatedCases.length})
          </button>
          <button
            onClick={() => onNavigate('analytics')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              viewMode === 'analytics'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Analytics & SLA
          </button>
          <button
            onClick={() => onNavigate('all-cases')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              viewMode === 'all-cases'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Cases ({totalCases})
          </button>
        </div>
      </div>

      {/* Top 6 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* 1. Total Cases */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Cases</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalCases}</p>
          <span className="text-[10px] text-blue-600 font-mono">100% Audited</span>
        </div>

        {/* 2. Open Cases */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Open Cases</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{openCases}</p>
          <span className="text-[10px] text-slate-400 font-mono">Active Workload</span>
        </div>

        {/* 3. Overdue Cases */}
        <div className="p-4 bg-red-50/40 rounded-xl border border-red-200 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-red-800 uppercase tracking-wider">Overdue</p>
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
          </div>
          <p className="text-2xl font-extrabold text-red-600 mt-1">{overdueCases.length}</p>
          <span className="text-[10px] text-red-700 font-mono font-medium">SLA Breached</span>
        </div>

        {/* 4. At Risk */}
        <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">At Risk</p>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-700 mt-1">{atRiskCases.length}</p>
          <span className="text-[10px] text-amber-700 font-mono font-medium">≤30% SLA Target</span>
        </div>

        {/* 5. Escalated */}
        <div
          onClick={() => onNavigate('escalations')}
          className="p-4 bg-rose-50/40 rounded-xl border border-rose-200 shadow-xs cursor-pointer hover:border-rose-400 transition-all"
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">Escalated</p>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <p className="text-2xl font-extrabold text-rose-700 mt-1">{escalatedCases.length}</p>
          <span className="text-[10px] text-rose-700 font-mono font-semibold">Priority Intervention</span>
        </div>

        {/* 6. Resolved */}
        <div className="p-4 bg-emerald-50/30 rounded-xl border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">Resolved</p>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{resolvedCases.length}</p>
          <span className="text-[10px] text-emerald-700 font-mono">Certified & Signed</span>
        </div>
      </div>

      {/* 4 Visual Charts Grid (Req 18) */}
      {(viewMode === 'dashboard' || viewMode === 'analytics') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Chart 1: Cases by Status (Donut) */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Cases by Status
                </h3>
                <PieIcon className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-500 mb-3">Live distribution by workflow stage</p>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    innerRadius={36}
                    outerRadius={56}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100 text-[10px]">
              {statusChartData.slice(0, 4).map(s => (
                <div key={s.name} className="flex items-center gap-1.5 truncate text-slate-600">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="truncate">{s.name}: {s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2: Cases by Priority (Bar) */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Cases by Priority
                </h3>
                <BarChart2 className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-500 mb-3">SLA allocation by severity</p>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {priorityChartData.map((entry, index) => (
                      <Cell key={`cell-p-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-500">
              <span>Critical SLA: 24h</span>
              <span>High SLA: 72h</span>
            </div>
          </div>

          {/* Chart 3: Cases by Department (Horizontal Bar) */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  By Department
                </h3>
                <Building className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-500 mb-3">Departmental caseload</p>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={departmentChartData.slice(0, 4)}
                  margin={{ top: 5, right: 15, left: 10, bottom: 0 }}
                >
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis dataKey="department" type="category" tick={{ fontSize: 9 }} width={70} />
                  <Tooltip
                    contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-500">
              <span>Top: {departmentChartData[0]?.department || 'None'}</span>
              <span>{departmentChartData.length} Active Depts</span>
            </div>
          </div>

          {/* Chart 4: Resolution Trend (Line) */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Resolution Trend
                </h3>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-[11px] text-slate-500 mb-3">Submissions vs Resolutions</p>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={resolutionTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Line type="monotone" dataKey="submitted" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
              <span className="flex items-center gap-1 text-blue-600 font-medium">
                <span className="w-2 h-0.5 bg-blue-600"></span> Submissions
              </span>
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <span className="w-2 h-0.5 bg-emerald-600"></span> Resolved
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Cases Requiring Immediate Attention (Overdue + Escalated) */}
      <div className="bg-red-50/50 rounded-xl p-5 border border-red-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="text-sm font-bold text-red-950">
                Cases Requiring Executive Attention ({attentionCases.length})
              </h3>
              <p className="text-[11px] text-red-700">
                Grievances with expired SLA targets or inter-departmental escalation flags.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
            MANAGER ACTION QUEUE
          </span>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg border border-red-200">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-red-50/40 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-3.5 py-2.5">Case ID</th>
                <th className="px-3.5 py-2.5">Title & Locality</th>
                <th className="px-3.5 py-2.5">Department</th>
                <th className="px-3.5 py-2.5">Officer</th>
                <th className="px-3.5 py-2.5">Priority</th>
                <th className="px-3.5 py-2.5">Deadline</th>
                <th className="px-3.5 py-2.5">Status & Risk</th>
                <th className="px-3.5 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attentionCases.map(c => {
                const risk = computeRiskState(c);
                const rem = formatTimeRemaining(c);
                return (
                  <tr
                    key={c.id}
                    onClick={() => onNavigate('case-detail', c.id)}
                    className="hover:bg-red-50/30 cursor-pointer transition-colors"
                  >
                    <td className="px-3.5 py-2.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-blue-800">{c.id}</span>
                        {c.isEscalated && <EscalatedBadge size="sm" />}
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5 max-w-xs">
                      <p className="font-medium text-slate-900 truncate">{c.title}</p>
                      <span className="text-[11px] text-slate-500">{c.area}</span>
                    </td>
                    <td className="px-3.5 py-2.5 whitespace-nowrap text-slate-700">{c.department}</td>
                    <td className="px-3.5 py-2.5 whitespace-nowrap font-medium text-slate-800">
                      {c.assignedOfficer}
                    </td>
                    <td className="px-3.5 py-2.5 whitespace-nowrap">
                      <PriorityBadge priority={c.priority} size="sm" />
                    </td>
                    <td className="px-3.5 py-2.5 whitespace-nowrap text-red-700 font-mono font-bold">
                      {rem.text}
                    </td>
                    <td className="px-3.5 py-2.5 whitespace-nowrap">
                      <RiskBadge risk={risk} size="sm" />
                    </td>
                    <td className="px-3.5 py-2.5 text-right whitespace-nowrap">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onNavigate('case-detail', c.id);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-red-800 bg-red-100 hover:bg-red-200 rounded transition-colors inline-flex items-center gap-1"
                      >
                        Intervene <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive Grievances Repository & Filter Drawer */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-slate-900">
            {viewMode === 'escalations' ? 'All Escalated Complaints' : 'Central Grievance Records'}
          </h3>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search across all cases..."
                className="pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 w-48 sm:w-64"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        {showFilters && (
          <div className="p-4 bg-white rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs animate-fade-in">
            <div>
              <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Department</label>
              <select
                value={filterDepartment}
                onChange={e => setFilterDepartment(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-md"
              >
                <option value="ALL">All Departments</option>
                <option value="Roads & Infrastructure">Roads & Infrastructure</option>
                <option value="Water Supply">Water Supply</option>
                <option value="Electricity">Electricity</option>
                <option value="Sanitation">Sanitation</option>
                <option value="Street Lighting">Street Lighting</option>
                <option value="Public Safety">Public Safety</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Priority</label>
              <select
                value={filterPriority}
                onChange={e => setFilterPriority(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-md"
              >
                <option value="ALL">All Priorities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-md"
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

            <div>
              <label className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">SLA Risk</label>
              <select
                value={filterRisk}
                onChange={e => setFilterRisk(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-md"
              >
                <option value="ALL">All Risks</option>
                <option value="ON TRACK">On Track</option>
                <option value="AT RISK">At Risk</option>
                <option value="OVERDUE">Overdue</option>
              </select>
            </div>
          </div>
        )}

        {/* Filtered Table */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3.5">Case ID</th>
                  <th className="px-4 py-3.5">Title & Locality</th>
                  <th className="px-4 py-3.5">Department</th>
                  <th className="px-4 py-3.5">Assigned Officer</th>
                  <th className="px-4 py-3.5">Priority</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Target SLA</th>
                  <th className="px-4 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredGrievances.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                      No matching cases found in this view.
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
                        className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-blue-700">{c.id}</span>
                            {c.isEscalated && <EscalatedBadge size="sm" />}
                          </div>
                        </td>
                        <td className="px-4 py-3 max-w-xs">
                          <p className="font-semibold text-slate-900 truncate">{c.title}</p>
                          <span className="text-[11px] text-slate-500">{c.area}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-700">{c.department}</td>
                        <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-800">
                          {c.assignedOfficer}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <PriorityBadge priority={c.priority} size="sm" />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge status={c.status} size="sm" />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <RiskBadge risk={risk} size="sm" />
                            <p className="text-[10px] text-slate-500 font-mono">{rem.text}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              onNavigate('case-detail', c.id);
                            }}
                            className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                          >
                            Details
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
    </div>
  );
};
