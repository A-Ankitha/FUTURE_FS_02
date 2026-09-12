import { Sun, Moon, User, ShieldCheck, Palette } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <DashboardLayout
      title="Settings"
      subtitle="Manage your account and application preferences."
    >
      <div className="max-w-2xl space-y-5">
        {/* Account */}
        <div className="bg-surface border border-border rounded-2xl shadow-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-lavender-light text-lavender flex items-center justify-center">
              <User size={17} />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Account</h3>
              <p className="text-xs text-text-secondary">
                Your current admin account information.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-text-secondary mb-1">
                Name
              </p>
              <div className="px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text-primary">
                {user?.name || 'Admin'}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-text-secondary mb-1">
                Email
              </p>
              <div className="px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text-primary">
                {user?.email || 'Not available'}
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-surface border border-border rounded-2xl shadow-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-mint-light text-mint flex items-center justify-center">
              <ShieldCheck size={17} />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Security</h3>
              <p className="text-xs text-text-secondary">
                Your CRM account is protected by authentication.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-sm font-medium text-text-primary">
              Admin authentication
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Access to the CRM is restricted to authenticated admin users.
            </p>
          </div>
        </div>

        {/* Application */}
        <div className="bg-surface border border-border rounded-2xl shadow-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-blue-light text-blue flex items-center justify-center">
              <Palette size={17} />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Application</h3>
              <p className="text-xs text-text-secondary">
                Customize your LeadFlow experience.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-text-primary">Theme</p>
              <p className="text-xs text-text-secondary mt-1">
                Choose between light and dark mode.
              </p>
            </div>

            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border text-sm font-medium text-text-primary hover:border-lavender transition-colors"
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