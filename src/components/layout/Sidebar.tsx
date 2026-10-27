import { motion } from 'framer-motion';
import { Home, PieChart, Wallet, Settings, Send, ArrowRightLeft, ArrowUpRight } from 'lucide-react';
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
  const { displayName, email, avatarColor } = useAuth();

  return (
    <aside className="w-[248px] h-full hidden md:flex flex-col bg-canvas z-10 shrink-0 px-4 py-5">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-2 h-11 shrink-0">
        <div
          className="w-8 h-8 rounded-[10px] flex items-center justify-center text-white font-display text-xl leading-none shadow-sm"
          style={{ backgroundColor: palette.primary }}
        >
          b
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-ink">Brand OS</span>
      </div>

      <p className="px-3 mt-8 mb-2 text-[11px] font-medium text-stone-400">Menu</p>
      <nav className="space-y-0.5">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <NavItem
            key={id}
            icon={<Icon size={17} strokeWidth={1.9} />}
            label={label}
            active={activePage === id}
            onClick={() => onNavigate(id)}
            accentColor={palette.primary}
          />
        ))}
        <NavItem
          icon={<Settings size={17} strokeWidth={1.9} />}
          label="Settings"
          active={activePage === 'settings'}
          onClick={() => onNavigate('settings')}
          accentColor={palette.primary}
        />
      </nav>

      <div className="flex-1" />

      {/* Transfer prompt */}
      <div className="relative overflow-hidden rounded-2xl bg-ink p-4 text-white">
        <div
          className="pointer-events-none absolute -right-10 -top-10 w-32 h-32 rounded-full blur-2xl opacity-60 transition-colors duration-1000"
          style={{ backgroundColor: palette.primary }}
        />
        <div className="relative">
          <p className="font-display text-[22px] leading-[1.1]">Move money<br /><span className="italic text-white/60">in seconds.</span></p>
          <button
            onClick={onOpenTransfer}
            className="mt-4 w-full flex items-center justify-between gap-2 pl-3.5 pr-1.5 py-1.5 rounded-xl bg-white text-ink text-[13px] font-semibold transition-transform hover:-translate-y-px active:translate-y-0"
          >
            <span className="flex items-center gap-2"><Send size={14} /> Quick transfer</span>
            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: palette.primary }}>
              <ArrowUpRight size={14} />
            </span>
          </button>
        </div>
      </div>

      {/* Signed-in user */}
      <div className="mt-4 flex items-center gap-3 px-2 py-2">
        <AvatarIcon color={avatarColor} size={34} />
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-ink truncate">{displayName}</p>
          <p className="text-[11px] text-stone-500 truncate">{email}</p>
        </div>
      </div>
    </aside>
  );
}

export function MobileBottomNav({ activePage, onNavigate, onOpenTransfer }: SidebarProps) {
  const { palette } = useTheme();

  const renderItem = ({ id, label, icon: Icon }: typeof NAV_ITEMS[number]) => (
    <button
      key={id}
      onClick={() => onNavigate(id)}
      className={cn(
        'flex flex-col items-center gap-0.5 px-3 transition-colors',
        activePage === id ? 'text-ink' : 'text-stone-400'
      )}
    >
      <Icon size={20} strokeWidth={activePage === id ? 2.2 : 1.8} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );

  return (
    <nav className="md:hidden fixed bottom-3 left-3 right-3 h-[62px] z-50 rounded-2xl border border-line bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgba(20,21,26,0.08)] flex items-center justify-around px-2">
      {NAV_ITEMS.slice(0, 2).map(renderItem)}

      <button
        onClick={onOpenTransfer}
        aria-label="Quick transfer"
        className="w-12 h-12 -mt-7 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/20 ring-4 ring-canvas hover:scale-105 active:scale-95 transition-transform"
        style={{ backgroundColor: palette.primary }}
      >
        <Send size={19} />
      </button>

      {NAV_ITEMS.slice(2, 4).map(renderItem)}
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
        'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13.5px] font-medium transition-colors duration-150 relative text-left',
        active ? 'text-ink' : 'text-stone-500 hover:text-ink'
      )}
    >
      {active && (
        <motion.div
          layoutId="active-nav-indicator"
          className="absolute inset-0 rounded-xl bg-white border border-line shadow-[0_1px_2px_rgba(20,21,26,0.06)]"
          transition={{ type: 'spring', stiffness: 500, damping: 38 }}
        />
      )}
      <span className="relative" style={{ color: active ? accentColor : undefined }}>{icon}</span>
      <span className="relative">{label}</span>
    </button>
  );
}
