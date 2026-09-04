import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { User, UserRole } from '../types/issue';
import { authService, AuthResponse, LoginCredentials, RegisterData } from '../services/authService';
import { errorMessage } from '../services/api';
interface AuthResult { success: boolean; user?: User; error?: string; }
interface AuthContextType {
  currentUser: User; role: UserRole; isAuthenticated: boolean; loading: boolean; token: string | null;
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  register: (data: RegisterData) => Promise<AuthResult>;
  logout: () => void; switchRole: (role: UserRole) => void;
}
const guest: User = { id: 0, fullName: 'Guest', email: '', role: 'CITIZEN', communityArea: '' };
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(guest);
  const [token, setToken] = useState<string | null>(localStorage.getItem('gramafix_token'));
  const [loading, setLoading] = useState(true);
  const generation = useRef(0);
  const clear = useCallback(() => {
    generation.current++;
    setCurrentUser(guest); setToken(null); setLoading(false);
    for (const key of ['gramafix_token', 'gramafix_user', 'gramafix_auth']) localStorage.removeItem(key);
  }, []);
  useEffect(() => {
    let active = true; const version = generation.current;
    if (localStorage.getItem('gramafix_token')) {
      authService.me().then(user => { if (active && version === generation.current) setCurrentUser(user); })
        .catch(() => { if (active && version === generation.current) clear(); })
        .finally(() => { if (active) setLoading(false); });
    } else setLoading(false);
    window.addEventListener('gramafix-session-expired', clear);
    return () => { active = false; window.removeEventListener('gramafix-session-expired', clear); };
  }, [clear]);
  const accept = (res: AuthResponse): AuthResult => {
    generation.current++;
    localStorage.setItem('gramafix_token', res.token);
    setToken(res.token); setCurrentUser(res.data); setLoading(false);
    return { success: true, user: res.data };
  };
  const login = async (data: LoginCredentials): Promise<AuthResult> => {
    try { return accept(await authService.login(data)); } catch (e) { return { success: false, error: errorMessage(e) }; }
  };
  const register = async (data: RegisterData): Promise<AuthResult> => {
    try { return accept(await authService.register(data)); } catch (e) { return { success: false, error: errorMessage(e) }; }
  };
  const logout = () => { void authService.logout().catch(() => {}); clear(); };
  // A role shortcut opens sign-in; it cannot change the authenticated role.
  const switchRole = (_role: UserRole) => { window.location.assign('/login'); };
  return <AuthContext.Provider value={{ currentUser, role: currentUser.role, isAuthenticated: !!token && currentUser.id !== 0,
    loading, token, login, register, logout, switchRole }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
