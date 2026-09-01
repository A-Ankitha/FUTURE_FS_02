import { useEffect, useState } from 'react';
import { Users, TrendingUp, CheckCircle2, XCircle } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import KpiCard from '../components/dashboard/KpiCard';
import StatusPieChart from '../components/charts/StatusPieChart';
import SourceBarChart from '../components/charts/SourceBarChart';
import TrendLineChart from '../components/charts/TrendLineChart';
import { SkeletonCard } from '../components/common/Skeleton';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export default function Analytics() {
  const { showToast } = useToast();
  const [overview, setOverview] = useState(null);
  const [statusData, setStatusData] = useState([]);
  const [sourceData, setSourceData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [overviewRes, statusRes, sourceRes, trendsRes] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/analytics/status'),
          api.get('/analytics/sources'),
          api.get('/analytics/trends?days=30'),
        ]);
        if (cancelled) return;
        setOverview(overviewRes.data.data);
        setStatusData(statusRes.data.data);
        setSourceData(sourceRes.data.data);
        setTrendData(trendsRes.data.data);
      } catch (err) {
        showToast('Unable to load analytics.', 'error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardLayout title="Analytics" subtitle="Conversion performance and pipeline insight.">
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard label="Total Leads" value={overview?.total ?? 0} accent="lavender" icon={Users} />
          <KpiCard label="Conversion Rate" value={`${overview?.conversionRate ?? 0}%`} accent="mint" icon={TrendingUp} />
          <KpiCard label="Converted" value={overview?.converted ?? 0} accent="mint" icon={CheckCircle2} />
          <KpiCard label="Lost" value={overview?.lost ?? 0} accent="peach" icon={XCircle} />
        </div>
      )}

      <div className="bg-surface border border-border rounded-2xl shadow-card p-5 mb-5">
        <h3 className="font-semibold text-text-primary mb-4">Lead Growth Over Time</h3>
        <TrendLineChart data={trendData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-surface border border-border rounded-2xl shadow-card p-5">
          <h3 className="font-semibold text-text-primary mb-4">Leads by Status</h3>
          <StatusPieChart data={statusData} />
        </div>
        <div className="bg-surface border border-border rounded-2xl shadow-card p-5">
          <h3 className="font-semibold text-text-primary mb-4">Leads by Source</h3>
          <SourceBarChart data={sourceData} />
        </div>
      </div>
    </DashboardLayout>
  );
}
