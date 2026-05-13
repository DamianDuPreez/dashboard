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

const mockWallets: Wallet[] = [
  { id: 'w1', name: 'Primary Account', balance: 124500.00, cardNumber: '**** 4242', type: 'debit', brand: 'visa' },
  { id: 'w2', name: 'Savings Vault', balance: 450000.00, cardNumber: '**** 8891', type: 'debit', brand: 'mastercard' },
  { id: 'w3', name: 'Business Credit', balance: -4500.00, cardNumber: '**** 1123', type: 'credit', brand: 'visa' },
];

const mockTransactions: Transaction[] = [
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

const mockRevenue: RevenuePoint[] = [
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
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [activeWalletId, setActiveWalletIdState] = useState<string>(mockWallets[0].id);
  const [isLoading, setIsLoading] = useState(false);

  const setActiveWalletId = (id: string) => {
    if (id === activeWalletId) return;
    setIsLoading(true);
    setTimeout(() => {
      setActiveWalletIdState(id);
      setIsLoading(false);
    }, 800);
  };

  const activeWallet = useMemo(() => mockWallets.find(w => w.id === activeWalletId), [activeWalletId]);
  
  const activeTransactions = useMemo(() => 
    mockTransactions.filter(t => t.walletId === activeWalletId).sort((a, b) => b.date.getTime() - a.date.getTime()), 
  [activeWalletId]);

  const activeRevenue = useMemo(() => 
    mockRevenue.filter(r => r.walletId === activeWalletId), 
  [activeWalletId]);

  return (
    <WalletContext.Provider value={{
      wallets: mockWallets,
      activeWalletId,
      setActiveWalletId,
      activeWallet,
      activeTransactions,
      activeRevenue,
      isLoading
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
