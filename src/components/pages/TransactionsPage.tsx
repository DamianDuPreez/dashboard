import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useWallet } from '@/context/WalletContext';
import { TransactionRow } from '@/components/transactions/TransactionList';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';


export function TransactionsPage() {
  const { palette } = useTheme();
  const { transactions, wallets, isLoading } = useWallet();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Accounts');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Derive dynamic filters from current global wallets
  const dynamicFilters = useMemo(() => ['All Accounts', ...wallets.map(w => w.name)], [wallets]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // Filter by text search
      const matchesSearch = 
        t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;

      // Filter by wallet
      if (activeFilter !== 'All Accounts') {
        const ownerWallet = wallets.find(w => w.id === t.walletId);
        if (ownerWallet?.name !== activeFilter) return false;
      }

      return true;
    });
  }, [transactions, searchTerm, activeFilter, wallets]);

  // Reset expanded id when data changes to prevent orphaned states
  useMemo(() => { setExpandedId(null); }, [transactions, activeFilter]);

  const handleToggle = (id: string) => setExpandedId(prev => prev === id ? null : id);

  // Compute summary stats
  const totalCount = filteredTransactions.length;
  const computedSum = filteredTransactions.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight">Transactions</h1>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          
          {/* Pills */}
          <div className="flex flex-wrap gap-2">
            {dynamicFilters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  'px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-sm border',
                  activeFilter === filter
                    ? 'text-white border-transparent'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                )}
                style={activeFilter === filter ? { backgroundColor: palette.primary } : {}}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search merchant or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 bg-white shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              style={{ '--tw-ring-color': palette.primary } as React.CSSProperties}
            />
          </div>
        </div>
      </div>

      {/* Summary Stats Row */}
      <div className="flex justify-between items-center bg-white border border-slate-100 rounded-2xl p-4 mb-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Matched Records:</span>
          <span className="text-sm font-bold text-slate-700">{totalCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Net Sum:</span>
          <span className={cn(
            "text-sm font-bold",
            computedSum > 0 ? "text-emerald-500" : computedSum < 0 ? "text-rose-500" : "text-slate-700"
          )}>
            {computedSum > 0 ? '+' : ''}{computedSum < 0 ? '-' : ''}${Math.abs(computedSum).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Ledger */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        <div className="flex flex-col gap-2">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white">
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
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-24 text-slate-400"
                >
                  <Search size={32} className="mb-4 opacity-50" />
                  <p className="text-sm font-semibold">No transactions found.</p>
                  <p className="text-xs mt-1">Try adjusting your filters or search term.</p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
