import { useEffect, useState } from 'react';
import Modal from '../common/Modal';

const SOURCES = ['Website', 'Referral', 'LinkedIn', 'Instagram', 'Email', 'Other'];
const STATUSES = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];
const PRIORITIES = ['Low', 'Medium', 'High'];

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  company: '',
  source: 'Website',
  status: 'New',
  priority: 'Medium',
  message: '',
  followUpDate: '',
};

export default function LeadFormModal({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        company: initialData.company || '',
        source: initialData.source || 'Website',
        status: initialData.status || 'New',
        priority: initialData.priority || 'Medium',
        message: initialData.message || '',
        followUpDate: initialData.followUpDate
          ? initialData.followUpDate.slice(0, 10)
          : '',
      });
    } else {
      setForm(EMPTY_FORM);
    }

    setErrors({});
  }, [initialData, open]);

  const validate = () => {
    const next = {};

    if (!form.name.trim()) {
      next.name = 'Name is required';
    }

    if (!form.email.trim()) {
      next.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      next.email = 'Enter a valid email';
    }

    if (
      form.phone.trim() &&
      !/^[+\d\s()-]{7,20}$/.test(form.phone.trim())
    ) {
      next.phone = 'Enter a valid phone number';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    try {
      await onSubmit({
        ...form,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        company: form.company.trim(),
        message: form.message.trim(),
        followUpDate: form.followUpDate || undefined,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-3 py-2 rounded-xl border text-sm bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-lavender/50 ${
      errors[field]
        ? 'border-rose'
        : 'border-border focus:border-lavender'
    }`;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialData ? 'Edit Lead' : 'Add Lead'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="lead-name"
              className="block text-xs font-medium text-text-secondary mb-1"
            >
              Full Name *
            </label>
            <input
              id="lead-name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              className={inputClass('name')}
            />
            {errors.name && (
              <p className="text-xs text-rose mt-1">{errors.name}</p>
            )}
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="lead-email"
              className="block text-xs font-medium text-text-secondary mb-1"
            >
              Email *
            </label>
            <input
              id="lead-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              className={inputClass('email')}
            />
            {errors.email && (
              <p className="text-xs text-rose mt-1">{errors.email}</p>
            )}
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="lead-phone"
              className="block text-xs font-medium text-text-secondary mb-1"
            >
              Phone
            </label>
            <input
              id="lead-phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => {
                setForm({ ...form, phone: e.target.value });
                if (errors.phone) setErrors({ ...errors, phone: '' });
              }}
              className={inputClass('phone')}
            />
            {errors.phone && (
              <p className="text-xs text-rose mt-1">{errors.phone}</p>
            )}
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="lead-company"
              className="block text-xs font-medium text-text-secondary mb-1"
            >
              Company
            </label>
            <input
              id="lead-company"
              value={form.company}
              onChange={(e) =>
                setForm({ ...form, company: e.target.value })
              }
              className={inputClass('company')}
            />
          </div>

          <div>
            <label
              htmlFor="lead-source"
              className="block text-xs font-medium text-text-secondary mb-1"
            >
              Source
            </label>
            <select
              id="lead-source"
              value={form.source}
              onChange={(e) =>
                setForm({ ...form, source: e.target.value })
              }
              className={inputClass('source')}
            >
              {SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="lead-status"
              className="block text-xs font-medium text-text-secondary mb-1"
            >
              Status
            </label>
            <select
              id="lead-status"
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
              className={inputClass('status')}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="lead-priority"
              className="block text-xs font-medium text-text-secondary mb-1"
            >
              Priority
            </label>
            <select
              id="lead-priority"
              value={form.priority}
              onChange={(e) =>
                setForm({ ...form, priority: e.target.value })
              }
              className={inputClass('priority')}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="lead-follow-up"
              className="block text-xs font-medium text-text-secondary mb-1"
            >
              Follow-up Date
            </label>
            <input
              id="lead-follow-up"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={form.followUpDate}
              onChange={(e) =>
                setForm({ ...form, followUpDate: e.target.value })
              }
              className={inputClass('followUpDate')}
            />
          </div>

          <div className="col-span-2">
            <label
              htmlFor="lead-message"
              className="block text-xs font-medium text-text-secondary mb-1"
            >
              Message
            </label>
            <textarea
              id="lead-message"
              rows={4}
              placeholder="Add any project details or notes..."
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
              className={inputClass('message')}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:bg-lavender-light"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-lavender text-white hover:opacity-90 disabled:opacity-60"
          >
            {submitting
              ? 'Saving...'
              : initialData
                ? 'Save Changes'
                : 'Add Lead'}
          </button>
        </div>
      </form>
    </Modal>
  );
}