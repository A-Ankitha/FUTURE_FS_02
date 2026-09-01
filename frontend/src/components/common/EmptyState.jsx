export default function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-lavender-light flex items-center justify-center mb-4">
          <Icon size={22} className="text-lavender" />
        </div>
      )}
      <p className="text-text-primary font-medium">{title}</p>
      {subtitle && <p className="text-text-secondary text-sm mt-1 max-w-xs">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
