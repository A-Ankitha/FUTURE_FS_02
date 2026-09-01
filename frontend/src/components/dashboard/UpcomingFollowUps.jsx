import { useNavigate } from 'react-router-dom';
import { CalendarClock } from 'lucide-react';
import EmptyState from '../common/EmptyState';
import { PriorityBadge } from '../common/Badge';
import { formatDate } from '../../utils/formatDate';

export default function UpcomingFollowUps({ overdue = [], upcoming = [] }) {
  const navigate = useNavigate();
  const items = [...overdue, ...upcoming].slice(0, 6);

  if (!items.length) {
    return <EmptyState icon={CalendarClock} title="No upcoming follow-ups." />;
  }

  return (
    <div className="space-y-2">
      {overdue.length > 0 && (
        <div className="flex items-center gap-2 text-rose text-sm font-medium mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-rose" />
          {overdue.length} follow-up{overdue.length > 1 ? 's' : ''} overdue
        </div>
      )}
      {items.map((lead) => {
        const isOverdue = overdue.some((o) => o._id === lead._id);
        return (
          <div
            key={lead._id}
            onClick={() => navigate(`/leads/${lead._id}`)}
            className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-colors border ${
              isOverdue ? 'border-rose/40 bg-rose/5 hover:bg-rose/10' : 'border-transparent hover:bg-lavender-light/40'
            }`}
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{lead.name}</p>
              <p className={`text-xs ${isOverdue ? 'text-rose' : 'text-text-secondary'}`}>
                {formatDate(lead.followUpDate)}
              </p>
            </div>
            <PriorityBadge priority={lead.priority} />
          </div>
        );
      })}
    </div>
  );
}
