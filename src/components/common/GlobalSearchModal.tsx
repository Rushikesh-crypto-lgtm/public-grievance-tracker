import React, { useState, useMemo } from 'react';
import { useGrievance } from '../../context/GrievanceContext';
import { Search, X, ArrowRight, MapPin, Building, User, AlertCircle } from 'lucide-react';
import { StatusBadge, PriorityBadge } from './Badge';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCase: (caseId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCase
}) => {
  const { grievances } = useGrievance();
  const [query, setQuery] = useState('');

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return grievances
      .filter(g => {
        return (
          g.id.toLowerCase().includes(q) ||
          g.title.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          g.area.toLowerCase().includes(q) ||
          (g.assignedOfficer && g.assignedOfficer.toLowerCase().includes(q)) ||
          (g.department && g.department.toLowerCase().includes(q)) ||
          g.reporterName.toLowerCase().includes(q)
        );
      })
      .slice(0, 8);
  }, [query, grievances]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 bg-slate-50 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by Case ID, Category, Area, Officer, or Department..."
            autoFocus
            className="w-full bg-transparent border-none text-slate-900 placeholder-slate-400 text-sm focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 text-xs px-1.5 py-0.5 rounded"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 p-2">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
              <p>Type keywords to search across all public grievances.</p>
              <p className="mt-1 text-[11px] text-slate-400">
                Try searching <span className="font-mono font-medium text-blue-600">PG-2026-00124</span>, <span className="font-semibold text-slate-600">Gachibowli</span>, or <span className="font-semibold text-slate-600">Roads</span>
              </p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <p className="font-medium text-slate-700">No matching grievances found for &quot;{query}&quot;.</p>
              <p className="mt-1 text-slate-400">Check spelling or search by Case ID.</p>
            </div>
          ) : (
            filteredResults.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectCase(item.id);
                  onClose();
                }}
                className="p-3 hover:bg-blue-50/60 rounded-lg cursor-pointer transition-colors flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600 group-hover:text-blue-800">
                      {item.id}
                    </span>
                    <StatusBadge status={item.status} size="sm" />
                    <PriorityBadge priority={item.priority} size="sm" />
                  </div>
                  <p className="text-sm font-medium text-slate-900 group-hover:text-blue-900 line-clamp-1">
                    {item.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-400" />
                      {item.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {item.area}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      {item.assignedOfficer || 'Unassigned'}
                    </span>
                  </div>
                </div>

                <div className="text-slate-400 group-hover:text-blue-600 pl-3">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
