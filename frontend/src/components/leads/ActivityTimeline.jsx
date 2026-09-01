import { History } from 'lucide-react';
import EmptyState from '../common/EmptyState';
import { timeAgo } from '../../utils/formatDate';

const TYPE_LABELS = {
  lead_created: 'Lead created',
  status_changed: 'Status changed',
  note_added: 'Note added',
  follow_up_scheduled: 'Follow-up scheduled',
  follow_up_updated: 'Follow-up updated',
  lead_updated: 'Lead updated',
  lead_converted: 'Lead converted',
};

const TYPE_COLORS = {
  lead_created: 'bg-lavender',
  status_changed: 'bg-blue',
  note_added: 'bg-peach',
  follow_up_scheduled: 'bg-blue',
  follow_up_updated: 'bg-blue',
  lead_updated: 'bg-text-secondary',
  lead_converted: 'bg-mint',
};

export default function ActivityTimeline({ activities }) {
  if (!activities?.length) {
    return <EmptyState icon={History} title="No activity yet" />;
  }

  return (
    <ol className="relative border-l border-border ml-2">
      {activities.map((activity) => (
        <li key={activity._id} className="mb-5 ml-4 last:mb-0">
          <span className={`absolute -left-[5px] w-2.5 h-2.5 rounded-full ${TYPE_COLORS[activity.type] || 'bg-text-secondary'}`} />
          <p className="text-sm font-medium text-text-primary">{TYPE_LABELS[activity.type] || activity.type}</p>
          <p className="text-sm text-text-secondary">{activity.description}</p>
          <p className="text-xs text-text-secondary mt-0.5">
            {activity.author?.name ? `${activity.author.name} · ` : ''}
            {timeAgo(activity.createdAt)}
          </p>
        </li>
      ))}
    </ol>
  );
}
