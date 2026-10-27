import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, LogOut, User, Settings, ChevronDown, Trash2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { AvatarIcon } from '@/components/ui/AvatarIcon';
import { ProfileModal } from '@/components/modals/ProfileModal';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type TopBarProps = { onNavigate: (page: string) => void };

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export function TopBar({ onNavigate }: TopBarProps) {
  const { palette }                                        = useTheme();
  const { displayName, email, avatarColor, logout }        = useAuth();
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotification();

  const [notifOpen,    setNotifOpen]    = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [expandedId,   setExpandedId]   = useState<string | null>(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleNotifOpen   = () => { setNotifOpen(v => !v); setProfileOpen(false); setExpandedId(null); };
  const handleProfileOpen = () => { setProfileOpen(v => !v); setNotifOpen(false); };
  const handleLogout      = () => { logout(); setProfileOpen(false); };

  const openProfileModal  = () => { setProfileModal(true); setProfileOpen(false); };

  return (
    <>
      <ProfileModal isOpen={profileModal} onClose={() => setProfileModal(false)} />

      <header className="h-[76px] w-full flex items-center justify-between gap-4 px-4 md:px-8 z-20 bg-canvas shrink-0">
        {/* Greeting */}
        <div className="min-w-0">
          <p className="text-[12px] text-stone-500 tabular">{format(new Date(), 'EEEE, d MMMM')}</p>
          <h1 className="text-[17px] md:text-[19px] font-semibold tracking-tight text-ink truncate">
            {greeting()}, {displayName.split(' ')[0]}
          </h1>
        </div>

        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Search */}
          <div className="relative hidden sm:block w-56 lg:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={15} />
            <input
              type="text"
              placeholder="Search payments, people…"
              className="w-full border border-line rounded-full py-2 pl-9 pr-4 text-[13px] bg-white text-ink placeholder-stone-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              style={{ '--tw-ring-color': palette.primary } as React.CSSProperties}
            />
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={handleNotifOpen}
              aria-label="Notifications"
              className="relative w-10 h-10 flex items-center justify-center rounded-full border border-line bg-white text-stone-600 hover:text-ink transition-colors"
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span
                  className="absolute top-2 right-2.5 w-[7px] h-[7px] rounded-full ring-2 ring-white"
                  style={{ backgroundColor: palette.primary }}
                />
              )}
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  key="notif"
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.16 }}
                  className="absolute right-0 mt-1 w-80 rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-bold tracking-widest uppercase text-slate-400">Notifications</p>
                  </div>
                  <div className="max-h-[65vh] overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-slate-500">No notifications</div>
                    ) : (
                      <AnimatePresence>
                        {notifications.map(n => {
                          const isExpanded = expandedId === n.id;
                          return (
                            <motion.div
                              key={n.id}
                              layout
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className={cn(
                                'flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 transition-colors overflow-hidden',
                                n.unread && 'bg-slate-50/80'
                              )}
                              onClick={() => {
                                markAsRead(n.id);
                                setExpandedId(isExpanded ? null : n.id);
                              }}
                            >
                              <span className="text-lg mt-0.5 shrink-0">{n.icon}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between gap-2">
                                  <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                                  <span className="text-[10px] text-slate-400 shrink-0 mt-0.5">
                                    {n.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className={cn("text-xs text-slate-500 mt-0.5 leading-snug", !isExpanded && "truncate")}>{n.body}</p>
                                
                                <AnimatePresence>
                                  {isExpanded && n.details && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                      animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="p-3 bg-slate-100/50 rounded-lg text-[11px] text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                                        {n.details}
                                      </div>
                                      <div className="mt-3 flex justify-end">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            deleteNotification(n.id);
                                          }}
                                          className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                        >
                                          <Trash2 size={13} /> Delete
                                        </button>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="px-4 py-2.5 border-t border-slate-100 flex justify-center">
                      <button 
                        onClick={markAllAsRead}
                        className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        Mark all as read
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile button */}
          <div className="relative">
            <button
              onClick={handleProfileOpen}
              className="flex items-center gap-1.5 p-1 md:pr-2.5 rounded-full border border-line bg-white hover:border-stone-300 transition-colors"
            >
              <AvatarIcon color={avatarColor} size={30} />
              <ChevronDown
                size={14}
                className={cn('text-stone-400 transition-transform duration-200 hidden md:block', profileOpen && 'rotate-180')}
              />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.16 }}
                  className="absolute right-0 mt-1 w-64 rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden z-50"
                >
                  {/* User card header */}
                  <div className="px-4 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
                    <AvatarIcon color={avatarColor} size={44} />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{displayName}</p>
                      <p className="text-xs text-slate-400 truncate">{email}</p>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <button
                      onClick={openProfileModal}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      <User size={15} className="text-slate-400" />
                      Profile
                    </button>
                    <button
                      onClick={() => { onNavigate('settings'); setProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      <Settings size={15} className="text-slate-400" />
                      Settings
                    </button>
                  </div>

                  <div className="border-t border-slate-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Click-outside backdrop */}
        {(notifOpen || profileOpen) && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => { setNotifOpen(false); setProfileOpen(false); }}
          />
        )}
      </header>
    </>
  );
}
