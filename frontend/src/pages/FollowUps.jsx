import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarClock, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import { formatDate } from '../utils/formatDate';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

function FollowUpCard({ lead, onReschedule, overdue }) {
  const navigate = useNavigate();
  return (
    <div
      className={`bg-surface border rounded-xl p-4 ${overdue ? 'border-rose/40' : 'border-border'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => navigate(`/leads/${lead._id}`)}
            className="text-left max-w-full"
          >
            <p className="font-medium text-text-primary text-sm truncate hover:text-lavender">
              {lead.name}
            </p>
            <p className="text-xs text-text-secondary truncate">
              {lead.company || lead.email}
            </p>
          </button>
        </div>
        <PriorityBadge priority={lead.priority} />
      </div>
      <div className="flex items-center justify-between mt-3">
        <span className={`text-xs font-medium ${overdue ? 'text-rose' : 'text-text-secondary'}`}>
          {formatDate(lead.followUpDate)}
        </span>
        <StatusBadge status={lead.status} />
      </div>
      <p className="text-[11px] font-medium text-text-secondary mt-3 mb-1">Reschedule</p>
      <input
        type="date"
        min={new Date().toISOString().split('T')[0]}
        defaultValue={lead.followUpDate ? lead.followUpDate.slice(0, 10) : ''}
        aria-label={`Reschedule follow-up for ${lead.name}`}
        onChange={(e) => e.target.value && onReschedule(lead._id, e.target.value)}
        className="w-full mt-3 px-2.5 py-1.5 rounded-lg border border-border bg-background text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-lavender/50"
      />
    </div>
  );
}

export default function FollowUps() {
  const { showToast } = useToast();
  const [board, setBoard] = useState({ overdue: [], today: [], upcoming: [] });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/leads/followups/board');
      setBoard(res.data.data);
    } catch (err) {
      showToast('Unable to load follow-ups.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReschedule = async (leadId, date) => {
    try {
      await api.patch(`/leads/${leadId}/followup`, { followUpDate: date });
      showToast('Follow-up updated.', 'success');
      load();
    } catch (err) {
      showToast('Failed to update follow-up.', 'error');
    }
  };

  const columns = [
    { key: 'overdue', label: 'Overdue', icon: AlertTriangle, items: board.overdue },
    { key: 'today', label: 'Today', icon: CalendarClock, items: board.today },
    { key: 'upcoming', label: 'Upcoming', icon: CalendarClock, items: board.upcoming },
  ];

  return (
    <DashboardLayout title="Follow-ups" subtitle="Stay on top of every scheduled conversation.">
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 bg-surface border border-border rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {columns.map((col) => (
            <div key={col.key} className="bg-surface border border-border rounded-2xl shadow-card p-4">
              <div className="flex items-center gap-2 mb-4">
                <col.icon size={16} className={col.key === 'overdue' ? 'text-rose' : 'text-lavender'} />
                <h3 className="font-semibold text-text-primary text-sm">{col.label}</h3>
                <span className="text-xs text-text-secondary ml-auto">{col.items.length}</span>
              </div>
              {col.items.length === 0 ? (
                <EmptyState icon={CalendarClock} title={`No ${col.label.toLowerCase()} follow-ups.`} />
              ) : (
                <div className="space-y-3">
                  {col.items.map((lead) => (
                    <FollowUpCard key={lead._id} lead={lead} onReschedule={handleReschedule} overdue={col.key === 'overdue'} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
