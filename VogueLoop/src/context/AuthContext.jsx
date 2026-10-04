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

  useEffect(() => {
    if (user) {
      localStorage.setItem('vogueloop_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('vogueloop_user');
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
  };

  const signup = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role) => {
    if (user && (role === 'customer' || role === 'lender')) {
      setUser({ ...user, role });
    }
  };

  const isLender = () => {
    return user?.role === 'lender';
  };

  const isCustomer = () => {
    return user?.role === 'customer';
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    switchRole,
    isLender,
    isCustomer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
