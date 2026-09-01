import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import EmptyState from '../common/EmptyState';
import { BarChart3 } from 'lucide-react';

export default function SourceBarChart({ data }) {
  const total = data?.reduce((sum, d) => sum + d.count, 0) || 0;

  if (!total) {
    return <EmptyState icon={BarChart3} title="No source data yet" subtitle="Leads will be grouped by source here." />;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ left: -20 }}>
        <CartesianGrid vertical={false} stroke="var(--color-border)" />
        <XAxis dataKey="source" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip
          cursor={{ fill: 'var(--color-lavender-light)' }}
          contentStyle={{ borderRadius: 12, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
        />
        <Bar dataKey="count" fill="var(--color-lavender)" radius={[6, 6, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}
