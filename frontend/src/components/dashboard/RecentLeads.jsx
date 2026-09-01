import { useNavigate } from 'react-router-dom';
import { Inbox } from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import EmptyState from '../common/EmptyState';
import { formatDate } from '../../utils/formatDate';

export default function RecentLeads({ leads }) {
  const navigate = useNavigate();

  if (!leads?.length) {
    return (
      <EmptyState
        icon={Inbox}
        title="No leads yet"
        subtitle="Your pipeline is clear. New leads from the contact form will show up here."
      />
    );
  }

  return (
    <div className="overflow-x-auto -mx-5 sm:mx-0">
      <table className="w-full text-sm min-w-[600px]">
        <thead>
          <tr className="text-left text-text-secondary border-b border-border">
            <th className="font-medium py-2.5 px-5 sm:px-0">Name</th>
            <th className="font-medium py-2.5 px-3">Company</th>
            <th className="font-medium py-2.5 px-3">Source</th>
            <th className="font-medium py-2.5 px-3">Status</th>
            <th className="font-medium py-2.5 px-3">Priority</th>
            <th className="font-medium py-2.5 px-3">Created</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr
              key={lead._id}
              onClick={() => navigate(`/leads/${lead._id}`)}
              className="border-b border-border last:border-0 hover:bg-lavender-light/40 cursor-pointer transition-colors"
            >
              <td className="py-3 px-5 sm:px-0 font-medium text-text-primary whitespace-nowrap">{lead.name}</td>
              <td className="py-3 px-3 text-text-secondary whitespace-nowrap">{lead.company || '—'}</td>
              <td className="py-3 px-3 text-text-secondary whitespace-nowrap">{lead.source}</td>
              <td className="py-3 px-3"><StatusBadge status={lead.status} /></td>
              <td className="py-3 px-3"><PriorityBadge priority={lead.priority} /></td>
              <td className="py-3 px-3 text-text-secondary whitespace-nowrap">{formatDate(lead.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
