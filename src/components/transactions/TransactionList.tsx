import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Hash, CreditCard, Download, Flag, ChevronDown, X } from 'lucide-react';
import { format } from 'date-fns';
import { useTheme } from '@/context/ThemeContext';
import { useWallet } from '@/context/WalletContext';
import type { Transaction, TransactionStatus } from '@/context/WalletContext';
import { cn, hexToRgb } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';

const MERCHANT_LOCATIONS: Record<string, string> = {
  'Apple Store':      'Fifth Ave, New York, NY 10011',
  'Starbucks':        'Mission St, San Francisco, CA 94105',
  'Uber':             'In-app — no fixed location',
  'Client Payment':   'Remote — Wire Transfer',
  'Interest Yield':   'Brand OS Financial Services',
  'Auto Deposit':     'Automated — Scheduled Transfer',
  'AWS Services':     'Amazon HQ, Seattle, WA 98109',
  'Delta Airlines':   'Hartsfield-Jackson, Atlanta, GA',
  'Google Workspace': 'Alphabet Inc., Mountain View, CA',
  'WeWork':           '85 Broad St, New York, NY 10004',
};

export function TransactionList() {
  const { activeTransactions, isLoading } = useWallet();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredTransactions = useMemo(() =>
    activeTransactions.filter(t =>
      t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  [activeTransactions, searchTerm]);

  useMemo(() => { setExpandedId(null); }, [activeTransactions]);

  const handleToggle = (id: string) => setExpandedId(prev => prev === id ? null : id);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[11px] font-bold tracking-widest uppercase text-slate-400">Recent Transactions</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-xl text-sm border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        <div className="flex flex-col gap-2">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div>
                    <Skeleton className="w-32 h-4 mb-2" />
                    <Skeleton className="w-20 h-3" />
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <Skeleton className="w-20 h-4" />
                  <Skeleton className="w-16 h-5 rounded-full" />
                </div>
              </div>
            ))
          ) : (
            <>
              <AnimatePresence initial={false}>
                {filteredTransactions.map(tx => (
                  <TransactionRow
                    key={tx.id}
                    transaction={tx}
                    isExpanded={expandedId === tx.id}
                    onToggle={() => handleToggle(tx.id)}
                  />
                ))}
              </AnimatePresence>
              {filteredTransactions.length === 0 && (
                <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
                  No transactions found.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TransactionRow — always-light colours, accent tints from theme
// ─────────────────────────────────────────────────────────────
export function TransactionRow({ transaction: tx, isExpanded, onToggle }: {
  transaction: Transaction;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { palette }  = useTheme();
  const { wallets }  = useWallet();

  const isPositive       = tx.amount > 0;
  const formattedAmount  = `${isPositive ? '+' : '-'}$${Math.abs(tx.amount).toFixed(2)}`;
  const accentRgb        = hexToRgb(palette.primary);

  const ownerWallet  = wallets.find(w => w.id === tx.walletId);
  const paymentMethodNode = ownerWallet
    ? <span className="text-slate-800">{ownerWallet.brand.charAt(0).toUpperCase() + ownerWallet.brand.slice(1)} {ownerWallet.cardNumber}</span>
    : <span className="text-slate-400 italic">{tx.walletName || 'Unknown (Archived)'}</span>;

  const txId    = `TXN-${tx.id.toUpperCase().padStart(8, '0')}`;
  const location = MERCHANT_LOCATIONS[tx.merchant] ?? 'Location unavailable';

  const getStatusColor = (status: TransactionStatus) => {
    if (status === 'Pending')   return {
      bg:     `rgba(${accentRgb}, 0.1)`,
      text:   palette.primary,
      border: `rgba(${accentRgb}, 0.25)`,
    };
    if (status === 'Completed') return {
      bg:     'rgba(16,185,129,0.1)',
      text:   '#059669',
      border: 'rgba(16,185,129,0.25)',
    };
    return {
      bg:     'rgba(244,63,94,0.1)',
      text:   '#e11d48',
      border: 'rgba(244,63,94,0.25)',
    };
  };
  const sc = getStatusColor(tx.status);

  // Stagger variants for expanded panel
  const detailContainer = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.06 } },
    exit:    { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
  };
  const detailItem = {
    hidden:  { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] as const } },
    exit:    { opacity: 0, y: 4, transition: { duration: 0.15 } },
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, scale: 0.95, height: 0 }}
      onClick={onToggle}
      className={cn(
        'rounded-2xl border cursor-pointer overflow-hidden transition-all',
        isExpanded ? 'border-slate-200 shadow-md bg-slate-50/80' : 'border-slate-100 bg-white hover:bg-slate-50/60 hover:border-slate-200'
      )}
      transition={{ 
        layout: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
        opacity: { duration: 0.25 },
        y: { type: 'spring', stiffness: 400, damping: 25 },
        height: { duration: 0.3 }
      }}
    >
      {/* ── Summary row ── */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `rgba(${accentRgb}, 0.08)`, color: palette.primary }}
          >
            <tx.icon size={17} />
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-sm">{tx.merchant}</p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
              <span>{tx.category}</span>
              <span>·</span>
              <span>{format(tx.date, 'MMM d, h:mm a')}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3">
            <div
              className="px-2.5 py-1 text-xs font-semibold rounded-full border"
              style={{ backgroundColor: sc.bg, color: sc.text, borderColor: sc.border }}
            >
              {tx.status}
            </div>
            <div className={cn(
              'font-bold text-right text-sm min-w-[72px]',
              isPositive ? 'text-emerald-600' : 'text-slate-800'
            )}>
              {formattedAmount}
            </div>
          </div>
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.22 }}>
            <ChevronDown size={16} className="text-slate-400" />
          </motion.div>
        </div>
      </div>

      {/* ── Expanded panel ── */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="expanded"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={detailContainer}
            onClick={(e) => e.stopPropagation()}
            className="px-4 pb-4"
          >
            {/* Divider */}
            <motion.div variants={detailItem} className="w-full h-px bg-slate-100 mb-4" />

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {/* Map placeholder */}
              <motion.div
                variants={detailItem}
                className="sm:col-span-2 rounded-xl overflow-hidden relative h-[96px] bg-slate-100 border border-slate-200"
              >
                <svg className="absolute inset-0 w-full h-full text-slate-300" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id={`grid-${tx.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#grid-${tx.id})`} />
                  <line x1="0" y1="38" x2="100%" y2="52" stroke="currentColor" strokeWidth="2.5" />
                  <line x1="28%" y1="0" x2="48%" y2="100%" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="62%" y1="0" x2="78%" y2="100%" stroke="currentColor" strokeWidth="1" />
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shadow"
                    style={{ backgroundColor: palette.primary }}
                  >
                    <MapPin size={12} className="text-white" />
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full mt-0.5" style={{ backgroundColor: palette.primary }} />
                </div>
                <div className="absolute bottom-2 left-3 right-3 text-[10px] font-medium text-slate-500">{location}</div>
              </motion.div>

              {/* Meta cards */}
              <motion.div variants={detailItem} className="flex flex-col gap-2">
                <div className="rounded-xl p-3 bg-slate-50 border border-slate-100 flex flex-col gap-1 flex-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-slate-400">
                    <Hash size={9} /> Transaction ID
                  </div>
                  <p className="text-xs font-mono font-semibold text-slate-800">{txId}</p>
                </div>
                <div className="rounded-xl p-3 bg-slate-50 border border-slate-100 flex flex-col gap-1 flex-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-slate-400">
                    <CreditCard size={9} /> Payment Method
                  </div>
                  <p className="text-xs font-semibold">{paymentMethodNode}</p>
                </div>
              </motion.div>
            </div>

            {/* Mobile amount row */}
            <motion.div variants={detailItem} className="flex items-center justify-between sm:hidden mb-3">
              <div className="px-2.5 py-1 text-xs font-semibold rounded-full border"
                style={{ backgroundColor: sc.bg, color: sc.text, borderColor: sc.border }}>
                {tx.status}
              </div>
              <div className={cn('font-bold text-sm', isPositive ? 'text-emerald-600' : 'text-slate-800')}>
                {formattedAmount}
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div variants={detailItem} className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm transition-all"
                style={{ backgroundColor: palette.primary }}
              >
                <Download size={14} />
                <span className="hidden sm:inline">Download Receipt</span>
                <span className="sm:hidden">Receipt</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all"
              >
                <Flag size={14} />
                <span className="hidden sm:inline">Report Issue</span>
                <span className="sm:hidden">Report</span>
              </motion.button>

              <button
                onClick={(e) => { e.stopPropagation(); onToggle(); }}
                className="ml-auto p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                aria-label="Collapse"
              >
                <X size={14} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
