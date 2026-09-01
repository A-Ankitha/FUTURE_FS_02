import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import EmptyState from '../common/EmptyState';
import { PieChart as PieIcon } from 'lucide-react';

const COLORS = {
  New: '#7C6EE6',
  Contacted: '#B9D4EE',
  Qualified: '#F4C6A8',
  Converted: '#A8D5C2',
  Lost: '#F1B8CC',
};

export default function StatusPieChart({ data }) {
  const total = data?.reduce((sum, d) => sum + d.count, 0) || 0;

  if (!total) {
    return <EmptyState icon={PieIcon} title="No status data yet" subtitle="Add or receive leads to see this chart." />;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="count" nameKey="status" innerRadius={55} outerRadius={90} paddingAngle={2}>
          {data.map((entry) => (
            <Cell key={entry.status} fill={COLORS[entry.status] || '#B9D4EE'} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
