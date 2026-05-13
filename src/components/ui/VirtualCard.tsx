import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import type { Wallet } from '@/context/WalletContext';
import { cn, hexToRgb } from '@/lib/utils';
import { CreditCard, Zap } from 'lucide-react';

interface VirtualCardProps {
  wallet: Wallet;
  isActive: boolean;
  onClick: () => void;
}

export function VirtualCard({ wallet, isActive, onClick }: VirtualCardProps) {
  const { palette } = useTheme();

  const isPositive = wallet.balance >= 0;
  const formattedBalance = `${isPositive ? '' : '-'}$${Math.abs(wallet.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  // Active card: rich coloured background using the theme primary
  // Inactive card: clean white with a subtle border
  const accentRgb = hexToRgb(palette.primary);

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative min-w-[300px] h-[180px] rounded-2xl p-5 cursor-pointer overflow-hidden border transition-all duration-300',
        isActive
          ? 'shadow-lg'
          : 'bg-white border-slate-200 shadow-sm opacity-80 hover:opacity-100 hover:shadow-md'
      )}
      style={isActive ? {
        background: `linear-gradient(135deg, ${palette.primary} 0%, rgba(${accentRgb},0.85) 100%)`,
        borderColor: palette.primary,
      } : undefined}
    >
      {/* Decorative glow on active card only */}
      {isActive && (
        <div
          className="absolute -top-8 -right-8 w-36 h-36 rounded-full blur-[40px] opacity-40 pointer-events-none"
          style={{ backgroundColor: palette.secondary }}
        />
      )}

      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Top row */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className={cn('font-medium text-sm', isActive ? 'text-white/80' : 'text-slate-500')}>
              {wallet.name}
            </h3>
            <p className={cn('text-2xl font-bold mt-1 tracking-tight', isActive ? 'text-white' : 'text-slate-900')}>
              {formattedBalance}
            </p>
          </div>
          <div
            className="p-2 rounded-lg"
            style={isActive
              ? { backgroundColor: 'rgba(255,255,255,0.15)' }
              : { backgroundColor: `rgba(${accentRgb},0.1)` }
            }
          >
            <Zap size={18} style={{ color: isActive ? '#fff' : palette.primary }} />
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex justify-between items-end">
          <div className={cn('flex items-center gap-2 text-sm', isActive ? 'text-white/70' : 'text-slate-400')}>
            <CreditCard size={16} />
            <span className="font-mono tracking-wider text-xs">{wallet.cardNumber}</span>
          </div>
          <span className={cn('text-xs font-bold uppercase tracking-widest', isActive ? 'text-white/60' : 'text-slate-400')}>
            {wallet.brand}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
