import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Mail, Phone, Building2, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import NotesSection from '../components/leads/NotesSection';
import ActivityTimeline from '../components/leads/ActivityTimeline';
import LeadFormModal from '../components/leads/LeadFormModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatDate';
import api from '../services/api';

const STATUSES = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [tab, setTab] = useState('notes');

  const loadAll = async () => {
    setLoading(true);
    try {
      const [leadRes, notesRes, activitiesRes] = await Promise.all([
        api.get(`/leads/${id}`),
        api.get(`/leads/${id}/notes`),
        api.get(`/leads/${id}/activities`),
      ]);
      setLead(leadRes.data.data);
      setNotes(notesRes.data.data);
      setActivities(activitiesRes.data.data);
    } catch (err) {
      showToast('Lead not found.', 'error');
      navigate('/leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusChange = async (status) => {
    try {
      const res = await api.patch(`/leads/${id}/status`, { status });
      setLead(res.data.data);
      showToast('Status updated.', 'success');
      const activitiesRes = await api.get(`/leads/${id}/activities`);
      setActivities(activitiesRes.data.data);
    } catch (err) {
      showToast('Failed to update status.', 'error');
    }
  };

  const handleAddNote = async (text) => {
    try {
      const res = await api.post(`/leads/${id}/notes`, { text });
      setNotes((prev) => [res.data.data, ...prev]);
      showToast('Note added.', 'success');
      const activitiesRes = await api.get(`/leads/${id}/activities`);
      setActivities(activitiesRes.data.data);
    } catch (err) {
      showToast('Failed to add note.', 'error');
    }
  };

  const handleEditSubmit = async (formData) => {
    try {
      const res = await api.put(`/leads/${id}`, formData);
      setLead(res.data.data);
      setEditOpen(false);
      showToast('Lead updated.', 'success');
      const activitiesRes = await api.get(`/leads/${id}/activities`);
      setActivities(activitiesRes.data.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update lead.', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/leads/${id}`);
      showToast('Lead deleted.', 'success');
      navigate('/leads');
    } catch (err) {
      showToast('Failed to delete lead.', 'error');
    }
  };

  if (loading || !lead) {
    return (
      <DashboardLayout title="Lead Details">
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-surface border border-border rounded-2xl" />
          <div className="h-48 bg-surface border border-border rounded-2xl" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={lead.name} subtitle={lead.company || 'Lead details'}>
      <button
        onClick={() => navigate('/leads')}
        className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-lavender mb-4"
      >
        <ArrowLeft size={14} />
        Back to leads
      </button>

      {/* Header */}
      <div className="bg-surface border border-border rounded-2xl shadow-card p-5 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-semibold text-text-primary">{lead.name}</h2>
              <StatusBadge status={lead.status} />
              <PriorityBadge priority={lead.priority} />
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-text-secondary">
              <span className="flex items-center gap-1.5"><Building2 size={14} />{lead.company || '—'}</span>
              <span className="flex items-center gap-1.5"><Mail size={14} />{lead.email}</span>
              <span className="flex items-center gap-1.5"><Phone size={14} />{lead.phone || '—'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={lead.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-2 rounded-xl border border-border bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-lavender/50"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={() => setEditOpen(true)}
              className="p-2 rounded-xl border border-border text-text-secondary hover:text-blue hover:border-blue"
              aria-label="Edit lead"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => setDeleteOpen(true)}
              className="p-2 rounded-xl border border-border text-text-secondary hover:text-rose hover:border-rose"
              aria-label="Delete lead"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Lead info */}
        <div className="lg:col-span-1 space-y-5">
          <div className="bg-surface border border-border rounded-2xl shadow-card p-5">
            <h3 className="font-semibold text-text-primary mb-3 text-sm">Lead Information</h3>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between"><dt className="text-text-secondary">Source</dt><dd className="text-text-primary">{lead.source}</dd></div>
              <div className="flex justify-between"><dt className="text-text-secondary">Created</dt><dd className="text-text-primary">{formatDate(lead.createdAt)}</dd></div>
              <div className="flex justify-between"><dt className="text-text-secondary">Last contacted</dt><dd className="text-text-primary">{formatDate(lead.lastContacted)}</dd></div>
              <div className="flex justify-between"><dt className="text-text-secondary">Next follow-up</dt><dd className="text-text-primary">{formatDate(lead.followUpDate)}</dd></div>
              {lead.service && <div className="flex justify-between"><dt className="text-text-secondary">Service</dt><dd className="text-text-primary">{lead.service}</dd></div>}
            </dl>
          </div>

          {lead.message && (
            <div className="bg-surface border border-border rounded-2xl shadow-card p-5">
              <h3 className="font-semibold text-text-primary mb-2 text-sm">Original Message</h3>
              <p className="text-sm text-text-secondary">{lead.message}</p>
            </div>
          )}
        </div>

        {/* Notes / Activity */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl shadow-card p-5">
          <div className="flex gap-1 mb-4 border-b border-border">
            {[
              { key: 'notes', label: 'Notes' },
              { key: 'activity', label: 'Activity Timeline' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  tab === t.key ? 'border-lavender text-lavender' : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          {tab === 'notes' ? <NotesSection notes={notes} onAddNote={handleAddNote} /> : <ActivityTimeline activities={activities} />}
        </div>
      </div>

      <LeadFormModal open={editOpen} onClose={() => setEditOpen(false)} onSubmit={handleEditSubmit} initialData={lead} />
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete lead?"
        message={`This will permanently remove ${lead.name} and all associated notes and activity.`}
      />
    </DashboardLayout>
  );
}
