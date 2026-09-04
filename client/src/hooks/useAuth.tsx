import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/issue';
import { MOCK_USERS } from '../data/mockIssues';

interface AuthContextType {
  currentUser: User;
  role: UserRole;
  switchRole: (newRole: UserRole) => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('gramafix_user');
      return saved ? JSON.parse(saved) : MOCK_USERS[0];
    } catch {
      return MOCK_USERS[0];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('gramafix_user', JSON.stringify(currentUser));
    } catch (e) {
      console.warn('Failed to persist user to localStorage', e);
    }
  }, [currentUser]);

  const switchRole = (newRole: UserRole) => {
    const targetUser = MOCK_USERS.find((u) => u.role === newRole) || MOCK_USERS[0];
    setCurrentUser(targetUser);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser.role,
        switchRole,
        setUser: setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
