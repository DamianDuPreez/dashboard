import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useWallet } from '@/context/WalletContext';
import type { Wallet } from '@/context/WalletContext';
import { cn } from '@/lib/utils';
import { Lock, Unlock, CreditCard, Plus, Trash2 } from 'lucide-react';
import { LinkCardModal } from '@/components/modals/LinkCardModal';
import { useState } from 'react';

export function WalletsPage() {
  const { palette } = useTheme();
  const { wallets, toggleWalletFreeze, deleteWallet } = useWallet();
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto">
      <LinkCardModal isOpen={isLinkModalOpen} onClose={() => setIsLinkModalOpen(false)} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Your Wallets</h1>
        <p className="text-sm text-slate-500">Manage your connected accounts and cards.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        <AnimatePresence>
          {wallets.map((wallet, index) => (
            <motion.div
              key={wallet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col gap-4"
            >
              <WalletCard wallet={wallet} />
              
              {/* Controls Row */}
              <div className="flex items-center justify-between px-2">
                {/* Freeze Toggle */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleWalletFreeze(wallet.id)}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
                      wallet.isFrozen ? "bg-rose-500 focus:ring-rose-500" : "bg-slate-200 focus:ring-slate-400"
                    )}
                    style={!wallet.isFrozen ? { backgroundColor: palette.primary } : undefined}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm",
                        wallet.isFrozen ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    {wallet.isFrozen ? (
                      <Lock size={14} className="text-rose-500" />
                    ) : (
                      <Unlock size={14} className="text-emerald-500" />
                    )}
                    <span className="text-xs uppercase tracking-widest">{wallet.isFrozen ? 'Frozen' : 'Active'}</span>
                  </div>
                </div>

                {/* Delete Button */}
                {wallet.id !== 'w1' && (
                  <button
                    onClick={() => deleteWallet(wallet.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove Card"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}

          {/* Link New Card Slot */}
          <motion.div
            key="link-new"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: wallets.length * 0.1, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <button
              onClick={() => setIsLinkModalOpen(true)}
              className="w-full h-56 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col items-center justify-center gap-4 group"
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-transform group-hover:scale-110 shadow-sm"
                style={{ backgroundColor: palette.primary }}
              >
                <Plus size={24} strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-600">Link New Card</span>
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function WalletCard({ wallet }: { wallet: Wallet }) {
  const isFrozen = wallet.isFrozen;
  
  // Choose gradients based on wallet brand/type to make them unique
  const gradient = wallet.type === 'credit' 
    ? 'from-slate-900 via-slate-800 to-slate-900' // Dark charcoal for credit
    : wallet.brand === 'mastercard'
    ? 'from-[#0f172a] via-[#1e293b] to-[#0f172a]' // Navy for savings
    : 'from-zinc-900 via-zinc-800 to-zinc-900'; // Deep zinc for primary

  return (
    <div className="relative group">
      {/* Glow effect */}
      <div className={cn(
        "absolute -inset-0.5 rounded-2xl blur-lg opacity-40 transition duration-1000 group-hover:opacity-60",
        wallet.type === 'credit' ? "bg-slate-400" : "bg-blue-400",
        isFrozen && "opacity-0 group-hover:opacity-0"
      )} />

      {/* Actual Card */}
      <div 
        className={cn(
          "relative h-56 rounded-2xl p-6 flex flex-col justify-between overflow-hidden transition-all duration-500 shadow-xl border border-white/10",
          "bg-gradient-to-br", gradient,
          isFrozen ? "grayscale-[0.8] opacity-80" : "hover:scale-[1.02]"
        )}
      >
        {/* Glassmorphic Sheen Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
        <div className="absolute -inset-x-[200%] -top-[100%] h-[300%] w-[150%] bg-gradient-to-r from-transparent via-white/10 to-transparent -rotate-45 translate-x-[200%] group-hover:translate-x-[-100%] transition-transform duration-1000 pointer-events-none" />

        {/* Top row */}
        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className="text-white/60 text-xs font-semibold tracking-widest uppercase mb-1">{wallet.name}</p>
            <p className="text-white text-2xl font-bold tracking-tight">
              {wallet.balance < 0 ? '-' : ''}${Math.abs(wallet.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-white/80">
            <CreditCard size={28} strokeWidth={1.5} />
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex justify-between items-end relative z-10">
          <div className="flex gap-4 text-white/70 font-mono text-sm tracking-widest">
            <span>••••</span>
            <span>••••</span>
            <span>••••</span>
            <span className="text-white">{wallet.cardNumber.slice(-4)}</span>
          </div>
          <div className="text-white/90 text-lg italic font-bold">
            {wallet.brand === 'visa' ? 'VISA' : 'mastercard'}
          </div>
        </div>

        {/* Frozen Overlay */}
        <AnimatePresence>
          {isFrozen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-20"
            >
              <div className="px-4 py-2 bg-black/60 rounded-full border border-white/20 flex items-center gap-2 backdrop-blur-md">
                <Lock size={14} className="text-white" />
                <span className="text-white text-xs font-bold uppercase tracking-widest">Frozen</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
