import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, RotateCcw } from 'lucide-react';
import { useAuth, AVATAR_PRESETS, DEMO_NAME, DEMO_EMAIL } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useNotification } from '@/context/NotificationContext';
import { AvatarIcon } from '@/components/ui/AvatarIcon';
import { cn } from '@/lib/utils';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { palette }                                         = useTheme();
  const { displayName, email, avatarColor, updateProfile }  = useAuth();
  const { addNotification }                                 = useNotification();

  const [nameInput,  setNameInput]  = useState(displayName);
  const [emailInput, setEmailInput] = useState(email);
  const [colorInput, setColorInput] = useState(avatarColor);
  const [saved,      setSaved]      = useState(false);

  // Reset local state when modal opens
  const handleOpen = () => {
    setNameInput(displayName);
    setEmailInput(email);
    setColorInput(avatarColor);
    setSaved(false);
  };

  const handleSave = () => {
    const newName = nameInput.trim() || DEMO_NAME;
    const newEmail = emailInput.trim() || DEMO_EMAIL;
    
    const changes: string[] = [];
    if (newName !== displayName) changes.push(`Display Name: ${newName}`);
    if (newEmail !== email) changes.push(`Email: ${newEmail}`);
    if (colorInput !== avatarColor) changes.push(`Avatar Color Updated`);

    updateProfile(newName, newEmail, colorInput);
    
    if (changes.length > 0) {
      addNotification({
        icon: '👤',
        title: 'Profile Updated',
        body: 'Your profile details have been saved.',
        details: changes.join('\n'),
      });
    }

    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 900);
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium ' +
    'focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder-slate-400';

  if (!isOpen) return null;

  // Reset state on first render when opened
  void handleOpen; // called below via key prop reset trick

  return (
    <AnimatePresence onExitComplete={() => {}}>
      <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
        {/* Scrim */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-0.5">Account</p>
              <h2 className="text-base font-bold text-slate-900">Edit Profile</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X size={17} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Live avatar preview */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <AvatarIcon color={colorInput} size={80} />
                {/* Accent ring that follows theme */}
                <div
                  className="absolute inset-0 rounded-full ring-4 ring-offset-2 pointer-events-none"
                  style={{ '--tw-ring-color': palette.primary } as React.CSSProperties}
                />
              </div>
              <p className="text-xs text-slate-400 font-medium">Choose a profile colour</p>

              {/* Colour picker grid */}
              <div className="flex flex-wrap justify-center gap-2.5">
                {AVATAR_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => setColorInput(preset.bg)}
                    title={preset.label}
                    className={cn(
                      'w-8 h-8 rounded-full transition-all duration-150 ring-offset-2',
                      colorInput === preset.bg ? 'scale-110 ring-2' : 'hover:scale-105 opacity-75 hover:opacity-100'
                    )}
                    style={{
                      backgroundColor: preset.bg,
                      '--tw-ring-color': preset.bg,
                    } as React.CSSProperties}
                  >
                    {colorInput === preset.bg && (
                      <Check size={14} className="text-white mx-auto" strokeWidth={3} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-4">
              {/* Display Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Display Name
                </label>
                <div className="flex gap-2">
                  <input
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    placeholder="Your name"
                    className={cn(inputClass, 'flex-1')}
                    style={{ '--tw-ring-color': palette.primary } as React.CSSProperties}
                  />
                  {nameInput !== DEMO_NAME && (
                    <button
                      onClick={() => setNameInput(DEMO_NAME)}
                      title="Reset to demo name"
                      className="px-3 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <RotateCcw size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                    placeholder="you@example.com"
                    className={cn(inputClass, 'flex-1')}
                    style={{ '--tw-ring-color': palette.primary } as React.CSSProperties}
                  />
                  {emailInput !== DEMO_EMAIL && (
                    <button
                      onClick={() => setEmailInput(DEMO_EMAIL)}
                      title="Reset to demo email"
                      className="px-3 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <RotateCcw size={14} />
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  This is a demo — changes won't affect login.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
                style={{ backgroundColor: saved ? '#059669' : palette.primary }}
              >
                <AnimatePresence mode="wait">
                  {saved ? (
                    <motion.span
                      key="saved"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-1.5"
                    >
                      <Check size={15} strokeWidth={3} /> Saved!
                    </motion.span>
                  ) : (
                    <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      Save Changes
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
