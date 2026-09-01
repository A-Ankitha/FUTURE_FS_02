export default function KpiCard({ label, value, accent = 'lavender', icon: Icon }) {
  const accentClasses = {
    lavender: 'bg-lavender-light text-lavender',
    mint: 'bg-mint-light text-mint',
    blue: 'bg-blue-light text-blue',
    peach: 'bg-peach/25 text-peach',
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-text-secondary font-medium">{label}</span>
        {Icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accentClasses[accent]}`}>
            <Icon size={16} />
          </div>
        )}
      </div>
      <p className="text-2xl font-semibold text-text-primary">{value}</p>
    </div>
  );
}
