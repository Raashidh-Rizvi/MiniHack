import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/issue';
export const RequireRole: React.FC<{ roles: UserRole[]; children: React.ReactNode }> = ({ roles, children }) => {
  const { loading, isAuthenticated, role } = useAuth();
  if (loading) return <p className="p-8" role="status">Checking your session…</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const normalized = role === 'RESIDENT' ? 'CITIZEN' : role;
  if (!roles.includes(normalized)) return <div className="p-8"><h1 className="text-xl font-bold">Access restricted</h1><p>This page is not available for your role.</p><Link className="underline" to={role === 'ADMIN' ? '/admin' : role === 'OFFICER' ? '/officer' : '/my-reports'}>Open my dashboard</Link></div>;
  return <>{children}</>;
};