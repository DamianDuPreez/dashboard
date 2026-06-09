import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { WalletProvider, useWallet } from './context/WalletContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { GlassCard } from './components/ui/GlassCard';
import { RevenueChart } from './components/charts/RevenueChart';
import { TransactionList } from './components/transactions/TransactionList';
import { VirtualCard } from './components/ui/VirtualCard';
import { LoginScreen } from './components/auth/LoginScreen';
import { useTheme } from './context/ThemeContext';
import { cn } from '@/lib/utils';

function DashboardContent() {
  const { wallets, activeWalletId, setActiveWalletId, activeRevenue } = useWallet();
  const { palette } = useTheme();
  const carouselRef = useRef<HTMLDivElement>(null);

  const activeWallet = wallets.find(w => w.id === activeWalletId);
  
  let growthRateStr = '+0.0%';
  let isGrowthPositive = true;
  if (activeRevenue && activeRevenue.length >= 2) {
    const latest = activeRevenue[activeRevenue.length - 1].revenue;
    const previous = activeRevenue[activeRevenue.length - 2].revenue;
    if (previous === 0) {
      if (latest > 0) growthRateStr = '+100.0%';
      else if (latest < 0) { growthRateStr = '-100.0%'; isGrowthPositive = false; }
    } else {
      const diff = latest - previous;
      const rate = (diff / Math.abs(previous)) * 100;
      isGrowthPositive = rate >= 0;
      growthRateStr = `${isGrowthPositive ? '+' : ''}${rate.toFixed(1)}%`;
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Wallet Carousel */}
      <div className="w-full overflow-hidden" ref={carouselRef}>
        <motion.div
          drag="x"
          dragConstraints={carouselRef}
          className="flex gap-4 pb-2 cursor-grab active:cursor-grabbing select-none"
        >
          {wallets.map(wallet => (
            <VirtualCard
              key={wallet.id}
              wallet={wallet}
              isActive={wallet.id === activeWalletId}
              onClick={() => setActiveWalletId(wallet.id)}
            />
          ))}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <GlassCard className="col-span-1 md:col-span-2 h-[420px] p-6 flex flex-col">
          <p className="text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-1">Revenue Overview</p>
          <div className="flex-1 w-full min-h-0">
            <RevenueChart />
          </div>
        </GlassCard>

        {/* Quick Stats */}
        <GlassCard className="col-span-1 h-[420px] p-6 flex flex-col gap-4">
          <p className="text-[11px] font-bold tracking-widest uppercase text-slate-400">Quick Stats</p>

          <div className="flex-1 flex flex-col gap-3">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-medium text-slate-500 mb-1">Total Balance</p>
              <p className="text-3xl font-bold tracking-tight text-slate-900">
                {(activeWallet?.balance || 0) < 0 ? '-' : ''}${Math.abs(activeWallet?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-medium text-slate-500 mb-1">Monthly Growth</p>
              <p className={cn(
                'text-3xl font-bold tracking-tight',
                isGrowthPositive ? 'text-emerald-600' : 'text-rose-600'
              )}>
                {growthRateStr}
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-100 flex items-center gap-3" style={{ backgroundColor: `${palette.primary}08` }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: palette.primary }} />
              <div>
                <p className="text-xs font-medium text-slate-500">Active Theme</p>
                <p className="text-sm font-semibold text-slate-800 capitalize" style={{ color: palette.primary }}>
                  {activeWallet?.name}
                </p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Transactions */}
        <GlassCard className="col-span-1 md:col-span-3 p-6 min-h-[500px]">
          <TransactionList />
        </GlassCard>
      </div>
    </div>
  );
}

function AppInner() {
  const { isLoggedIn } = useAuth();

  return (
    <AnimatePresence mode="wait">
      {isLoggedIn ? (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="h-screen"
        >
          <WalletProvider>
            <DashboardLayout>
              <DashboardContent />
            </DashboardLayout>
          </WalletProvider>
        </motion.div>
      ) : (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.35 }}
          className="h-screen"
        >
          <LoginScreen />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <AppInner />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
