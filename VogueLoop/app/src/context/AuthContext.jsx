import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('vogueloop_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [mode, setModeState] = useState(() => {
    const savedMode = localStorage.getItem('vogueloop_mode');
    if (savedMode === 'lender' || savedMode === 'renter') return savedMode;
    const savedUser = localStorage.getItem('vogueloop_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        return u.role === 'lender' ? 'lender' : 'renter';
      } catch (e) {}
    }
    return 'renter';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('vogueloop_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('vogueloop_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('vogueloop_mode', mode);
  }, [mode]);

  const login = (userData) => {
    setUser(userData);
    if (userData.role === 'lender') {
      setModeState('lender');
    }
  };

  const signup = (userData) => {
    setUser(userData);
    if (userData.role === 'lender') {
      setModeState('lender');
    }
  };

  const logout = () => {
    setUser(null);
  };

  const setMode = (newMode) => {
    if (newMode === 'renter' || newMode === 'lender') {
      setModeState(newMode);
      if (user) {
        setUser(prev => prev ? { ...prev, role: newMode === 'lender' ? 'lender' : 'customer' } : null);
      }
    }
  };

  const toggleMode = () => {
    const nextMode = mode === 'lender' ? 'renter' : 'lender';
    setMode(nextMode);
    return nextMode;
  };

  const switchRole = (role) => {
    if (role === 'customer' || role === 'renter') {
      setMode('renter');
    } else if (role === 'lender') {
      setMode('lender');
    }
  };

  const isLender = () => {
    return mode === 'lender' || user?.role === 'lender';
  };

  const isCustomer = () => {
    return mode === 'renter' || user?.role === 'customer';
  };

  // Safe user profile with demo fallback for dashboard exploration
  const effectiveUser = user || {
    id: 101,
    name: 'Aanya Sharma',
    email: 'aanya.s@campus.edu',
    role: mode === 'lender' ? 'lender' : 'customer',
    studentVerified: true,
    campus: 'Campus Community Hub',
  };

  const value = {
    user: effectiveUser,
    realUser: user,
    isAuthenticated: !!user,
    mode,
    setMode,
    toggleMode,
    login,
    signup,
    logout,
    switchRole,
    isLender,
    isCustomer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
