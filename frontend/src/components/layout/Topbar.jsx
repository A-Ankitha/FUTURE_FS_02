import { Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Topbar({ title, subtitle, onMenuClick }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4 border-b border-border bg-background/80 backdrop-blur sticky top-0 z-30">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-text-secondary p-1.5 rounded-lg hover:bg-lavender-light"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-text-primary truncate">{title}</h1>
          {subtitle && <p className="text-sm text-text-secondary truncate">{subtitle}</p>}
        </div>
      </div>

      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="w-9 h-9 rounded-full flex items-center justify-center border border-border text-text-secondary hover:text-lavender hover:border-lavender transition-colors shrink-0"
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </header>
  );
}
