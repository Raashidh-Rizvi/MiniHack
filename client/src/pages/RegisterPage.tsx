import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Check,
  X,
  ShieldCheck,
} from 'lucide-react';
import { SriLankanLion } from '../components/common/SriLankanLion';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';

interface FormTouched {
  fullName?: boolean;
  email?: boolean;
  phone?: boolean;
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
  const [communityArea, setCommunityArea] = useState(SRI_LANKAN_AREAS[0]);
  const [customArea, setCustomArea] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Email & OTP states
  const [email, setEmail] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [phone, setPhone] = useState('');

  // OTP Modal / Flow states
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccessMessage, setOtpSuccessMessage] = useState<string | null>(null);
  const [simulatedEmailOtp, setSimulatedEmailOtp] = useState<{ code: string; email: string } | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState<FormTouched>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Resend timer countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

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
  const cleanPhoneDigits = phone.replace(/\D/g, '');
  const isPhoneValid = !phone.trim() || cleanPhoneDigits.length >= 9;
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
    isEmailVerified &&
    isPhoneValid &&
    isAreaValid &&
    isPasswordValid &&
    isConfirmPasswordValid &&
    isTermsValid;

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (serverError) setServerError(null);
    if (isEmailVerified) {
      setIsEmailVerified(false);
      setVerificationToken(null);
      setVerifiedEmail(null);
      setSimulatedEmailOtp(null);
    }
  };

  const handleSendEmailOtp = async (overrideEmail?: string) => {
    const target = (overrideEmail || email).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target)) {
      setTouched((prev) => ({ ...prev, email: true }));
      setServerError('Please enter a valid email address before requesting a verification code.');
      return;
    }
    setIsSendingOtp(true);
    setOtpError(null);
    setOtpSuccessMessage(null);
    try {
      const res = await authService.sendOtp({ email: target });
      setIsOtpModalOpen(true);
      setResendCooldown(60);
      setOtpDigits(['', '', '', '', '', '']);
      if (res.otp) {
        setSimulatedEmailOtp({ code: res.otp, email: res.email || target });
      }
      setTimeout(() => otpInputs.current[0]?.focus(), 150);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to dispatch verification code. Please try again.';
      setServerError(msg);
      setOtpError(msg);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (codeToVerify?: string) => {
    const code = codeToVerify || otpDigits.join('');
    if (code.length !== 6) {
      setOtpError('Please enter all 6 digits of the OTP code.');
      return;
    }
    setIsVerifyingOtp(true);
    setOtpError(null);
    try {
      const target = email.trim().toLowerCase();
      const res = await authService.verifyOtp({ email: target, otp: code });
      setIsEmailVerified(true);
      setVerificationToken(res.verificationToken);
      setVerifiedEmail(res.email || target);
      setOtpSuccessMessage('Email address verified successfully!');
      setTimeout(() => {
        setIsOtpModalOpen(false);
      }, 900);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Invalid verification code. Please check your inbox and retry.';
      setOtpError(msg);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleQuickFillOtp = (code: string) => {
    const digits = code.split('').slice(0, 6);
    setOtpDigits(digits);
    void handleVerifyOtp(code);
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    if (digit && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || '';
      }
      setOtpDigits(newDigits);
      if (pasted.length === 6) {
        void handleVerifyOtp(pasted);
      } else {
        const nextIdx = Math.min(pasted.length, 5);
        otpInputs.current[nextIdx]?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!isEmailVerified) {
      // Mark email touched so format errors show, but don't mark everything else
      // — only the OTP modal needs to open, not a wall of red fields
      setTouched((prev) => ({ ...prev, email: true }));
      setServerError('Please verify your email address via the 6-digit OTP code sent to your inbox.');
      void handleSendEmailOtp();
      return;
    }

    // Email is verified — now mark all fields touched to reveal any remaining errors
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      communityArea: true,
      password: true,
      confirmPassword: true,
      terms: true,
    });

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
      email: (verifiedEmail || email).trim().toLowerCase(),
      phone: phone.trim() || undefined,
      verificationToken: verificationToken || undefined,
      password,
      communityArea: effectiveArea,
      role: 'CITIZEN',
    });
    setIsSubmitting(false);

    if (result.success && result.user) {
      navigate('/citizen');
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
            <SriLankanLion size={16} color="#EF4444" accentColor="#991B1B" />
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
            {/* Step 1: Name & Email */}
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

              {/* Community Area / Ward */}
              <div className="space-y-1.5">
                <label
                  htmlFor="reg-area"
                  className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                >
                  Community Area / Ward <span className="text-red-500">*</span>
                </label>
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
                    className="w-full px-4 py-3 rounded-xl text-sm bg-slate-50 dark:bg-surface-elevated text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none mt-2"
                  />
                )}
                {areaError && <p className="text-xs text-red-500 font-medium mt-1">{areaError}</p>}
              </div>
            </div>

            {/* Step 2: Email Address (With Email OTP Verification) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="reg-email"
                  className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                {isEmailVerified ? (
                  <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Email OTP Verified</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-amber-500 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    OTP Verification Required
                  </span>
                )}
              </div>
              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                  placeholder="e.g. kasun@example.lk"
                  disabled={isEmailVerified}
                  className={`w-full pl-10 pr-28 py-3 rounded-xl text-sm transition-all duration-200 bg-slate-50 dark:bg-surface-elevated text-slate-900 dark:text-white border ${
                    emailError
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : isEmailVerified
                      ? 'border-emerald-500 bg-emerald-500/5 focus:ring-2 focus:ring-emerald-500/20'
                      : 'border-slate-200 dark:border-white/10 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  } outline-none`}
                />
                <div className="absolute inset-y-0 right-1.5 flex items-center">
                  {isEmailVerified ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEmailVerified(false);
                        setVerificationToken(null);
                        setVerifiedEmail(null);
                        setSimulatedEmailOtp(null);
                      }}
                      className="text-xs text-slate-400 hover:text-red-500 px-2.5 py-1 rounded-lg hover:bg-red-500/10 transition-colors font-medium cursor-pointer"
                    >
                      Change
                    </button>
                  ) : (
                    <button
                      type="button"
                      id="reg-send-otp-btn"
                      disabled={isSendingOtp || !isEmailValid}
                      onClick={() => handleSendEmailOtp()}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold liquid-btn-crimson flex items-center space-x-1 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                    >
                      {isSendingOtp ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <Mail className="w-3.5 h-3.5" />
                          <span>Verify Email</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
              {emailError ? (
                <p className="text-xs text-red-500 font-medium mt-1">{emailError}</p>
              ) : (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  A 6-digit OTP will be dispatched to this email address for verification.
                </p>
              )}
            </div>

            {/* Step 3: Contact Number (Optional) */}
            <div className="space-y-1.5">
              <label
                htmlFor="reg-phone"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
              >
                Mobile Contact (Optional)
              </label>
              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 dark:text-slate-400 text-xs font-bold space-x-1.5 z-10 select-none">
                  <span className="text-base leading-none">🇱🇰</span>
                  <span>+94</span>
                  <span className="text-slate-300 dark:text-slate-600 font-light">|</span>
                </div>
                <input
                  id="reg-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="077 123 4567"
                  className="w-full pl-20 pr-4 py-3 rounded-xl text-sm transition-all duration-200 bg-slate-50 dark:bg-surface-elevated text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Optional contact number for emergency civic notices.
              </p>
            </div>

            {/* Step 4: Password & Confirm Password */}
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
              id="reg-submit-btn"
              disabled={isSubmitting}
              className={`w-full py-4 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 cursor-pointer transition-all ${
                !isEmailVerified
                  ? 'liquid-btn-glass text-slate-600 dark:text-slate-300 border-red-500/30 dark:border-red-500/30'
                  : 'liquid-btn-crimson'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering Citizen Account...</span>
                </>
              ) : !isEmailVerified ? (
                <>
                  <Mail className="w-4 h-4 text-red-500 animate-pulse" />
                  <span>Verify Email to Complete Registration</span>
                </>
              ) : (
                <>
                  <span>Create Citizen Account</span>
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

      {/* OTP Verification Modal */}
      {isOtpModalOpen && (
        <div className="liquid-modal-backdrop overflow-y-auto p-4 sm:p-6" role="dialog" aria-modal="true">
          <div
            className="liquid-modal relative w-full max-w-md border border-white/20 dark:border-white/15 overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-heading">Email Verification</h3>
                  <p className="text-xs text-muted">6-Digit One-Time Password (OTP)</p>
                </div>
              </div>
              <button
                type="button"
                id="close-otp-modal-btn"
                onClick={() => setIsOtpModalOpen(false)}
                className="liquid-modal-close flex-shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              We've dispatched a 6-digit verification code to{' '}
              <span className="font-bold text-red-500 dark:text-rose-400">{email}</span>. Please check your inbox (and spam folder) and enter the code below.
            </p>

            {/* Error / Success alerts */}
            {otpError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center space-x-2 text-xs text-red-500 font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{otpError}</span>
              </div>
            )}
            {otpSuccessMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-2 text-xs text-emerald-500 font-medium">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{otpSuccessMessage}</span>
              </div>
            )}


            {/* 6 Digit Inputs */}
            <div className="flex justify-center items-center gap-2 sm:gap-3">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  ref={(el) => (otpInputs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  onPaste={idx === 0 ? handleOtpPaste : undefined}
                  className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-black rounded-xl bg-slate-50 dark:bg-surface-elevated text-slate-900 dark:text-white border border-slate-200 dark:border-white/15 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 outline-none transition-all shadow-inner"
                />
              ))}
            </div>

            {/* Resend & Actions */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 dark:text-slate-400">
                {resendCooldown > 0 ? (
                  `Resend email code in ${resendCooldown}s`
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendEmailOtp()}
                    disabled={isSendingOtp}
                    className="text-red-500 hover:text-red-600 font-bold underline-offset-2 hover:underline cursor-pointer"
                  >
                    Resend Email Code
                  </button>
                )}
              </span>
              <button
                type="button"
                onClick={() => setIsOtpModalOpen(false)}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                Change Email
              </button>
            </div>

            {/* Verify Button */}
            <button
              type="button"
              id="confirm-otp-btn"
              disabled={isVerifyingOtp || otpDigits.some((d) => !d)}
              onClick={() => handleVerifyOtp()}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm liquid-btn-crimson flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isVerifyingOtp ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify & Confirm Email</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
