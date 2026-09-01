import { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

export default function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwords, setPasswords] = useState({ current: '', next: '' });

  const handleProfileSave = (e) => {
    e.preventDefault();
    showToast('Profile updated.', 'success');
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (passwords.next.length < 6) {
      showToast('New password must be at least 6 characters.', 'error');
      return;
    }
    setPasswords({ current: '', next: '' });
    showToast('Password changed.', 'success');
  };

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-lavender/50 focus:border-lavender';

  return (
    <DashboardLayout title="Settings" subtitle="Manage your profile, security, and preferences.">
      <div className="max-w-2xl space-y-5">
        <form onSubmit={handleProfileSave} className="bg-surface border border-border rounded-2xl shadow-card p-5">
          <h3 className="font-semibold text-text-primary mb-4">Profile</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Name</label>
              <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Email</label>
              <input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className={inputClass} />
            </div>
          </div>
          <button type="submit" className="mt-4 px-4 py-2 rounded-xl text-sm font-medium bg-lavender text-white hover:opacity-90">
            Save Profile
          </button>
        </form>

        <form onSubmit={handlePasswordSave} className="bg-surface border border-border rounded-2xl shadow-card p-5">
          <h3 className="font-semibold text-text-primary mb-4">Security</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Current Password</label>
              <input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">New Password</label>
              <input
                type="password"
                value={passwords.next}
                onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
          <button type="submit" className="mt-4 px-4 py-2 rounded-xl text-sm font-medium bg-lavender text-white hover:opacity-90">
            Change Password
          </button>
        </form>

        <div className="bg-surface border border-border rounded-2xl shadow-card p-5">
          <h3 className="font-semibold text-text-primary mb-4">Application</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">Theme</p>
              <p className="text-xs text-text-secondary">Choose light or dark mode.</p>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border text-sm font-medium text-text-primary hover:border-lavender"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
