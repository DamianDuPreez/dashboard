import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar, MobileBottomNav } from './Sidebar';
import type { AppPage } from './Sidebar';
import { TopBar } from './TopBar';
import { TransferModal } from '../modals/TransferModal';
import { ComingSoonPage } from '../pages/ComingSoonPage';
import { SettingsPage } from '../pages/SettingsPage';
import { TransactionsPage } from '../pages/TransactionsPage';
import { WalletsPage } from '../pages/WalletsPage';

const PAGE_TRANSITION = {
  initial:    { opacity: 0, y: 12 },
  animate:    { opacity: 1, y: 0 },
  exit:       { opacity: 0, y: -8 },
  transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] as const },
};

/** Actions the overview page can trigger on the surrounding shell */
export interface DashboardActions {
  openTransfer: () => void;
  navigate: (page: AppPage) => void;
}

export function DashboardLayout({ children }: { children: (actions: DashboardActions) => React.ReactNode }) {
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [activePage, setActivePage] = useState<AppPage>('overview');

  const actions: DashboardActions = {
    openTransfer: () => setIsTransferOpen(true),
    navigate: setActivePage,
  };

  const renderPageContent = () => {
    if (activePage === 'overview')     return children(actions);
    if (activePage === 'transactions') return <TransactionsPage />;
    if (activePage === 'wallets')      return <WalletsPage />;
    if (activePage === 'settings')     return <SettingsPage />;
    return <ComingSoonPage page={activePage} />;
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-canvas">
      <TransferModal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} />

      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        onOpenTransfer={actions.openTransfer}
      />

      <div className="flex-1 flex flex-col z-10 relative h-full min-w-0">
        <TopBar onNavigate={(page) => setActivePage(page as AppPage)} />

        <main className="flex-1 overflow-y-auto px-4 md:px-8 pt-2 pb-24 md:pb-10 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div key={activePage} {...PAGE_TRANSITION} className="h-full">
              {renderPageContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <MobileBottomNav
        activePage={activePage}
        onNavigate={setActivePage}
        onOpenTransfer={actions.openTransfer}
      />
    </div>
  );
}
