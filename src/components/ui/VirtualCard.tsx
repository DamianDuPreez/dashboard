import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import type { Wallet } from '@/context/WalletContext';
import { cn, formatMoney } from '@/lib/utils';
import { Snowflake, Wifi } from 'lucide-react';

interface VirtualCardProps {
  wallet: Wallet;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Physical-style payment card. Debit cards wear the live theme colour,
 * credit cards are always ink so the two read differently at a glance.
 */
export function VirtualCard({ wallet, isActive = true, onClick, className }: VirtualCardProps) {
  const { palette } = useTheme();

  const isCredit = wallet.type === 'credit';
  const base = isCredit ? '#1B1C22' : palette.primary;
  const [whole, cents] = formatMoney(wallet.balance).split('.');

  return (
    <motion.div
      onClick={onClick}
      whileHover={onClick ? { y: -3 } : undefined}
      whileTap={onClick ? { scale: 0.985 } : undefined}
      className={cn(
        'relative w-full aspect-[1.586] rounded-[20px] p-5 overflow-hidden text-white select-none transition-[background,opacity] duration-700',
        onClick && 'cursor-pointer',
        !isActive && 'opacity-60',
        className
      )}
      style={{
        background: `radial-gradient(120% 120% at 100% 0%, ${palette.secondary} 0%, transparent 55%), linear-gradient(140deg, ${base} 0%, #0d0e12 120%)`,
        boxShadow: '0 18px 40px -18px rgba(20,21,26,0.55), inset 0 1px 0 rgba(255,255,255,0.12)',
      }}
    >
      {/* Texture + guilloché rings */}
      <div className="grain absolute inset-0 opacity-[0.18] mix-blend-overlay pointer-events-none" />
      <svg className="absolute -right-16 -bottom-24 w-[320px] h-[320px] opacity-[0.14] pointer-events-none" viewBox="0 0 200 200" fill="none">
        {Array.from({ length: 9 }).map((_, i) => (
          <circle key={i} cx="100" cy="100" r={20 + i * 10} stroke="white" strokeWidth="0.6" />
        ))}
      </svg>

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[12px] font-medium text-white/70">{wallet.name}</p>
            <p className="font-display text-[34px] leading-none mt-2 tabular">
              {whole}<span className="text-white/50 text-[22px]">.{cents}</span>
            </p>
          </div>
          {wallet.isFrozen ? (
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider bg-white/15 rounded-full px-2 py-1">
              <Snowflake size={11} /> Frozen
            </span>
          ) : (
            <Wifi size={20} className="rotate-90 text-white/70" />
          )}
        </div>

        <div className="flex justify-between items-end">
          <div className="flex items-center gap-3">
            <CardChip />
            <span className="font-mono text-[13px] tracking-[0.18em] text-white/80">{wallet.cardNumber}</span>
          </div>
          <BrandMark brand={wallet.brand} />
        </div>
      </div>
    </motion.div>
  );
}

function CardChip() {
  return (
    <svg width="34" height="26" viewBox="0 0 34 26" fill="none" aria-hidden>
      <rect x="0.5" y="0.5" width="33" height="25" rx="5" fill="url(#chip)" stroke="rgba(255,255,255,0.35)" />
      <path d="M0 9h10m14 0h10M0 17h10m14 0h10M10 0v26m14-26v26M10 9c4 0 4 8 14 8" stroke="rgba(0,0,0,0.25)" strokeWidth="0.8" />
      <defs>
        <linearGradient id="chip" x1="0" y1="0" x2="34" y2="26">
          <stop stopColor="#E9D8A6" />
          <stop offset="1" stopColor="#B89B5E" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function BrandMark({ brand }: { brand: Wallet['brand'] }) {
  if (brand === 'mastercard') {
    return (
      <svg width="40" height="25" viewBox="0 0 40 25" aria-label="Mastercard">
        <circle cx="14" cy="12.5" r="11" fill="#EB001B" fillOpacity="0.9" />
        <circle cx="26" cy="12.5" r="11" fill="#F79E1B" fillOpacity="0.9" />
      </svg>
    );
  }
  return <span className="text-[20px] font-bold italic tracking-tight text-white/90">VISA</span>;
}
