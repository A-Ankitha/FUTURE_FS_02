import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2, Inbox } from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import EmptyState from '../common/EmptyState';
import { SkeletonRow } from '../common/Skeleton';
import { formatDate } from '../../utils/formatDate';

export default function LeadTable({ leads, loading, onEdit, onDelete }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="divide-y divide-border">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    );
  }

  if (!leads?.length) {
    return (
      <EmptyState
        icon={Inbox}
        title="No leads yet"
        subtitle="Create your first lead to start tracking opportunities, or adjust your filters."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[900px]">
        <thead>
          <tr className="text-left text-text-secondary border-b border-border">
            <th className="font-medium py-3 px-4">Name</th>
            <th className="font-medium py-3 px-4">Company</th>
            <th className="font-medium py-3 px-4">Email</th>
            <th className="font-medium py-3 px-4">Source</th>
            <th className="font-medium py-3 px-4">Status</th>
            <th className="font-medium py-3 px-4">Priority</th>
            <th className="font-medium py-3 px-4">Follow-up</th>
            <th className="font-medium py-3 px-4">Created</th>
            <th className="font-medium py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id} className="border-b border-border last:border-0 hover:bg-lavender-light/30 transition-colors">
              <td className="py-3 px-4 font-medium text-text-primary whitespace-nowrap">{lead.name}</td>
              <td className="py-3 px-4 text-text-secondary whitespace-nowrap">{lead.company || '—'}</td>
              <td className="py-3 px-4 text-text-secondary whitespace-nowrap">{lead.email}</td>
              <td className="py-3 px-4 text-text-secondary whitespace-nowrap">{lead.source}</td>
              <td className="py-3 px-4"><StatusBadge status={lead.status} /></td>
              <td className="py-3 px-4"><PriorityBadge priority={lead.priority} /></td>
              <td className="py-3 px-4 text-text-secondary whitespace-nowrap">{formatDate(lead.followUpDate)}</td>
              <td className="py-3 px-4 text-text-secondary whitespace-nowrap">{formatDate(lead.createdAt)}</td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => navigate(`/leads/${lead._id}`)}
                    aria-label="View lead"
                    className="p-1.5 rounded-lg text-text-secondary hover:text-lavender hover:bg-lavender-light"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => onEdit(lead)}
                    aria-label="Edit lead"
                    className="p-1.5 rounded-lg text-text-secondary hover:text-blue hover:bg-blue-light"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(lead)}
                    aria-label="Delete lead"
                    className="p-1.5 rounded-lg text-text-secondary hover:text-rose hover:bg-rose/10"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
