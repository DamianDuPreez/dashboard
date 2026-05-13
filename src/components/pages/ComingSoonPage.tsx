import { motion } from 'framer-motion';
import { Construction, BarChart3, ArrowRightLeft, Wallet } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import type { AppPage } from '@/components/layout/Sidebar';

const PAGE_META: Record<string, { label: string; icon: React.ElementType; description: string; features: string[] }> = {
  analytics: {
    label: 'Analytics',
    icon: BarChart3,
    description: 'Deep-dive charts, spending breakdowns, and cash flow analysis are on the way.',
    features: ['Spending Heatmap', 'Cash Flow Projections', 'Merchant Breakdown', 'Monthly P&L'],
  },
  transactions: {
    label: 'Transactions',
    icon: ArrowRightLeft,
    description: 'Full transaction history, export tools, and smart categorisation coming soon.',
    features: ['Advanced Filters', 'CSV / PDF Export', 'Auto-Categorisation', 'Smart Search'],
  },
  wallets: {
    label: 'Wallets',
    icon: Wallet,
    description: 'Multi-wallet management, linked accounts, and card controls are in progress.',
    features: ['Add Linked Accounts', 'Card Freeze / Unfreeze', 'Spend Limits', 'Virtual Cards'],
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 22, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] as const } },
};

const featureContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.3 } },
};

const featurePillVariants = {
  hidden:  { opacity: 0, scale: 0.88, y: 8 },
  visible: { opacity: 1, scale: 1,    y: 0,  transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] as const } },
};

export function ComingSoonPage({ page }: { page: AppPage }) {
  const { palette } = useTheme();
  const meta = PAGE_META[page];
  if (!meta) return null;

  const Icon = meta.icon;

  return (
    <motion.div
      // Always slate text — sits on the white #F9FAFB background
      className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-8 text-slate-900"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Icon block */}
      <motion.div variants={itemVariants} className="relative">
        {/* Subtle glow halo — uses primary accent, low opacity so it works on white */}
        <div
          className="absolute inset-0 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: palette.primary, transform: 'scale(2.2)' }}
        />
        <div
          className="relative w-28 h-28 rounded-3xl flex items-center justify-center border border-slate-200 bg-white shadow-sm"
        >
          <Icon size={48} style={{ color: palette.primary }} />
        </div>
      </motion.div>

      {/* Labels */}
      <div className="text-center max-w-sm flex flex-col items-center gap-3">
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-2">
          <Construction size={13} className="text-slate-400" />
          <span className="text-[11px] font-bold tracking-widest uppercase text-slate-400">Coming Soon</span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-4xl font-bold tracking-tight text-slate-900">
          {meta.label}
        </motion.h1>

        <motion.p variants={itemVariants} className="leading-relaxed text-sm text-slate-500">
          {meta.description}
        </motion.p>
      </div>

      {/* Feature pills */}
      <motion.div
        variants={featureContainerVariants}
        className="flex flex-wrap justify-center gap-2 max-w-xs"
      >
        {meta.features.map(feature => (
          <motion.div
            key={feature}
            variants={featurePillVariants}
            className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 shadow-sm"
          >
            {feature}
          </motion.div>
        ))}
      </motion.div>

      {/* Progress dots — all use explicit colours, never currentColor */}
      <motion.div variants={itemVariants} className="flex items-center gap-2">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="rounded-full"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.35 }}
            style={{
              width:           i === 0 ? 8 : 6,
              height:          i === 0 ? 8 : 6,
              // Dot 0: theme accent; dots 1 & 2: slate-300 — always visible on white
              backgroundColor: i === 0 ? palette.primary : '#cbd5e1',
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
