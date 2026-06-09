import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useWallet } from '@/context/WalletContext';
import { useNotification } from '@/context/NotificationContext';
import { cn } from '@/lib/utils';
import { X, Plus, CreditCard } from 'lucide-react';

interface LinkCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LinkCardModal({ isOpen, onClose }: LinkCardModalProps) {
  const { palette } = useTheme();
  const { addWallet } = useWallet();
  const { addNotification } = useNotification();
  
  const [name, setName] = useState('');
  const [type, setType] = useState<'debit' | 'credit'>('debit');
  const [brand, setBrand] = useState<'visa' | 'mastercard'>('visa');
  const [balance, setBalance] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setType('debit');
      setBrand('visa');
      setBalance('');
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!name || !balance) return;
    const numBalance = parseFloat(balance);
    if (isNaN(numBalance)) return;

    addWallet(name, type, brand, numBalance);
    
    addNotification({
      icon: '💳',
      title: 'Card Linked',
      body: `${name} has been successfully linked to your account.`,
      details: `Account Name: ${name}\nNetwork: ${brand.toUpperCase()}\nType: ${type.toUpperCase()}`
    });
    
    onClose();
  };

  const inputClass = "w-full pl-3 pr-4 py-3 rounded-xl text-sm border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all font-medium";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm bg-white rounded-[24px] shadow-2xl overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <CreditCard size={18} className="text-slate-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Link New Card</h2>
                  <p className="text-xs font-semibold text-slate-500">Add an external account</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Account Title</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Travel Rewards"
                  className={inputClass}
                  style={{ '--tw-ring-color': palette.primary } as React.CSSProperties}
                  maxLength={20}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Network</label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value as 'visa' | 'mastercard')}
                    className={inputClass}
                    style={{ '--tw-ring-color': palette.primary } as React.CSSProperties}
                  >
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'debit' | 'credit')}
                    className={inputClass}
                    style={{ '--tw-ring-color': palette.primary } as React.CSSProperties}
                  >
                    <option value="debit">Debit</option>
                    <option value="credit">Credit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Initial Balance</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <input
                    type="number"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    placeholder="0.00"
                    className={cn(inputClass, 'pl-8')}
                    style={{ '--tw-ring-color': palette.primary } as React.CSSProperties}
                  />
                </div>
              </div>

              <button
                disabled={!name || !balance}
                onClick={handleSave}
                className="w-full mt-4 py-3 rounded-xl font-semibold text-white text-sm shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: palette.primary }}
              >
                <Plus size={16} /> Add Card
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
