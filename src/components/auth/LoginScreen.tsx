import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, DEMO_NAME, DEMO_EMAIL } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { RotateCcw, ArrowRight, Zap } from 'lucide-react';

export function LoginScreen() {
  const { login }    = useAuth();
  const { palette }  = useTheme();
  const [name, setName]   = useState(DEMO_NAME);
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [phase, setPhase] = useState<'form' | 'welcome'>('form');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setPhase('welcome');
    setTimeout(() => login(name.trim(), email.trim()), 1600);
  };

  return (
    <div className="min-h-screen w-full bg-[#F9FAFB] flex items-center justify-center px-4">
      <AnimatePresence mode="wait">
        {phase === 'form' ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="w-full max-w-sm"
          >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow"
                style={{ backgroundColor: palette.primary }}
              >
                B
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Brand OS</span>
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Welcome back</h1>
            <p className="text-sm text-slate-500 mb-8">
              Pre-filled with demo credentials.{' '}
              <span className="font-medium" style={{ color: palette.primary }}>No account needed.</span>
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Display Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Display Name
                </label>
                <div className="flex gap-2">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 transition-shadow"
                    style={{ '--tw-ring-color': palette.primary } as React.CSSProperties}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setName(DEMO_NAME)}
                    title="Revert to demo name"
                    className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all"
                  >
                    <RotateCcw size={15} />
                  </button>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 transition-shadow"
                    style={{ '--tw-ring-color': palette.primary } as React.CSSProperties}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setEmail(DEMO_EMAIL)}
                    title="Revert to demo email"
                    className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all"
                  >
                    <RotateCcw size={15} />
                  </button>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-semibold text-sm shadow-md mt-2 transition-all"
                style={{ backgroundColor: palette.primary }}
              >
                Enter Dashboard
                <ArrowRight size={16} />
              </motion.button>
            </form>

            {/* Footer */}
            <p className="text-center text-xs text-slate-400 mt-8 flex items-center justify-center gap-1.5">
              <Zap size={11} />
              Theme shifts automatically with your time of day
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.06 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg"
              style={{ backgroundColor: palette.primary }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-1">Welcome back</p>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{name}</h2>
            </div>
            <motion.div
              className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: `${palette.primary}40`, borderTopColor: palette.primary }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
