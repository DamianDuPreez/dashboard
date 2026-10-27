import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { WalletProvider } from './context/WalletContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { OverviewPage } from './components/pages/OverviewPage';
import { LoginScreen } from './components/auth/LoginScreen';

function AppInner() {
  const { isLoggedIn } = useAuth();

  return (
    <AnimatePresence mode="wait">
      {isLoggedIn ? (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="h-screen"
        >
          <WalletProvider>
            <DashboardLayout>
              {(actions) => <OverviewPage {...actions} />}
            </DashboardLayout>
          </WalletProvider>
        </motion.div>
      ) : (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.35 }}
          className="h-screen"
        >
          <LoginScreen />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <AppInner />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
