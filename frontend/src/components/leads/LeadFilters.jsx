import { Search, X } from 'lucide-react';

const STATUSES = ['All', 'New', 'Contacted', 'Qualified', 'Converted', 'Lost'];
const PRIORITIES = ['All', 'Low', 'Medium', 'High'];
const SOURCES = ['All', 'Website', 'Referral', 'LinkedIn', 'Instagram', 'Email', 'Other'];
const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'name', label: 'Name' },
  { value: 'priority', label: 'Priority' },
  { value: 'followUpDate', label: 'Follow-up date' },
];

const DEFAULT_FILTERS = {
  search: '',
  status: 'All',
  priority: 'All',
  source: 'All',
  sort: 'newest',
};

export default function LeadFilters({ filters, onChange }) {
  const set = (key, value) => onChange({ ...filters, [key]: value });

  const hasActiveFilters =
    filters.search ||
    filters.status !== 'All' ||
    filters.priority !== 'All' ||
    filters.source !== 'All' ||
    filters.sort !== 'newest';

  const clearFilters = () => onChange(DEFAULT_FILTERS);

  const selectClass =
    'px-3 py-2 rounded-xl border border-border bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-lavender/50 focus:border-lavender';

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-2.5">
      <div className="relative flex-1 min-w-[200px]">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
          placeholder="Search by name, email, or company..."
          className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-border bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-lavender/50 focus:border-lavender"
        />
      </div>

      <select value={filters.status} onChange={(e) => set('status', e.target.value)} className={selectClass}>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s === 'All' ? 'All statuses' : s}
          </option>
        ))}
      </select>

      <select value={filters.priority} onChange={(e) => set('priority', e.target.value)} className={selectClass}>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p === 'All' ? 'All priorities' : p}
          </option>
        ))}
      </select>

      <select value={filters.source} onChange={(e) => set('source', e.target.value)} className={selectClass}>
        {SOURCES.map((s) => (
          <option key={s} value={s}>
            {s === 'All' ? 'All sources' : s}
          </option>
        ))}
      </select>

      <select value={filters.sort} onChange={(e) => set('sort', e.target.value)} className={selectClass}>
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            Sort: {s.label}
          </option>
        ))}
      </select>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-surface text-text-secondary text-sm hover:text-text-primary hover:border-lavender transition-colors"
        >
          <X size={15} />
          Clear
        </button>
      )}
      
    </div>
  );
}
