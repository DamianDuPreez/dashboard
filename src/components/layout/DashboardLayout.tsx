import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar, MobileBottomNav } from './Sidebar';
import type { AppPage } from './Sidebar';
import { TopBar } from './TopBar';
import { useTheme } from '@/context/ThemeContext';
import { TransferModal } from '../modals/TransferModal';
import { ComingSoonPage } from '../pages/ComingSoonPage';
import { SettingsPage } from '../pages/SettingsPage';

const PAGE_TRANSITION = {
  initial:    { opacity: 0, y: 12 },
  animate:    { opacity: 1, y: 0 },
  exit:       { opacity: 0, y: -8 },
  transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] as const },
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { palette } = useTheme();
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [activePage, setActivePage] = useState<AppPage>('overview');

  const renderPageContent = () => {
    if (activePage === 'overview')  return children;
    if (activePage === 'settings')  return <SettingsPage />;
    return <ComingSoonPage page={activePage} />;
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-[#F9FAFB]">
      <TransferModal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} />

      {/* Subtle static accent glow — replaces the heavy animated mesh */}
      <div
        className="pointer-events-none absolute top-0 right-0 w-[600px] h-[400px] rounded-full blur-[160px] opacity-[0.06] -translate-y-1/3 translate-x-1/3 transition-colors duration-1000"
        style={{ backgroundColor: palette.primary }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 w-[500px] h-[400px] rounded-full blur-[140px] opacity-[0.05] translate-y-1/3 -translate-x-1/3 transition-colors duration-1000"
        style={{ backgroundColor: palette.secondary }}
      />

      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        onOpenTransfer={() => setIsTransferOpen(true)}
      />

      <div className="flex-1 flex flex-col z-10 relative h-full min-w-0">
        <TopBar onNavigate={(page) => setActivePage(page as AppPage)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 custom-scrollbar">
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
        onOpenTransfer={() => setIsTransferOpen(true)}
      />
    </div>
  );
}
