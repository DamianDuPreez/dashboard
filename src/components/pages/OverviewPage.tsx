import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, LayoutGrid, Plus, Send, Sparkles, TrendingDown, TrendingUp } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { useTheme } from '@/context/ThemeContext';
import { GlassCard, PanelTitle } from '@/components/ui/GlassCard';
import { VirtualCard } from '@/components/ui/VirtualCard';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { TransactionList } from '@/components/transactions/TransactionList';
import type { DashboardActions } from '@/components/layout/DashboardLayout';
import { cn, formatMoney } from '@/lib/utils';

// Warm greys for the allocation bar — they sit on the ink panel whatever the theme is
const ALLOCATION_TONES = ['#FFFFFF', '#CFC8BC', '#8C867C', '#55524C', '#3A3834'];

const enter = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] as const },
});

export function OverviewPage({ openTransfer, navigate }: DashboardActions) {
  return (
    <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
      <motion.div {...enter(0)} className="lg:col-span-8">
        <StatementPanel openTransfer={openTransfer} navigate={navigate} />
      </motion.div>
      <motion.div {...enter(1)} className="lg:col-span-4">
        <CardsPanel onManage={() => navigate('wallets')} />
      </motion.div>
      <motion.div {...enter(2)} className="lg:col-span-8">
        <CashFlowPanel />
      </motion.div>
      <motion.div {...enter(3)} className="lg:col-span-4">
        <SpendingPanel />
      </motion.div>
      <motion.div {...enter(4)} className="lg:col-span-12">
        <GlassCard className="p-5 md:p-6 min-h-[420px]">
          <TransactionList />
        </GlassCard>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Statement — the dark headline panel with net position + actions
// ─────────────────────────────────────────────────────────────
function StatementPanel({ openTransfer, navigate }: DashboardActions) {
  const { wallets, transactions } = useWallet();
  const { palette } = useTheme();

  const flow = useMemo(() => {
    const completed = transactions.filter(t => t.status === 'Completed');
    return {
      in:      completed.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0),
      out:     completed.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0),
      pending: transactions.filter(t => t.status === 'Pending').length,
    };
  }, [transactions]);

  const net   = wallets.reduce((sum, w) => sum + w.balance, 0);
  const assets = wallets.filter(w => w.balance > 0).reduce((sum, w) => sum + w.balance, 0);
  const owed   = wallets.filter(w => w.balance < 0).reduce((sum, w) => sum + w.balance, 0);
  const [whole, cents] = formatMoney(net).split('.');

  const allocation = wallets
    .filter(w => w.balance > 0)
    .sort((a, b) => b.balance - a.balance)
    .map((w, i) => ({ ...w, share: assets ? w.balance / assets : 0, tone: ALLOCATION_TONES[i % ALLOCATION_TONES.length] }));

  const actions = [
    { label: 'Send',     icon: Send,          onClick: openTransfer },
    { label: 'Accounts', icon: LayoutGrid,    onClick: () => navigate('wallets') },
    { label: 'Activity', icon: ArrowDownLeft, onClick: () => navigate('transactions') },
    { label: 'Insights', icon: Sparkles,      onClick: () => navigate('analytics') },
  ];

  return (
    <div className="relative h-full overflow-hidden rounded-[22px] bg-ink text-white p-6 md:p-8 flex flex-col">
      {/* Theme glow + grain */}
      <div
        className="pointer-events-none absolute -top-32 -right-24 w-[420px] h-[420px] rounded-full blur-[90px] opacity-50 transition-colors duration-1000"
        style={{ backgroundColor: palette.primary }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 left-10 w-[320px] h-[320px] rounded-full blur-[110px] opacity-30 transition-colors duration-1000"
        style={{ backgroundColor: palette.secondary }}
      />
      <div className="grain absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none" />

      <div className="relative flex items-center justify-between gap-3">
        <p className="text-[13px] text-white/60">Net position</p>
        <span className="text-[11px] font-medium text-white/70 rounded-full border border-white/15 px-2.5 py-1">
          {wallets.length} {wallets.length === 1 ? 'account' : 'accounts'}
        </span>
      </div>

      <p className="relative font-display text-[52px] md:text-[72px] leading-[0.95] tracking-tight mt-3 tabular">
        {whole}<span className="text-white/40 text-[32px] md:text-[44px]">.{cents}</span>
      </p>

      <div className="relative mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px]">
        <span className="text-white/60">Assets <span className="text-white font-medium tabular">{formatMoney(assets)}</span></span>
        <span className="text-white/60">Owed <span className="text-white font-medium tabular">{formatMoney(Math.abs(owed))}</span></span>
      </div>

      {/* Actions */}
      <div className="relative mt-7 grid grid-cols-4 gap-2 sm:flex sm:gap-3">
        {actions.map(({ label, icon: Icon, onClick }, i) => (
          <button key={label} onClick={onClick} className="group flex flex-col sm:flex-row items-center gap-2 sm:gap-2.5">
            <span
              className={cn(
                'w-12 h-12 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all group-hover:-translate-y-0.5',
                i === 0 ? 'bg-white text-ink' : 'bg-white/10 text-white border border-white/10 group-hover:bg-white/15'
              )}
            >
              <Icon size={18} />
            </span>
            <span className="text-[12px] sm:text-[13px] font-medium text-white/80 group-hover:text-white sm:pr-2">{label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-6" />

      {/* Activity across every account */}
      <div className="relative mt-6 grid grid-cols-3 rounded-2xl border border-white/10 bg-white/[0.04] divide-x divide-white/10">
        {[
          { label: 'Money in',  value: formatMoney(flow.in) },
          { label: 'Money out', value: formatMoney(flow.out) },
          { label: 'Pending',   value: `${flow.pending} ${flow.pending === 1 ? 'payment' : 'payments'}` },
        ].map(s => (
          <div key={s.label} className="px-3 sm:px-4 py-3">
            <p className="text-[11px] text-white/50">{s.label}</p>
            <p className="text-[13px] sm:text-[15px] font-semibold tabular mt-0.5 truncate">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Allocation */}
      {allocation.length > 0 && (
        <div className="relative mt-6">
          <div className="flex h-2 w-full gap-1 overflow-hidden">
            {allocation.map(w => (
              <motion.div
                key={w.id}
                initial={{ width: 0 }}
                animate={{ width: `${w.share * 100}%` }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full"
                style={{ backgroundColor: w.tone }}
              />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
            {allocation.map(w => (
              <span key={w.id} className="flex items-center gap-2 text-[12px] text-white/60">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: w.tone }} />
                {w.name}
                <span className="text-white/90 tabular">{Math.round(w.share * 100)}%</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Cards — active card on top, account switcher underneath
// ─────────────────────────────────────────────────────────────
function CardsPanel({ onManage }: { onManage: () => void }) {
  const { wallets, activeWalletId, setActiveWalletId, activeWallet } = useWallet();
  const { palette } = useTheme();

  return (
    <GlassCard className="h-full p-5 flex flex-col">
      <PanelTitle title="Your cards" hint="Pick an account to focus on">
        <button
          onClick={onManage}
          aria-label="Manage wallets"
          className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-stone-500 hover:text-ink hover:border-stone-300 transition-colors"
        >
          <Plus size={15} />
        </button>
      </PanelTitle>

      <div className="mt-4">
        <AnimatePresence mode="wait">
          {activeWallet && (
            <motion.div
              key={activeWallet.id}
              initial={{ opacity: 0, rotateX: -12, y: 8 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              exit={{ opacity: 0, rotateX: 12, y: -8 }}
              transition={{ duration: 0.28 }}
              style={{ transformPerspective: 900 }}
            >
              <VirtualCard wallet={activeWallet} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex flex-col gap-1">
        {wallets.map(w => {
          const active = w.id === activeWalletId;
          return (
            <button
              key={w.id}
              onClick={() => setActiveWalletId(w.id)}
              className={cn(
                'flex items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors',
                active ? 'bg-canvas' : 'hover:bg-canvas/60'
              )}
            >
              <span
                className="w-8 h-6 rounded-md shrink-0 border border-black/5"
                style={{ background: w.type === 'credit' ? '#1B1C22' : palette.primary, opacity: active ? 1 : 0.55 }}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-medium text-ink truncate">{w.name}</span>
                <span className="block text-[11px] text-stone-500 font-mono">{w.cardNumber}</span>
              </span>
              <span className={cn('text-[13px] font-semibold tabular', w.balance < 0 ? 'text-rose-600' : 'text-ink')}>
                {formatMoney(w.balance)}
              </span>
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
}

// ─────────────────────────────────────────────────────────────
// Cash flow — chart with range switch and month-on-month change
// ─────────────────────────────────────────────────────────────
function CashFlowPanel() {
  const { activeRevenue, activeWallet } = useWallet();
  const [months, setMonths] = useState(6);

  const latest   = activeRevenue.at(-1)?.revenue ?? 0;
  const previous = activeRevenue.at(-2)?.revenue;
  let growth: number | null = null;
  if (previous !== undefined) {
    growth = previous === 0 ? (latest === 0 ? 0 : Math.sign(latest) * 100) : ((latest - previous) / Math.abs(previous)) * 100;
  }
  const isUp = (growth ?? 0) >= 0;

  return (
    <GlassCard className="h-full p-5 md:p-6 flex flex-col">
      <PanelTitle title="Cash flow" hint={activeWallet?.name}>
        <div className="flex p-0.5 rounded-full bg-canvas border border-line">
          {[3, 6].map(m => (
            <button
              key={m}
              onClick={() => setMonths(m)}
              className={cn(
                'relative px-3 py-1 text-[12px] font-medium rounded-full transition-colors',
                months === m ? 'text-ink' : 'text-stone-500 hover:text-ink'
              )}
            >
              {months === m && (
                <motion.span layoutId="range-pill" className="absolute inset-0 rounded-full bg-white shadow-sm border border-line" />
              )}
              <span className="relative">{m}M</span>
            </button>
          ))}
        </div>
      </PanelTitle>

      <div className="mt-4 flex items-end gap-3 flex-wrap">
        <p className="font-display text-[40px] leading-none tracking-tight tabular">{formatMoney(latest)}</p>
        {growth !== null && (
          <span
            className={cn(
              'mb-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-semibold tabular',
              isUp ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'
            )}
          >
            {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {isUp ? '+' : ''}{growth.toFixed(1)}%
          </span>
        )}
        <span className="mb-1 text-[12px] text-stone-500">vs last month</span>
      </div>

      <div className="flex-1 min-h-[240px] mt-4 -ml-2">
        <RevenueChart months={months} />
      </div>
    </GlassCard>
  );
}

// ─────────────────────────────────────────────────────────────
// Spending — where money went on the focused account
// ─────────────────────────────────────────────────────────────
function SpendingPanel() {
  const { activeTransactions } = useWallet();
  const { palette } = useTheme();

  const { categories, spent, received, pending } = useMemo(() => {
    const settled = activeTransactions.filter(t => t.status === 'Completed');
    const byCategory = new Map<string, number>();
    settled.filter(t => t.amount < 0).forEach(t => {
      byCategory.set(t.category, (byCategory.get(t.category) ?? 0) + Math.abs(t.amount));
    });
    return {
      categories: [...byCategory.entries()].sort((a, b) => b[1] - a[1]),
      spent:      settled.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0),
      received:   settled.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0),
      pending:    activeTransactions.filter(t => t.status === 'Pending').length,
    };
  }, [activeTransactions]);

  const top = categories[0]?.[1] ?? 0;

  return (
    <GlassCard className="h-full p-5 md:p-6 flex flex-col">
      <PanelTitle title="Where it went" hint="Completed payments by category" />

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-canvas px-3.5 py-3">
          <p className="flex items-center gap-1 text-[11px] text-stone-500"><ArrowUpRight size={12} /> Out</p>
          <p className="text-[17px] font-semibold tabular mt-0.5">{formatMoney(spent)}</p>
        </div>
        <div className="rounded-2xl bg-canvas px-3.5 py-3">
          <p className="flex items-center gap-1 text-[11px] text-stone-500"><ArrowDownLeft size={12} /> In</p>
          <p className="text-[17px] font-semibold tabular mt-0.5 text-emerald-700">{formatMoney(received)}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3.5 flex-1">
        {categories.length === 0 ? (
          <p className="text-[13px] text-stone-500 m-auto text-center">No spending on this account yet.</p>
        ) : (
          categories.slice(0, 5).map(([category, amount], i) => (
            <div key={category}>
              <div className="flex items-baseline justify-between text-[13px]">
                <span className="text-ink font-medium">{category}</span>
                <span className="tabular text-stone-600">{formatMoney(amount)}</span>
              </div>
              <div className="mt-1.5 h-1.5 rounded-full bg-canvas overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(amount / top) * 100}%` }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: palette.primary, opacity: 1 - i * 0.16 }}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {pending > 0 && (
        <p className="mt-5 text-[12px] text-stone-500 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          {pending} pending {pending === 1 ? 'payment' : 'payments'} not counted yet
        </p>
      )}
    </GlassCard>
  );
}
