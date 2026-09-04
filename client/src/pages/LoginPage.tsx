import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Shield, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { MOCK_USERS } from '../data/mockIssues';

export const LoginPage: React.FC = () => {
  const { currentUser, setUser } = useAuth();
  const navigate = useNavigate();

  const handleSelectUser = (user: typeof MOCK_USERS[0]) => {
    setUser(user);
    if (user.role === 'ADMIN') {
      navigate('/issues');
    } else {
      navigate('/my-reports');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-crimson-500/10 border border-crimson-500/20 text-crimson-500 text-xs font-semibold">
          <span>Demo Evaluator Portal</span>
        </div>
        <h1 className="text-3xl font-extrabold text-heading">Switch Active Persona</h1>
        <p className="text-sm text-muted">
          Select a role to test citizen intake or administrative triage in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {MOCK_USERS.map((user) => {
          const isSelected = currentUser.id === user.id;
          return (
            <div
              key={user.id}
              onClick={() => handleSelectUser(user)}
              className={`p-6 rounded-3xl cursor-pointer border transition-all duration-300 relative group flex flex-col justify-between ${
                isSelected
                  ? 'bg-surface border-crimson-500 shadow-[0_8px_30px_rgba(239,68,68,0.2)] scale-[1.02]'
                  : 'bg-surface border-subtle hover:border-crimson-500/40 shadow-card hover:shadow-card-hover'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      user.role === 'ADMIN'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-crimson-500/20 text-crimson-500'
                    }`}
                  >
                    {user.role === 'ADMIN' ? <Shield className="w-6 h-6" /> : <UserCheck className="w-6 h-6" />}
                  </div>

                  {isSelected && (
                    <span className="flex items-center space-x-1 text-xs font-bold text-crimson-500 bg-crimson-500/10 px-2.5 py-1 rounded-full border border-crimson-500/30">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-heading">{user.fullName}</h3>
                  <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-surface-elevated text-muted border border-subtle mt-1">
                    {user.role === 'ADMIN' ? 'Municipal Officer' : 'Local Resident'}
                  </span>
                  <p className="text-xs text-muted flex items-center space-x-1 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-crimson-500" />
                    <span>{user.communityArea}</span>
                  </p>
                  <p className="text-[11px] text-muted font-mono mt-1">{user.email}</p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-subtle flex items-center justify-between text-xs font-semibold text-crimson-500 group-hover:text-crimson-600">
                <span>Switch to this persona</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
