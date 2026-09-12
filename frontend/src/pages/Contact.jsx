import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const SOURCES = ['Website', 'Referral', 'LinkedIn', 'Instagram', 'Email', 'Other'];

const EMPTY_FORM = { name: '', email: '', phone: '', company: '', source: 'Website', service: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');

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

    if (form.phone.trim() && !/^[+\d\s()-]{7,20}$/.test(form.phone.trim())) {
      next.phone = 'Enter a valid phone number';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      await api.post('/public/contact', {
        ...form,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        company: form.company.trim(),
        service: form.service.trim(),
        message: form.message.trim(),
      });
      setSubmitted(true);
      setForm(EMPTY_FORM);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-3.5 py-2.5 rounded-xl border text-sm bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-lavender/50 ${
      errors[field] ? 'border-rose' : 'border-border focus:border-lavender'
    }`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-4 sm:px-6 py-5">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 rounded-lg bg-lavender flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-semibold text-lg text-text-primary">LeadFlow</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          {submitted ? (
            <div className="bg-surface border border-border rounded-2xl shadow-card p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-mint-light flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={24} className="text-mint" />
              </div>
              <h2 className="text-lg font-semibold text-text-primary mb-2">Thanks! Your inquiry has been received.</h2>
              <p className="text-sm text-text-secondary mb-6">Our team will get back to you shortly.</p>
              <Link to="/" className="text-sm font-medium text-lavender hover:underline">
                ← Back to home
              </Link>
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-2xl shadow-card p-6 sm:p-8">
              <h1 className="text-xl font-semibold text-text-primary mb-1">
                Send an Inquiry
              </h1>
              <p className="text-sm text-text-secondary mb-6">
                Tell us about your project and our team will review your inquiry and follow up.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-medium text-text-secondary mb-1">Full Name *</label>
                    <input
                      id="contact-name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => {
                        setForm({ ...form, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      className={inputClass('name')}
                    />
                    {errors.name && <p className="text-xs text-rose mt-1">{errors.name}</p>}
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-medium text-text-secondary mb-1">Email *</label>
                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => {
                        setForm({ ...form, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      className={inputClass('email')}
                    />
                    {errors.email && <p className="text-xs text-rose mt-1">{errors.email}</p>}
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-medium text-text-secondary mb-1">Phone</label>
                    <input
                      id="contact-phone"
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
                    <label className="block text-xs font-medium text-text-secondary mb-1">Company</label>
                    <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={inputClass('company')} />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-medium text-text-secondary mb-1">How did you hear about us?</label>
                    <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className={inputClass('source')}>
                      {SOURCES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-medium text-text-secondary mb-1">Service interested in</label>
                    <input value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className={inputClass('service')} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-text-secondary mb-1">Message</label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      placeholder="Tell us about your project or inquiry..."
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      className={inputClass('message')}
                    />
                  </div>
                </div>

                {apiError && <p className="text-sm text-rose">{apiError}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-lavender text-white font-medium text-sm py-2.5 rounded-xl hover:opacity-90 disabled:opacity-60"
                >
                  {submitting ? 'Sending...' : 'Send Inquiry'}
                </button>
                </form>

                <div className="mt-4 text-center">
                  <Link
                    to="/"
                    className="text-sm font-medium text-lavender hover:boldtext"
                  >
                    ← Back to home
                  </Link>
                </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
