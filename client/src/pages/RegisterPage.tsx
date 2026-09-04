import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Shield,
  UserCheck,
  Building2,
  AlertCircle,
  CheckCircle2,
  Flame,
  ArrowRight,
  Loader2,
  Check,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types/issue';

interface FormTouched {
  fullName?: boolean;
  email?: boolean;
  communityArea?: boolean;
  password?: boolean;
  confirmPassword?: boolean;
  terms?: boolean;
}

const SRI_LANKAN_AREAS = [
  'Matale Town, Matale',
  'Trincomalee Street, Matale',
  'Peradeniya Road, Kandy',
  'Dalada Veediya, Kandy',
  'Colombo Central, Colombo',
  'Galle Fort, Galle',
  'Negombo Municipal, Gampaha',
  'Kurunegala Town, Kurunegala',
  'Jaffna Town Center, Jaffna',
  'Custom Area...',
];

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [communityArea, setCommunityArea] = useState(SRI_LANKAN_AREAS[0]);
  const [customArea, setCustomArea] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('CITIZEN');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState<FormTouched>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Password strength calculations
  const passwordChecks = useMemo(() => {
    return {
      hasMinLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasNumberOrSpecial: /[0-9!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  }, [password]);

  const strengthScore = useMemo(() => {
    let score = 0;
    if (password.length >= 6) score += 1;
    if (passwordChecks.hasMinLength) score += 1;
    if (passwordChecks.hasUpper) score += 1;
    if (passwordChecks.hasNumberOrSpecial) score += 1;
    return score;
  }, [password, passwordChecks]);

  const strengthInfo = useMemo(() => {
    if (strengthScore <= 1) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/4', text: 'text-red-500' };
    if (strengthScore <= 2) return { label: 'Fair', color: 'bg-amber-500', width: 'w-2/4', text: 'text-amber-500' };
    if (strengthScore === 3) return { label: 'Good', color: 'bg-blue-500', width: 'w-3/4', text: 'text-blue-500' };
    return { label: 'Strong', color: 'bg-emerald-500', width: 'w-full', text: 'text-emerald-500' };
  }, [strengthScore]);

  // Validations
  const isFullNameValid = fullName.trim().length >= 3;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const effectiveArea = communityArea === 'Custom Area...' ? customArea.trim() : communityArea;
  const isAreaValid = effectiveArea.length >= 3;
  const isPasswordValid = password.length >= 6;
  const isConfirmPasswordValid = password === confirmPassword && confirmPassword.length > 0;
  const isTermsValid = agreeTerms;

  // Field error messages
  const fullNameError =
    touched.fullName && !fullName.trim()
      ? 'Full name is required.'
      : touched.fullName && !isFullNameValid
      ? 'Name must be at least 3 characters.'
      : null;

  const emailError =
    touched.email && !email.trim()
      ? 'Email address is required.'
      : touched.email && !isEmailValid
      ? 'Please enter a valid email address (e.g. name@domain.com).'
      : null;

  const areaError =
    touched.communityArea && !isAreaValid
      ? 'Please specify your municipal ward or area.'
      : null;

  const passwordError =
    touched.password && !password
      ? 'Password is required.'
      : touched.password && !isPasswordValid
      ? 'Password must be at least 6 characters long.'
      : null;

  const confirmPasswordError =
    touched.confirmPassword && !confirmPassword
      ? 'Please confirm your password.'
      : touched.confirmPassword && !isConfirmPasswordValid
      ? 'Passwords do not match.'
      : null;

  const termsError = touched.terms && !agreeTerms ? 'You must agree to the guidelines to register.' : null;

  const isFormValid =
    isFullNameValid &&
    isEmailValid &&
    isAreaValid &&
    isPasswordValid &&
    isConfirmPasswordValid &&
    isTermsValid;

  const roleOptions = [
    {
      role: 'CITIZEN' as UserRole,
      title: 'Citizen',
      subtitle: 'Resident',
      desc: 'Report civic issues, track fixes, upvote community concerns.',
      icon: UserCheck,
      color: 'border-emerald-500 bg-emerald-500/10 text-emerald-500',
      activeRing: 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-500/15',
    },
    {
      role: 'OFFICER' as UserRole,
      title: 'Municipal Officer',
      subtitle: 'Field Staff',
      desc: 'Triage reported hazards, update repair status, write notes.',
      icon: Building2,
      color: 'border-orange-500 bg-orange-500/10 text-orange-500',
      activeRing: 'ring-2 ring-orange-500 border-orange-500 bg-orange-500/15',
    },
    {
      role: 'ADMIN' as UserRole,
      title: 'System Admin',
      subtitle: 'Governance',
      desc: 'Platform governance, priority scoring, analytics & moderation.',
      icon: Shield,
      color: 'border-purple-600 dark:border-rose-500 bg-purple-500/10 text-purple-600 dark:text-rose-400',
      activeRing: 'ring-2 ring-purple-600 border-purple-600 dark:border-rose-500 bg-purple-900/20 shadow-[0_0_15px_rgba(168,85,247,0.25)]',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      email: true,
      communityArea: true,
      password: true,
      confirmPassword: true,
      terms: true,
    });
    setServerError(null);

    if (!isFormValid) {
      if (!agreeTerms) {
        setServerError('Please agree to the GramaFix Civic Code of Conduct and complete all required fields.');
      } else {
        setServerError('Please review and correct the required fields highlighted below.');
      }
      return;
    }

    setIsSubmitting(true);
    const result = await register({
      fullName: fullName.trim(),
      email: email.trim(),
      password,
      communityArea: effectiveArea,
      role: selectedRole,
    });
    setIsSubmitting(false);

    if (result.success && result.user) {
      const r = result.user.role;
      if (r === 'ADMIN') {
        navigate('/admin');
      } else if (r === 'OFFICER') {
        navigate('/officer');
      } else {
        // CITIZEN / RESIDENT → dedicated citizen dashboard
        navigate('/citizen');
      }
    } else {
      setServerError(result.error || 'Failed to create account. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-gradient-to-tr from-red-600/15 via-rose-500/10 to-amber-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold backdrop-blur-md">
            <Flame className="w-3.5 h-3.5 text-red-500" />
            <span>Citizen Registration</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Join the <span className="text-red-500">GramaFix</span> Network
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Create a citizen account. Officer and administrator accounts are provisioned separately.
          </p>
        </div>

        {/* Form Container */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl bg-white/95 dark:bg-[#121722]/95 backdrop-blur-xl">
          {/* Server Error Alert */}
          {serverError && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start space-x-3 text-red-600 dark:text-red-400 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
              <div className="flex-1 font-medium leading-relaxed">{serverError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Step 1: Select Role */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Select Your Civic Role <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {roleOptions.filter(opt => opt.role === 'CITIZEN').map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedRole === opt.role;
                  return (
                    <div
                      key={opt.role}
                      onClick={() => setSelectedRole(opt.role)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? opt.activeRing
                          : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-surface-elevated hover:border-slate-300 dark:hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-2 rounded-xl border ${opt.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                          {opt.title}
                        </div>
                        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          {opt.subtitle}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                          {opt.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="reg-fullname"
                  className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (serverError) setServerError(null);
                    }}
                    onBlur={() => setTouched((prev) => ({ ...prev, fullName: true }))}
                    placeholder="e.g. Kasun Perera"
                    className={`w-full pl-10 pr-10 py-3 rounded-xl text-sm transition-all duration-200 bg-slate-50 dark:bg-surface-elevated text-slate-900 dark:text-white border ${
                      fullNameError
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : touched.fullName && isFullNameValid
                        ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                        : 'border-slate-200 dark:border-white/10 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    } outline-none`}
                  />
                  {touched.fullName && (
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                      {isFullNameValid ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {fullNameError && <p className="text-xs text-red-500 font-medium mt-1">{fullNameError}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="reg-email"
                  className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (serverError) setServerError(null);
                    }}
                    onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                    placeholder="e.g. kasun@example.lk"
                    className={`w-full pl-10 pr-10 py-3 rounded-xl text-sm transition-all duration-200 bg-slate-50 dark:bg-surface-elevated text-slate-900 dark:text-white border ${
                      emailError
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : touched.email && isEmailValid
                        ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                        : 'border-slate-200 dark:border-white/10 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    } outline-none`}
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
            </div>

            {/* Community Area / Ward */}
            <div className="space-y-1.5">
              <label
                htmlFor="reg-area"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
              >
                Community Area / Municipal Ward <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <select
                    id="reg-area"
                    value={communityArea}
                    onChange={(e) => setCommunityArea(e.target.value)}
                    className="w-full pl-10 pr-8 py-3 rounded-xl text-sm bg-slate-50 dark:bg-surface-elevated text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none"
                  >
                    {SRI_LANKAN_AREAS.map((area) => (
                      <option key={area} value={area} className="dark:bg-slate-900">
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                {communityArea === 'Custom Area...' && (
                  <input
                    type="text"
                    value={customArea}
                    onChange={(e) => setCustomArea(e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, communityArea: true }))}
                    placeholder="Type your ward / town name"
                    className="w-full px-4 py-3 rounded-xl text-sm bg-slate-50 dark:bg-surface-elevated text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none"
                  />
                )}
              </div>
              {areaError && <p className="text-xs text-red-500 font-medium mt-1">{areaError}</p>}
            </div>

            {/* Step 3: Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="reg-password"
                  className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (serverError) setServerError(null);
                    }}
                    onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                    placeholder="Min 8 chars recommended"
                    className={`w-full pl-10 pr-10 py-3 rounded-xl text-sm transition-all duration-200 bg-slate-50 dark:bg-surface-elevated text-slate-900 dark:text-white border ${
                      passwordError
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : touched.password && isPasswordValid
                        ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                        : 'border-slate-200 dark:border-white/10 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    } outline-none`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordError && <p className="text-xs text-red-500 font-medium mt-1">{passwordError}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="reg-confirm-password"
                  className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                >
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (serverError) setServerError(null);
                    }}
                    onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
                    placeholder="Re-enter password"
                    className={`w-full pl-10 pr-10 py-3 rounded-xl text-sm transition-all duration-200 bg-slate-50 dark:bg-surface-elevated text-slate-900 dark:text-white border ${
                      confirmPasswordError
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : touched.confirmPassword && isConfirmPasswordValid
                        ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                        : 'border-slate-200 dark:border-white/10 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    } outline-none`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPasswordError && (
                  <p className="text-xs text-red-500 font-medium mt-1">{confirmPasswordError}</p>
                )}
              </div>
            </div>

            {/* Live Password Strength Meter */}
            {password.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-surface-elevated border border-slate-200 dark:border-white/10 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Password Strength:</span>
                  <span className={`font-bold ${strengthInfo.text}`}>{strengthInfo.label}</span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strengthInfo.color} transition-all duration-300 ${strengthInfo.width}`}
                  />
                </div>
                {/* Check list */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                  <span
                    className={`flex items-center space-x-1 ${
                      passwordChecks.hasMinLength ? 'text-emerald-500' : 'text-slate-400'
                    }`}
                  >
                    {passwordChecks.hasMinLength ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    <span>8+ characters</span>
                  </span>
                  <span
                    className={`flex items-center space-x-1 ${
                      passwordChecks.hasUpper ? 'text-emerald-500' : 'text-slate-400'
                    }`}
                  >
                    {passwordChecks.hasUpper ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    <span>Uppercase</span>
                  </span>
                  <span
                    className={`flex items-center space-x-1 ${
                      passwordChecks.hasNumberOrSpecial ? 'text-emerald-500' : 'text-slate-400'
                    }`}
                  >
                    {passwordChecks.hasNumberOrSpecial ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <X className="w-3 h-3" />
                    )}
                    <span>Number/Symbol</span>
                  </span>
                </div>
              </div>
            )}

            {/* Terms of Service Checkbox */}
            <div className="space-y-1 pt-1">
              <label className="flex items-start space-x-3 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked);
                    setTouched((prev) => ({ ...prev, terms: true }));
                  }}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 dark:border-white/20 text-red-500 focus:ring-red-500/30 bg-slate-100 dark:bg-surface-elevated flex-shrink-0"
                />
                <span className="leading-relaxed">
                  I agree to the GramaFix Civic Code of Conduct, ensuring all reported hazards and triage data are
                  accurate and adhere to public governance guidelines.
                </span>
              </label>
              {termsError && <p className="text-xs text-red-500 font-medium pl-7">{termsError}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-red-500 via-red-600 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-[0_4px_20px_rgba(239,68,68,0.4)] hover:shadow-[0_6px_28px_rgba(239,68,68,0.6)] transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering {selectedRole}...</span>
                </>
              ) : (
                <>
                  <span>Create {selectedRole} Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer link to sign in */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Already have a GramaFix account?{' '}
              <Link
                to="/login"
                className="font-bold text-red-500 hover:text-red-600 underline-offset-4 hover:underline transition-colors"
              >
                Sign In to Portal
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
