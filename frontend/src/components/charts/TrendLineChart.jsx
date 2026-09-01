import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import EmptyState from '../common/EmptyState';
import { TrendingUp } from 'lucide-react';

export default function TrendLineChart({ data }) {
  const total = data?.reduce((sum, d) => sum + d.count, 0) || 0;

  if (!total) {
    return <EmptyState icon={TrendingUp} title="No trend data yet" subtitle="Lead creation over time will appear here." />;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ left: -20 }}>
        <CartesianGrid vertical={false} stroke="var(--color-border)" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: 'var(--color-text-secondary)' }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
          tickFormatter={(d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
        <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip
          labelFormatter={(d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          contentStyle={{ borderRadius: 12, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
        />
        <Line type="monotone" dataKey="count" stroke="var(--color-lavender)" strokeWidth={2.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
