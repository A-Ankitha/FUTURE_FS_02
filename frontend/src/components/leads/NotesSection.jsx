import { useState } from 'react';
import { StickyNote } from 'lucide-react';
import EmptyState from '../common/EmptyState';
import { timeAgo } from '../../utils/formatDate';

export default function NotesSection({ notes, onAddNote }) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      await onAddNote(text.trim());
      setText('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          id="lead-note"
          type="text"
          autoComplete="off"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a note..."
          className="flex-1 px-3.5 py-2 rounded-xl border border-border bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-lavender/50 focus:border-lavender"
        />
        <button
          type="submit"
          disabled={submitting || !text.trim()}
          className="px-4 py-2 rounded-xl text-sm font-medium bg-lavender text-white hover:opacity-90 disabled:opacity-50 shrink-0"
        >
          Add
        </button>
      </form>

      {!notes?.length ? (
        <EmptyState icon={StickyNote} title="No notes yet" subtitle="Add a note to keep track of your conversations." />
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note._id} className="bg-background border border-border rounded-xl p-3.5">
              <p className="text-sm text-text-primary">{note.text}</p>
              <p className="text-xs text-text-secondary mt-1.5">
                {note.author?.name || 'Admin'} · {timeAgo(note.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
