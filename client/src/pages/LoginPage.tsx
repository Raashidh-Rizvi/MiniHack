import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  UserCheck,
  Building2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { SriLankanLion } from '../components/common/SriLankanLion';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types/issue';

interface FieldTouched {
  email?: boolean;
  password?: boolean;
}

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [touched, setTouched] = useState<FieldTouched>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [activePresetRole, setActivePresetRole] = useState<UserRole | null>(null);

  // Email format regex
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPasswordValid = password.length >= 6;

  // Validation errors
  const emailError =
    touched.email && !email.trim()
      ? 'Email address is required.'
      : touched.email && !isEmailValid
      ? 'Please enter a valid email address (e.g. name@domain.com).'
      : null;

  const passwordError =
    touched.password && !password
      ? 'Password is required.'
      : touched.password && !isPasswordValid
      ? 'Password must be at least 6 characters.'
      : null;

  const isFormValid = isEmailValid && isPasswordValid;

  // Evaluator presets for 1-click test
  const demoPresets = [
    {
      role: 'CITIZEN' as UserRole,
      label: 'Citizen',
      sublabel: 'Kasun Perera',
      email: 'kasun.citizen@gramafix.lk',
      password: 'password123',
      icon: UserCheck,
      color: 'text-red-500 bg-red-500/10 border-red-500/30 hover:border-red-500',
      activeColor: 'border-red-500 bg-red-500/15 shadow-[0_0_15px_rgba(239,68,68,0.25)]',
    },
    {
      role: 'OFFICER' as UserRole,
      label: 'Officer',
      sublabel: 'Eng. Bandara',
      email: 'officer.bandara@gramafix.lk',
      password: 'officer123',
      icon: Building2,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/30 hover:border-amber-500',
      activeColor: 'border-amber-500 bg-amber-500/15 shadow-[0_0_15px_rgba(245,158,11,0.25)]',
    },
    {
      role: 'ADMIN' as UserRole,
      label: 'System Admin',
      sublabel: 'Dr. Priyantha',
      email: 'admin.priyantha@gramafix.lk',
      password: 'admin123',
      icon: Shield,
      color: 'text-red-500 bg-red-500/10 border-red-500/30 hover:border-red-500',
      activeColor: 'border-red-500 bg-red-500/15 shadow-[0_0_15px_rgba(239,68,68,0.25)]',
    },
  ];

  const handleApplyPreset = (preset: (typeof demoPresets)[0]) => {
    setEmail(preset.email);
    setPassword(preset.password);
    setActivePresetRole(preset.role);
    setServerError(null);
    setTouched({ email: true, password: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setServerError(null);

    if (!isFormValid) return;

    setIsSubmitting(true);
    const result = await login({ email: email.trim(), password });
    setIsSubmitting(false);

    if (result.success && result.user) {
      if (result.user.role === 'ADMIN' || result.user.role === 'OFFICER') {
        navigate(result.user.role === 'ADMIN' ? '/admin' : '/officer');
      } else {
        navigate('/my-reports');
      }
    } else {
      setServerError(result.error || 'Invalid credentials. Please verify and try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-red-600/15 via-rose-500/10 to-amber-500/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="w-full max-w-lg relative z-10">
        {/* Brand Card Header */}
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold backdrop-blur-md">
            <SriLankanLion size={16} color="#EF4444" accentColor="#991B1B" />
            <span>Sri Lanka National Civic Intake</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Sign In to <span className="text-red-500">GramaFix</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
            Access citizen reporting, regional municipal queue, or administrative governance.
          </p>
        </div>

        {/* Quick Role Evaluator Selector */}
        <div className="mb-6 p-4 rounded-2xl bg-white/70 dark:bg-[#121722]/70 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>1-Click Hackathon Evaluator Presets</span>
            </span>
            <span className="text-[10px] text-slate-400">Click to autofill</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {demoPresets.map((preset) => {
              const Icon = preset.icon;
              const isSelected = activePresetRole === preset.role;
              return (
                <button
                  key={preset.role}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className={`p-3 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                    isSelected ? 'liquid-pill-active' : 'liquid-btn-glass'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <Icon className="w-4 h-4" />
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                  </div>
                  <div className="mt-2">
                    <div className="text-xs font-bold leading-tight">{preset.label}</div>
                    <div className="text-[10px] opacity-80 truncate">{preset.sublabel}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Form Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl bg-white/90 dark:bg-[#121722]/90 backdrop-blur-xl">
          {/* Server Error Notification */}
          {serverError && (
            <div className="mb-6 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start space-x-3 text-red-600 dark:text-red-400 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
              <div className="flex-1 font-medium leading-relaxed">{serverError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (serverError) setServerError(null);
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                  placeholder="e.g. kasun.citizen@gramafix.lk"
                  className={`w-full pl-10 pr-10 py-3 rounded-xl text-sm transition-all duration-200 bg-slate-50 dark:bg-surface-elevated text-slate-900 dark:text-white border ${
                    emailError
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : touched.email && isEmailValid
                      ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      : 'border-slate-200 dark:border-white/10 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  } outline-none`}
                  autoComplete="email"
                />
                {touched.email && (
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                    {isEmailValid ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {emailError && <p className="text-xs text-red-500 font-medium mt-1">{emailError}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('For hackathon demonstration, use password123, officer123, or admin123.')}
                  className="text-xs text-red-500 hover:text-red-600 transition-colors font-semibold"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (serverError) setServerError(null);
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                  placeholder="Enter your account password"
                  className={`w-full pl-10 pr-10 py-3 rounded-xl text-sm transition-all duration-200 bg-slate-50 dark:bg-surface-elevated text-slate-900 dark:text-white border ${
                    passwordError
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : touched.password && isPasswordValid
                      ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      : 'border-slate-200 dark:border-white/10 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  } outline-none`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && <p className="text-xs text-red-500 font-medium mt-1">{passwordError}</p>}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 dark:border-white/20 text-red-500 focus:ring-red-500/30 bg-slate-100 dark:bg-surface-elevated"
                />
                <span>Remember this device</span>
              </label>
            </div>

            {/* Submit CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm liquid-btn-crimson flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Don't have an account yet?{' '}
              <Link
                to="/register"
                className="font-bold text-red-500 hover:text-red-600 underline-offset-4 hover:underline transition-colors"
              >
                Register New Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
