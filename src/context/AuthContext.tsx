import { createContext, useContext, useState, useEffect, type ReactNode, type FC } from 'react';

export const AVATAR_PRESETS = [
  { id: 'violet',  bg: '#7c3aed', label: 'Violet'  },
  { id: 'sky',     bg: '#0284c7', label: 'Sky'      },
  { id: 'emerald', bg: '#059669', label: 'Emerald'  },
  { id: 'rose',    bg: '#e11d48', label: 'Rose'     },
  { id: 'amber',   bg: '#d97706', label: 'Amber'    },
  { id: 'slate',   bg: '#475569', label: 'Slate'    },
  { id: 'indigo',  bg: '#4f46e5', label: 'Indigo'   },
  { id: 'teal',    bg: '#0d9488', label: 'Teal'     },
];

interface AuthContextType {
  isLoggedIn: boolean;
  displayName: string;
  email: string;
  avatarColor: string;
  login: (name: string, email: string) => void;
  logout: () => void;
  updateProfile: (name: string, email: string, avatarColor: string) => void;
}

const DEMO_NAME  = 'Brand OS User';
const DEMO_EMAIL = 'demo@branding.os';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('brand_os_auth');
    return saved ? JSON.parse(saved).isLoggedIn : false;
  });
  
  const [displayName, setDisplayName] = useState(() => {
    const saved = localStorage.getItem('brand_os_auth');
    return saved ? JSON.parse(saved).displayName : DEMO_NAME;
  });
  
  const [email, setEmail] = useState(() => {
    const saved = localStorage.getItem('brand_os_auth');
    return saved ? JSON.parse(saved).email : DEMO_EMAIL;
  });
  
  const [avatarColor, setAvatarColor] = useState(() => {
    const saved = localStorage.getItem('brand_os_auth');
    return saved ? JSON.parse(saved).avatarColor : AVATAR_PRESETS[0].bg;
  });

  useEffect(() => {
    localStorage.setItem('brand_os_auth', JSON.stringify({
      isLoggedIn,
      displayName,
      email,
      avatarColor
    }));
  }, [isLoggedIn, displayName, email, avatarColor]);

  const login = (name: string, mail: string) => {
    setDisplayName(name || DEMO_NAME);
    setEmail(mail || DEMO_EMAIL);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('brand_os_auth');
  };

  const updateProfile = (name: string, mail: string, color: string) => {
    setDisplayName(name || DEMO_NAME);
    setEmail(mail || DEMO_EMAIL);
    setAvatarColor(color);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, displayName, email, avatarColor, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export { DEMO_NAME, DEMO_EMAIL };
