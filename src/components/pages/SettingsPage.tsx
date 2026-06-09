import { useTheme } from '@/context/ThemeContext';
import { palettes, getTimeDisplayName } from '@/context/ThemeContext';
import type { TimeOfDay } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Sun, Moon, Sunrise, Sunset, Clock, Zap } from 'lucide-react';

const TIME_OPTIONS: { id: TimeOfDay; icon: React.ElementType }[] = [
  { id: 'auto', icon: Clock },
  { id: 'pre-dawn', icon: Moon },
  { id: 'sunrise', icon: Sunrise },
  { id: 'daytime', icon: Sun },
  { id: 'sunset', icon: Sunset },
  { id: 'dusk', icon: Moon },
  { id: 'night', icon: Moon },
];

export function SettingsPage() {
  const { palette, mode, setMode, activeTimeOfDay } = useTheme();
  const { displayName, email, logout } = useAuth();

  return (
    <div className="max-w-2xl mx-auto py-6 flex flex-col gap-6 text-slate-900">
      {/* Header */}
      <div>
        <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-1">Configuration</p>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      {/* ── Theme Override ── */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 bg-white border border-slate-200 shadow-sm"
      >
        <div className="flex items-center gap-2.5 mb-1">
          <Zap size={16} style={{ color: palette.primary }} />
          <h2 className="text-sm font-bold text-slate-900">Time of Day Theme</h2>
        </div>
        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          Manually override the automatic colour palette, or let it shift in real-time with your local time.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TIME_OPTIONS.map(({ id, icon: Icon }) => {
            const preview = id === 'auto' ? palettes[activeTimeOfDay] : palettes[id as Exclude<TimeOfDay, 'auto'>];
            const isSelected = mode === id;

            return (
              <button
                key={id}
                onClick={() => setMode(id)}
                className={cn(
                  'relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 overflow-hidden',
                  isSelected ? 'scale-[1.03] shadow-md' : 'opacity-70 hover:opacity-100 hover:scale-[1.01]'
                )}
                style={{ backgroundColor: preview.primary, borderColor: isSelected ? palette.secondary : 'transparent' }}
              >
                <div
                  className="absolute inset-0 opacity-40"
                  style={{ background: `radial-gradient(circle at top right, ${preview.secondary}, transparent 70%)` }}
                />
                <Icon size={18} className="relative text-white" />
                <span className="relative text-[10px] font-semibold text-white text-center leading-tight">
                  {getTimeDisplayName(id)}
                </span>
                {isSelected && (
                  <motion.div
                    layoutId="theme-selected-ring"
                    className="absolute inset-0 rounded-[10px] border-2 pointer-events-none"
                    style={{ borderColor: palette.secondary }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-slate-400 mt-4">
          Active: <span className="font-semibold text-slate-600">{getTimeDisplayName(activeTimeOfDay)}</span>
          {mode === 'auto' && ' (auto)'}
        </p>
      </motion.section>

      {/* ── Profile ── */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        className="rounded-2xl p-6 bg-white border border-slate-200 shadow-sm flex items-center justify-between"
      >
        <div>
          <h2 className="text-sm font-bold text-slate-900 mb-4">Profile</h2>
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-sm shrink-0"
              style={{ backgroundColor: palette.primary }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{displayName}</p>
              <p className="text-sm text-slate-500">{email}</p>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 mt-8 rounded-xl border border-rose-300 text-rose-600 text-sm font-medium hover:bg-rose-50 transition-colors"
        >
          Sign Out
        </button>
      </motion.section>
    </div>
  );
}
