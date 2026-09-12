import { Link } from 'react-router-dom';
import { Sparkles, Inbox, LineChart, CalendarClock, TrendingUp, ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const FEATURES = [
  { icon: Inbox, title: 'Lead Capture', desc: 'Every inquiry from your website is captured automatically and organized instantly.' },
  { icon: LineChart, title: 'Smart Tracking', desc: 'See exactly where each lead stands in your pipeline, at a glance.' },
  { icon: CalendarClock, title: 'Follow-up Management', desc: 'Never miss a follow-up with overdue, today, and upcoming views.' },
  { icon: TrendingUp, title: 'Conversion Analytics', desc: 'Understand your sources, status breakdown, and growth over time.' },
];

const STEPS = [
  { number: '01', title: 'Capture', desc: 'Potential clients submit their project details through the public inquiry form.' },
  { number: '02', title: 'Organize', desc: 'Each inquiry is automatically stored as a lead in the secure admin CRM.' },
  { number: '03', title: 'Follow Up', desc: 'Admins can update lead status, add notes, and schedule follow-ups so no opportunity is missed.' },
  { number: '04', title: 'Convert', desc: 'Admins move qualified leads through the pipeline and mark successful opportunities as converted.' },
];

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-lavender flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-semibold text-lg text-text-primary">LeadFlow</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
          <a href="#home" className="hover:text-text-primary">Home</a>
          <a href="#features" className="hover:text-text-primary">Features</a>
          <a href="#about" className="hover:text-text-primary">About</a>
          <a href="#how-it-works" className="hover:text-text-primary">How It Works</a>
          <Link to="/contact" className="hover:text-text-primary">Contact</Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button onClick={toggleTheme} aria-label="Toggle theme" className="w-9 h-9 rounded-full flex items-center justify-center border border-border text-text-secondary hover:text-lavender hover:border-lavender">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link to="/login" className="bg-lavender text-white text-sm font-medium px-4 py-2 rounded-xl hover:opacity-90">
            Admin Login
          </Link>
        </div>

        <button className="md:hidden text-text-primary" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border px-4 py-4 space-y-3 bg-background">
          <a href="#home" onClick={() => setOpen(false)} className="block text-sm text-text-secondary">Home</a>          
          <a href="#features" onClick={() => setOpen(false)} className="block text-sm text-text-secondary">Features</a>
          <a href="#about" onClick={() => setOpen(false)} className="block text-sm text-text-secondary">About</a>
          <a href="#how-it-works" onClick={() => setOpen(false)} className="block text-sm text-text-secondary">How It Works</a>
          <Link to="/contact" onClick={() => setOpen(false)} className="block text-sm text-text-secondary">Contact</Link>
          <Link to="/login" onClick={() => setOpen(false)} className="block bg-lavender text-white text-sm font-medium px-4 py-2 rounded-xl text-center">
            Admin Login
          </Link>
        </div>
      )}
    </header>
  );
}

export default function Landing() {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      {/* Hero */}
      <section id="home" className="max-w-4xl mx-auto text-center px-4 sm:px-6 pt-20 pb-16">
        <span className="inline-flex items-center gap-1.5 bg-lavender-light text-lavender text-xs font-medium px-3 py-1.5 rounded-full mb-5">
          <Sparkles size={12} /> Client Lead Management Platform
        </span>
        <h1 className="text-3xl sm:text-5xl font-semibold text-text-primary leading-tight">
          Turn incoming leads into lasting clients.
        </h1>
        <p className="text-text-secondary mt-5 max-w-xl mx-auto">
          LeadFlow helps businesses capture, organize, follow up with, and convert 
          client inquiries from one secure workspace.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Link to="/contact" className="flex items-center gap-1.5 bg-lavender text-white font-medium px-6 py-3 rounded-xl hover:opacity-90 w-full sm:w-auto justify-center">
            Send an Inquiry <ArrowRight size={16} />
          </Link>
          <a href="#how-it-works" className="font-medium px-6 py-3 rounded-xl border border-border text-text-primary hover:border-lavender w-full sm:w-auto text-center">
            See How It Works
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold tracking-wide text-lavender">
            FEATURES
          </span>

          <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary mt-2">
            Everything you need to manage leads
          </h2>

          <p className="text-text-secondary mt-3">
            Capture inquiries, organize your pipeline, follow up with clients, and
            track business performance from one workspace.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-surface border border-border rounded-2xl p-6 shadow-card">
              <div className="w-10 h-10 rounded-xl bg-lavender-light flex items-center justify-center mb-4">
                <f.icon size={18} className="text-lavender" />
              </div>
              <h3 className="font-semibold text-text-primary mb-1.5">{f.title}</h3>
              <p className="text-sm text-text-secondary">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-semibold tracking-wide text-lavender">
          WHO IT'S FOR
        </span>

        <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary mt-2">
          One system, two simple experiences
        </h2>

        <p className="text-text-secondary mt-3">
          LeadFlow connects potential clients with the business team managing their inquiries.
        </p>
      </div>

      {/* How it works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-semibold text-text-primary text-center mb-10">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((s) => (
            <div key={s.number} className="text-center">
              <span className="text-lavender font-semibold text-sm">{s.number}</span>
              <h3 className="font-semibold text-text-primary mt-1.5 mb-1.5">{s.title}</h3>
              <p className="text-sm text-text-secondary">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="bg-lavender-light rounded-2xl p-10">
          <h2 className="text-xl sm:text-2xl font-semibold text-text-primary mb-3">See LeadFlow in action</h2>
          <p className="text-text-secondary mb-6">Submit a sample inquiry and see how a new lead enters the CRM and can be managed by an admin. </p>
          <Link to="/contact" className="inline-flex items-center gap-1.5 bg-lavender text-white font-medium px-6 py-3 rounded-xl hover:opacity-90">
            Submit an Inquiry <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-lavender flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-semibold text-text-primary">LeadFlow</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-text-secondary">
            <a href="#features" className="hover:text-text-primary">Features</a>
            <Link to="/contact" className="hover:text-text-primary">Contact</Link>
          </div>
          <p className="text-xs text-text-secondary">© {new Date().getFullYear()} LeadFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
