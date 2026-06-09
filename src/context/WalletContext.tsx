import { createContext, useContext, useState, useMemo, type ReactNode, type FC } from 'react';
import { Monitor, Coffee, Car, ArrowRightLeft, Plane } from 'lucide-react';

export type TransactionStatus = 'Completed' | 'Pending' | 'Declined';

export interface Transaction {
  id: string;
  walletId: string;
  date: Date;
  merchant: string;
  category: string;
  amount: number;
  status: TransactionStatus;
  icon: React.ElementType;
}

export interface RevenuePoint {
  name: string;
  revenue: number;
  walletId: string;
}

export interface Wallet {
  id: string;
  name: string;
  balance: number;
  cardNumber: string;
  type: 'debit' | 'credit';
  brand: 'visa' | 'mastercard';
}

const INITIAL_WALLETS: Wallet[] = [
  { id: 'w1', name: 'Primary Account', balance: 124500.00, cardNumber: '**** 4242', type: 'debit', brand: 'visa' },
  { id: 'w2', name: 'Savings Vault', balance: 450000.00, cardNumber: '**** 8891', type: 'debit', brand: 'mastercard' },
  { id: 'w3', name: 'Business Credit', balance: -4500.00, cardNumber: '**** 1123', type: 'credit', brand: 'visa' },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  // Primary Account (w1)
  { id: 't1', walletId: 'w1', date: new Date(2026, 4, 11, 14, 30), merchant: 'Apple Store', category: 'Electronics', amount: -2499.00, status: 'Completed', icon: Monitor },
  { id: 't2', walletId: 'w1', date: new Date(2026, 4, 11, 9, 15), merchant: 'Starbucks', category: 'Food & Dining', amount: -6.50, status: 'Completed', icon: Coffee },
  { id: 't3', walletId: 'w1', date: new Date(2026, 4, 10, 18, 45), merchant: 'Uber', category: 'Transportation', amount: -24.00, status: 'Completed', icon: Car },
  { id: 't4', walletId: 'w1', date: new Date(2026, 4, 10, 12, 0), merchant: 'Client Payment', category: 'Income', amount: 4500.00, status: 'Pending', icon: ArrowRightLeft },
  // Savings Vault (w2)
  { id: 't5', walletId: 'w2', date: new Date(2026, 4, 9, 10, 0), merchant: 'Interest Yield', category: 'Income', amount: 350.00, status: 'Completed', icon: ArrowRightLeft },
  { id: 't6', walletId: 'w2', date: new Date(2026, 4, 1, 9, 0), merchant: 'Auto Deposit', category: 'Transfer', amount: 5000.00, status: 'Completed', icon: ArrowRightLeft },
  // Business Credit (w3)
  { id: 't7', walletId: 'w3', date: new Date(2026, 4, 9, 20, 10), merchant: 'AWS Services', category: 'Software', amount: -1234.90, status: 'Completed', icon: Monitor },
  { id: 't8', walletId: 'w3', date: new Date(2026, 4, 9, 15, 30), merchant: 'Delta Airlines', category: 'Travel', amount: -850.00, status: 'Declined', icon: Plane },
  { id: 't9', walletId: 'w3', date: new Date(2026, 4, 8, 8, 0), merchant: 'Google Workspace', category: 'Software', amount: -89.45, status: 'Completed', icon: Monitor },
  { id: 't10', walletId: 'w3', date: new Date(2026, 4, 7, 19, 20), merchant: 'WeWork', category: 'Real Estate', amount: -1500.00, status: 'Completed', icon: Monitor },
];

const INITIAL_REVENUE: RevenuePoint[] = [
  // Primary Account (w1)
  { walletId: 'w1', name: 'Jan', revenue: 4000 },
  { walletId: 'w1', name: 'Feb', revenue: 3000 },
  { walletId: 'w1', name: 'Mar', revenue: 5000 },
  { walletId: 'w1', name: 'Apr', revenue: 4500 },
  { walletId: 'w1', name: 'May', revenue: 6000 },
  { walletId: 'w1', name: 'Jun', revenue: 5500 },
  // Savings (w2) - steadily increasing
  { walletId: 'w2', name: 'Jan', revenue: 420000 },
  { walletId: 'w2', name: 'Feb', revenue: 425000 },
  { walletId: 'w2', name: 'Mar', revenue: 430000 },
  { walletId: 'w2', name: 'Apr', revenue: 435000 },
  { walletId: 'w2', name: 'May', revenue: 442000 },
  { walletId: 'w2', name: 'Jun', revenue: 450000 },
  // Business (w3) - variable
  { walletId: 'w3', name: 'Jan', revenue: -1000 },
  { walletId: 'w3', name: 'Feb', revenue: -2500 },
  { walletId: 'w3', name: 'Mar', revenue: 500 },
  { walletId: 'w3', name: 'Apr', revenue: -1500 },
  { walletId: 'w3', name: 'May', revenue: -3000 },
  { walletId: 'w3', name: 'Jun', revenue: -4500 },
];

