import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/issue';
import { authService, LoginCredentials, RegisterData } from '../services/authService';

export const SYSTEM_USERS: User[] = [
  {
    id: 1,
    fullName: 'Kasun Perera',
    email: 'kasun.citizen@gramafix.lk',
    role: 'CITIZEN',
    communityArea: 'Matale Town',
  },
  {
    id: 2,
    fullName: 'Eng. Bandara',
    email: 'officer.bandara@gramafix.lk',
    role: 'OFFICER',
    communityArea: 'Matale Municipal Council',
  },
  {
    id: 3,
    fullName: 'Dr. Priyantha',
    email: 'admin.priyantha@gramafix.lk',
    role: 'ADMIN',
    communityArea: 'Central Administration',
  },
];

interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

interface AuthContextType {
  currentUser: User;
  role: UserRole;
  isAuthenticated: boolean;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  register: (data: RegisterData) => Promise<AuthResult>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('gramafix_user');
      return saved ? JSON.parse(saved) : SYSTEM_USERS[0];
    } catch {
      return SYSTEM_USERS[0];
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('gramafix_token') || 'demo_token';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('gramafix_auth') === 'true';
  });

  useEffect(() => {
    try {
      localStorage.setItem('gramafix_user', JSON.stringify(currentUser));
      if (token) {
        localStorage.setItem('gramafix_token', token);
      }
      localStorage.setItem('gramafix_auth', String(isAuthenticated));
    } catch (e) {
      console.warn('Failed to persist user to localStorage', e);
    }
  }, [currentUser, token, isAuthenticated]);

  /**
   * Authenticate with email and password
   */
  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    try {
      const res = await authService.login(credentials);
      if (res.data) {
        setCurrentUser(res.data);
        setToken(res.token);
        setIsAuthenticated(true);
        return { success: true, user: res.data };
      }
      return { success: false, error: res.message || 'Login failed.' };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Unable to sign in. Please verify credentials.';
      return { success: false, error: msg };
    }
  };

  /**
   * Register a new user account
   */
  const register = async (data: RegisterData): Promise<AuthResult> => {
    try {
      const res = await authService.register(data);
      if (res.data) {
        setCurrentUser(res.data);
        setToken(res.token);
        setIsAuthenticated(true);
        return { success: true, user: res.data };
      }
      return { success: false, error: res.message || 'Registration failed.' };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Unable to create account. Please try again.';
      return { success: false, error: msg };
    }
  };

  /**
   * Sign out current user
   */
  const logout = () => {
    localStorage.removeItem('gramafix_token');
    localStorage.setItem('gramafix_auth', 'false');
    setIsAuthenticated(false);
    // Reset to default resident for seamless browsing
    setCurrentUser(SYSTEM_USERS[0]);
  };

  /**
   * Switch active persona for hackathon judges & evaluators
   */
  const switchRole = (newRole: UserRole) => {
    const normalizedRole = newRole === 'RESIDENT' ? 'CITIZEN' : newRole;
    const targetUser = SYSTEM_USERS.find(
      (u) => u.role === normalizedRole || (normalizedRole === 'CITIZEN' && u.role === 'RESIDENT')
    ) || SYSTEM_USERS[0];
    setCurrentUser(targetUser);
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser.role,
        isAuthenticated,
        token,
        login,
        register,
        logout,
        switchRole,
        setUser: (user: User) => {
          setCurrentUser(user);
          setIsAuthenticated(true);
        },
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
