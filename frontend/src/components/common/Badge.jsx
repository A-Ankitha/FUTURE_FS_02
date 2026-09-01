const STATUS_STYLES = {
  New: 'bg-lavender-light text-lavender',
  Contacted: 'bg-blue-light text-blue',
  Qualified: 'bg-peach/25 text-peach',
  Converted: 'bg-mint-light text-mint',
  Lost: 'bg-rose/20 text-rose',
};

const PRIORITY_STYLES = {
  Low: 'bg-mint-light text-mint',
  Medium: 'bg-peach/25 text-peach',
  High: 'bg-rose/20 text-rose',
};

const PRIORITY_DOT = {
  Low: 'bg-mint',
  Medium: 'bg-peach',
  High: 'bg-rose',
};

export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[status] || 'bg-border text-text-secondary'}`}
    >
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${PRIORITY_STYLES[priority] || 'bg-border text-text-secondary'}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[priority] || 'bg-text-secondary'}`} />
      {priority}
    </span>
  );
}