interface WalletContextType {
  wallets: Wallet[];
  activeWalletId: string;
  setActiveWalletId: (id: string) => void;
  activeWallet: Wallet | undefined;
  activeTransactions: Transaction[];
  activeRevenue: RevenuePoint[];
  isLoading: boolean;
  executeTransfer: (sourceId: string, destId: string, amount: number) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [wallets, setWallets]           = useState<Wallet[]>(INITIAL_WALLETS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [revenues, setRevenues]         = useState<RevenuePoint[]>(INITIAL_REVENUE);

  const [activeWalletId, setActiveWalletIdState] = useState<string>(INITIAL_WALLETS[0].id);
  const [isLoading, setIsLoading] = useState(false);

  const setActiveWalletId = (id: string) => {
    if (id === activeWalletId) return;
    setIsLoading(true);
    setTimeout(() => {
      setActiveWalletIdState(id);
      setIsLoading(false);
    }, 800);
  };

  const executeTransfer = (sourceId: string, destId: string, amount: number) => {
    const sourceWallet = wallets.find(w => w.id === sourceId);
    const destWallet = wallets.find(w => w.id === destId);
    if (!sourceWallet || !destWallet) return;

    // 1. Update balances
    setWallets(prev => prev.map(w => {
      if (w.id === sourceId) return { ...w, balance: w.balance - amount };
      if (w.id === destId)   return { ...w, balance: w.balance + amount };
      return w;
    }));

    // 2. Inject transactions
    const txIdBase = Math.random().toString(36).substring(2, 9);
    const now = new Date();
    
    const sourceTx: Transaction = {
      id: `tx-out-${txIdBase}`,
      walletId: sourceId,
      date: now,
      merchant: destWallet.type === 'credit' ? `${destWallet.name} Payment` : destWallet.name,
      category: destWallet.type === 'credit' ? 'Payment' : 'Transfer',
      amount: -amount,
      status: 'Completed',
      icon: ArrowRightLeft,
    };

    const destTx: Transaction = {
      id: `tx-in-${txIdBase}`,
      walletId: destId,
      date: now,
      merchant: destWallet.type === 'credit' ? 'Payment Received' : sourceWallet.name,
      category: destWallet.type === 'credit' ? 'Payment' : 'Transfer',
      amount: amount, // Positive amount reduces the negative debt balance
      status: 'Completed',
      icon: ArrowRightLeft,
    };

    setTransactions(prev => [sourceTx, destTx, ...prev]);

    // 3. Update chart revenues
    setRevenues(prev => {
      const next = [...prev];
      // Update June for source
      for (let i = next.length - 1; i >= 0; i--) {
        if (next[i].walletId === sourceId) {
          next[i] = { ...next[i], revenue: next[i].revenue - amount };
          break;
        }
      }
      // Update June for dest
      for (let i = next.length - 1; i >= 0; i--) {
        if (next[i].walletId === destId) {
          next[i] = { ...next[i], revenue: next[i].revenue + amount };
          break;
        }
      }
      return next;
    });
  };

  const activeWallet = useMemo(() => wallets.find(w => w.id === activeWalletId), [wallets, activeWalletId]);
  
  const activeTransactions = useMemo(() => 
    transactions.filter(t => t.walletId === activeWalletId).sort((a, b) => b.date.getTime() - a.date.getTime()), 
  [transactions, activeWalletId]);

  const activeRevenue = useMemo(() => 
    revenues.filter(r => r.walletId === activeWalletId), 
  [revenues, activeWalletId]);

  return (
    <WalletContext.Provider value={{
      wallets,
      activeWalletId,
      setActiveWalletId,
      activeWallet,
      activeTransactions,
      activeRevenue,
      isLoading,
      executeTransfer
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within WalletProvider');
  return context;
};
