import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Sparkles, PhoneCall, CheckCircle2, TrendingUp } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import KpiCard from '../components/dashboard/KpiCard';
import RecentLeads from '../components/dashboard/RecentLeads';
import UpcomingFollowUps from '../components/dashboard/UpcomingFollowUps';
import StatusPieChart from '../components/charts/StatusPieChart';
import SourceBarChart from '../components/charts/SourceBarChart';
import { SkeletonCard } from '../components/common/Skeleton';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [statusData, setStatusData] = useState([]);
  const [sourceData, setSourceData] = useState([]);
  const [recentLeads, setRecentLeads] = useState([]);
  const [followUps, setFollowUps] = useState({ overdue: [], upcoming: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [overviewRes, statusRes, sourceRes, leadsRes, followUpsRes] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/analytics/status'),
          api.get('/analytics/sources'),
          api.get('/leads?sort=newest&limit=5'),
          api.get('/leads/followups/board'),
        ]);
        if (cancelled) return;
        setOverview(overviewRes.data.data);
        setStatusData(statusRes.data.data);
        setSourceData(sourceRes.data.data);
        setRecentLeads(leadsRes.data.data);
        setFollowUps(followUpsRes.data.data);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <DashboardLayout title={`Good morning, ${user?.name || 'Admin'}`} subtitle="A quick overview of your lead pipeline and today's priorities.">
      <p className="text-sm text-text-secondary mb-6">{today}</p>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <KpiCard label="Total Leads" value={overview?.total ?? 0} accent="lavender" icon={Users} />
          <KpiCard label="New Leads" value={overview?.new ?? 0} accent="blue" icon={Sparkles} />
          <KpiCard label="Contacted" value={overview?.contacted ?? 0} accent="peach" icon={PhoneCall} />
          <KpiCard label="Converted" value={overview?.converted ?? 0} accent="mint" icon={CheckCircle2} />
          <KpiCard label="Conversion Rate" value={`${overview?.conversionRate ?? 0}%`} accent="lavender" icon={TrendingUp} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-card">
          <div className="mb-4">
            <h3 className="font-semibold text-text-primary">
              Lead Status Distribution
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              See how your current leads are progressing through the pipeline.
            </p>
          </div>
          <StatusPieChart data={statusData} />
        </div>
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-card">
          <div className="mb-4">
            <h3 className="font-semibold text-text-primary">
              Leads by Source
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              See which channels are generating your leads.
            </p>
          </div>
          <SourceBarChart data={sourceData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-primary">Recent Leads</h3>
            <Link to="/leads" className="text-sm text-lavender font-medium hover:underline">
              View all leads
            </Link>
          </div>
          <RecentLeads leads={recentLeads} />
        </div>
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-card">
          <div className="mb-4">
            <h3 className="font-semibold text-text-primary">
              Upcoming Follow-ups
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Stay on top of scheduled conversations.
            </p>
          </div>
          <UpcomingFollowUps overdue={followUps.overdue} upcoming={followUps.upcoming} />
        </div>
      </div>
    </DashboardLayout>
  );
}
