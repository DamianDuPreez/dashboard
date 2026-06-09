import { motion } from 'framer-motion';
import { Home, PieChart, Wallet, Settings, Send, ArrowRightLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { AvatarIcon } from '@/components/ui/AvatarIcon';

export type AppPage = 'overview' | 'analytics' | 'transactions' | 'wallets' | 'settings';

const NAV_ITEMS: { id: AppPage; label: string; icon: React.ElementType }[] = [
  { id: 'overview',     label: 'Overview',     icon: Home },
  { id: 'analytics',    label: 'Analytics',    icon: PieChart },
  { id: 'transactions', label: 'Transactions', icon: ArrowRightLeft },
  { id: 'wallets',      label: 'Wallets',      icon: Wallet },
];

interface SidebarProps {
  activePage: AppPage;
  onNavigate: (page: AppPage) => void;
  onOpenTransfer: () => void;
}

export function Sidebar({ activePage, onNavigate, onOpenTransfer }: SidebarProps) {
  const { palette }     = useTheme();
  const { displayName, avatarColor } = useAuth();

  return (
    <aside className="w-64 h-full hidden md:flex flex-col border-r border-slate-200 bg-white z-10">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 h-20 border-b border-slate-100 shrink-0">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm"
          style={{ backgroundColor: palette.primary }}
        >
          B
        </div>
        <span className="text-base font-bold tracking-tight text-slate-900">Brand OS</span>
      </div>

      {/* User info strip */}
      <div className="px-4 py-3 mx-3 mt-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
        <AvatarIcon color={avatarColor} size={32} />
        <div className="min-w-0">
          <p className="text-xs text-slate-400 font-medium leading-tight">Signed in as</p>
          <p className="text-sm font-semibold text-slate-900 truncate">{displayName}</p>
        </div>
      </div>

      <nav className="flex-1 px-3 mt-4 space-y-0.5">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <NavItem
            key={id}
            icon={<Icon size={17} />}
            label={label}
            active={activePage === id}
            onClick={() => onNavigate(id)}
            accentColor={palette.primary}
          />
        ))}
      </nav>

      <div className="px-3 pb-6 space-y-2">
        <button
          onClick={onOpenTransfer}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: palette.primary }}
        >
          <Send size={15} />
          Quick Transfer
        </button>
        <NavItem
          icon={<Settings size={17} />}
          label="Settings"
          active={activePage === 'settings'}
          onClick={() => onNavigate('settings')}
          accentColor={palette.primary}
        />
      </div>
    </aside>
  );
}

export function MobileBottomNav({ activePage, onNavigate, onOpenTransfer }: SidebarProps) {
  const { palette } = useTheme();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[60px] z-50 border-t border-slate-200 bg-white flex items-center justify-around px-2">
      {NAV_ITEMS.slice(0, 2).map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className="flex flex-col items-center gap-0.5 px-3 transition-opacity"
          style={{ opacity: activePage === id ? 1 : 0.45, color: activePage === id ? palette.primary : '#64748b' }}
        >
          <Icon size={20} />
          <span className="text-[10px] font-medium">{label}</span>
        </button>
      ))}

      {/* FAB */}
      <div className="relative -top-4">
        <button
          onClick={onOpenTransfer}
          className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg shadow-black/15 hover:scale-105 active:scale-95 transition-all"
          style={{ backgroundColor: palette.primary }}
        >
          <Send size={20} />
        </button>
      </div>

      {NAV_ITEMS.slice(2, 4).map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className="flex flex-col items-center gap-0.5 px-3 transition-opacity"
          style={{ opacity: activePage === id ? 1 : 0.45, color: activePage === id ? palette.primary : '#64748b' }}
        >
          <Icon size={20} />
          <span className="text-[10px] font-medium">{label}</span>
        </button>
      ))}
    </nav>
  );
}

function NavItem({
  icon, label, active, onClick, accentColor,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  accentColor: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative text-left',
        active
          ? 'bg-slate-50 text-slate-900'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
      )}
    >
      {active && (
        <motion.div
          layoutId="active-nav-indicator"
          className="absolute left-0 top-0 bottom-0 my-auto w-[3px] h-[18px] rounded-r-full"
          style={{ backgroundColor: accentColor }}
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        />
      )}
      <span style={{ color: active ? accentColor : undefined }}>{icon}</span>
      {label}
    </button>
  );
}
