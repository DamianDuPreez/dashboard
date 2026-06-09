import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, LogOut, User, Settings, ChevronDown, Trash2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { AvatarIcon } from '@/components/ui/AvatarIcon';
import { ProfileModal } from '@/components/modals/ProfileModal';
import { cn } from '@/lib/utils';

type TopBarProps = { onNavigate: (page: string) => void };

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

      <header className="h-20 w-full flex items-center justify-between px-4 md:px-8 z-20 border-b border-slate-200 bg-white shrink-0">
        {/* Search */}
        <div className="relative w-48 md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-sm bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{ '--tw-ring-color': palette.primary } as React.CSSProperties}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={handleNotifOpen}
              className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <Bell size={19} />
              {unreadCount > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 w-[7px] h-[7px] rounded-full"
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
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <AvatarIcon color={avatarColor} size={32} />
              <span className="hidden md:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
                {displayName}
              </span>
              <ChevronDown
                size={14}
                className={cn('text-slate-400 transition-transform duration-200 hidden md:block', profileOpen && 'rotate-180')}
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
