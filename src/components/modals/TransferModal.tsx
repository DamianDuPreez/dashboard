import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useWallet } from '@/context/WalletContext';
import { useNotification } from '@/context/NotificationContext';
import { cn } from '@/lib/utils';
import { X, ArrowRight, Loader2, Check } from 'lucide-react';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TransferModal({ isOpen, onClose }: TransferModalProps) {
  const { palette } = useTheme();
  const { wallets, activeWalletId, executeTransfer } = useWallet();
  const { addNotification } = useNotification();
  const [amount, setAmount] = useState('');
  const [sourceWalletId, setSourceWalletId] = useState('');
  const [targetWalletId, setTargetWalletId] = useState('');
  const [transferState, setTransferState] = useState<'idle' | 'processing' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) { 
      setTransferState('idle'); 
      setAmount(''); 
      setTargetWalletId(''); 
      setErrorMsg(''); 
      
      const activeW = wallets.find(w => w.id === activeWalletId);
      if (activeW && !activeW.isFrozen) {
        setSourceWalletId(activeWalletId);
      } else {
        const firstUnfrozen = wallets.find(w => !w.isFrozen);
        setSourceWalletId(firstUnfrozen ? firstUnfrozen.id : '');
      }
    }
  }, [isOpen, activeWalletId, wallets]);

  const handleTransfer = () => {
    if (!amount || !targetWalletId || !sourceWalletId) return;
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg('Please enter a valid amount.');
      return;
    }
    if (numAmount > 50000) {
      setErrorMsg('Demo limits restrict transfers to $50,000 maximum.');
      return;
    }

    setErrorMsg('');
    setTransferState('processing');
    
    setTimeout(() => {
      setTransferState('success');
      
      const sourceWallet = wallets.find(w => w.id === sourceWalletId);
      const destWallet = wallets.find(w => w.id === targetWalletId);
      
      executeTransfer(sourceWalletId, targetWalletId, numAmount);

      addNotification({
        icon: '💸',
        title: 'Transfer Complete',
        body: `Your $${numAmount.toFixed(2)} transfer to ${destWallet?.name || 'Wallet'} is done.`,
        details: `Transfer ID: TRX-${Math.random().toString(36).substring(2, 8).toUpperCase()}\nFrom: ${sourceWallet?.name}\nTo: ${destWallet?.name}\nAmount: $${numAmount.toFixed(2)}\nStatus: Completed`,
      });

      setTimeout(onClose, 1000);
    }, 1500);
  };

  if (!isOpen) return null;

  // Always white modal — clean professional look
  const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all appearance-none';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Scrim */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/25 backdrop-blur-sm"
          onClick={transferState === 'processing' ? undefined : onClose}
        />

        {/* Modal card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={
            transferState === 'success'
              ? { opacity: 1, scale: [1, 1.04, 1], y: 0, transition: { type: 'spring', stiffness: 400, damping: 10 } }
              : { opacity: 1, scale: 1, y: 0 }
          }
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl z-10 overflow-hidden"
        >
          {/* Close button */}
          {transferState === 'idle' && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>
          )}

          <AnimatePresence mode="wait">
            {transferState === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-14 px-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.08, stiffness: 300, damping: 18 }}
                  className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mb-5"
                >
                  <Check size={32} className="text-emerald-500" strokeWidth={2.5} />
                </motion.div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Transfer Complete</h2>
                <p className="text-sm text-slate-500 text-center">Your funds have been moved successfully.</p>
              </motion.div>
            ) : (
              <motion.div key="form" exit={{ opacity: 0, y: -12 }} className="p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-5">Quick Transfer</h2>

                <div className="space-y-4">
                  {/* From */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">From</label>
                    <select
                      disabled={transferState === 'processing'}
                      value={sourceWalletId}
                      onChange={(e) => setSourceWalletId(e.target.value)}
                      className={cn(inputClass, 'disabled:opacity-60')}
                      style={{ '--tw-ring-color': palette.primary } as React.CSSProperties}
                    >
                      {wallets.map(w => (
                        <option key={w.id} value={w.id} disabled={w.isFrozen}>
                          {w.name} (···{w.cardNumber.slice(-4)}) {w.isFrozen ? '(Frozen)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center">
                    <div className="p-1.5 rounded-full border border-slate-200 bg-slate-50">
                      <ArrowRight size={14} className="rotate-90 text-slate-400" />
                    </div>
                  </div>

                  {/* To */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">To</label>
                    <select
                      disabled={transferState === 'processing'}
                      value={targetWalletId}
                      onChange={(e) => setTargetWalletId(e.target.value)}
                      className={cn(inputClass, 'disabled:opacity-60')}
                      style={{ '--tw-ring-color': palette.primary } as React.CSSProperties}
                    >
                      <option value="">Select recipient wallet…</option>
                      {wallets.filter(w => w.id !== sourceWalletId).map(w => (
                        <option key={`to-${w.id}`} value={w.id} disabled={w.isFrozen}>
                          {w.name} {w.isFrozen ? '(Frozen)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                      <input
                        type="number"
                        disabled={transferState === 'processing'}
                        value={amount}
                        onChange={(e) => { setAmount(e.target.value); setErrorMsg(''); }}
                        placeholder="0.00"
                        className={cn(inputClass, 'pl-8 text-lg font-bold disabled:opacity-60')}
                        style={{ '--tw-ring-color': palette.primary } as React.CSSProperties}
                      />
                    </div>
                    {errorMsg && (
                      <p className="mt-2 text-xs font-semibold text-rose-500">{errorMsg}</p>
                    )}
                  </div>

                  <button
                    disabled={!amount || !targetWalletId || !sourceWalletId || transferState === 'processing'}
                    onClick={handleTransfer}
                    className="w-full mt-2 py-3 rounded-xl font-semibold text-white text-sm shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ backgroundColor: palette.primary }}
                  >
                    {transferState === 'processing' ? (
                      <><Loader2 className="animate-spin" size={18} /> Processing…</>
                    ) : 'Confirm Transfer'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
