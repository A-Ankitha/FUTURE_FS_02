import { useEffect, useState, useCallback } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import LeadTable from '../components/leads/LeadTable';
import LeadFilters from '../components/leads/LeadFilters';
import LeadFormModal from '../components/leads/LeadFormModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useDebounce } from '../hooks/useDebounce';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export default function Leads() {
  const { showToast } = useToast();

  const [filters, setFilters] = useState({ search: '', status: 'All', priority: 'All', source: 'All', sort: 'newest' });
  const debouncedSearch = useDebounce(filters.search, 400);

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalResults: 0 });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [deletingLead, setDeletingLead] = useState(null);

  const fetchLeads = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 10,
          sort: filters.sort,
          search: debouncedSearch || undefined,
          status: filters.status !== 'All' ? filters.status : undefined,
          priority: filters.priority !== 'All' ? filters.priority : undefined,
          source: filters.source !== 'All' ? filters.source : undefined,
        };
        const res = await api.get('/leads', { params });
        setLeads(res.data.data);
        setPagination(res.data.pagination);
      } catch (err) {
        showToast('Unable to load leads.', 'error');
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, filters.status, filters.priority, filters.source, filters.sort, showToast]
  );

  useEffect(() => {
    fetchLeads(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filters.status, filters.priority, filters.source, filters.sort]);

  const handleAddOrEdit = async (formData) => {
    try {
      if (editingLead) {
        await api.put(`/leads/${editingLead._id}`, formData);
        showToast('Lead updated.', 'success');
      } else {
        await api.post('/leads', formData);
        showToast('Lead created.', 'success');
      }
      setModalOpen(false);
      setEditingLead(null);
      fetchLeads(pagination.page);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save lead.', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/leads/${deletingLead._id}`);
      showToast('Lead deleted.', 'success');
      setDeletingLead(null);
      fetchLeads(pagination.page);
    } catch (err) {
      showToast('Failed to delete lead.', 'error');
    }
  };

  return (
    <DashboardLayout title="Leads" subtitle="Manage and track your client pipeline.">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <LeadFilters filters={filters} onChange={setFilters} />
        <button
          onClick={() => {
            setEditingLead(null);
            setModalOpen(true);
          }}
          className="flex items-center justify-center gap-1.5 bg-lavender text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity shrink-0"
        >
          <Plus size={16} />
          Add Lead
        </button>
      </div>

      <div className="bg-surface border border-border rounded-2xl shadow-card overflow-hidden">
        <LeadTable
          leads={leads}
          loading={loading}
          onEdit={(lead) => {
            setEditingLead(lead);
            setModalOpen(true);
          }}
          onDelete={(lead) => setDeletingLead(lead)}
        />

        {!loading && leads.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border text-sm">
            <span className="text-text-secondary">
              {pagination.totalResults} lead{pagination.totalResults !== 1 ? 's' : ''} · Page {pagination.page} of {pagination.totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchLeads(pagination.page - 1)}
                className="p-1.5 rounded-lg text-text-secondary hover:bg-lavender-light disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchLeads(pagination.page + 1)}
                className="p-1.5 rounded-lg text-text-secondary hover:bg-lavender-light disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <LeadFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingLead(null);
        }}
        onSubmit={handleAddOrEdit}
        initialData={editingLead}
      />

      <ConfirmDialog
        open={Boolean(deletingLead)}
        onClose={() => setDeletingLead(null)}
        onConfirm={handleDelete}
        title="Delete lead?"
        message={`This will permanently remove ${deletingLead?.name || 'this lead'} and all associated notes and activity.`}
      />
    </DashboardLayout>
  );
}
