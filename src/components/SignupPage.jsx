import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Phone, MapPin, ArrowRight, ArrowLeft, Check, AlertCircle, ShieldCheck, Sparkles, GraduationCap, Briefcase, Plane, Crown, HeartHandshake, UserCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { INDIAN_LOCATIONS, COUNTRY_CODES } from '../data/indianLocations';

function evaluatePasswordStrength(pass) {
  if (!pass) return { score: 0, label: 'None', color: 'bg-gray-300' };

  let score = 0;
  if (pass.length >= 8) score += 1;
  if (/[A-Z]/.test(pass)) score += 1;
  if (/[a-z]/.test(pass)) score += 1;
  if (/[0-9]/.test(pass)) score += 1;
  if (/[^A-Za-z0-9]/.test(pass)) score += 1;

  if (score <= 2) return { score, label: 'Weak', color: 'bg-rose-500' };
  if (score <= 4) return { score, label: 'Medium', color: 'bg-amber-500' };
  return { score, label: 'Strong', color: 'bg-emerald-500' };
}

function SignupPage({ onSwitchToLogin, onSuccess }) {
  const { signUp, loginWithGoogle } = useAuth();

  const [step, setStep] = useState(1); // 1: Personal, 2: Profile & Location, 3: Security & Verification
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const [state, setState] = useState('Maharashtra');
  const [city, setCity] = useState('Mumbai');
  const [userType, setUserType] = useState('Working Professional');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [signupSuccessState, setSignupSuccessState] = useState(null);

  const passwordStrength = useMemo(() => evaluatePasswordStrength(password), [password]);

  const passwordRules = useMemo(() => {
    return {
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  const availableCities = useMemo(() => {
    return INDIAN_LOCATIONS[state] || ["Other"];
  }, [state]);

  const handleNextStep = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (step === 1) {
      if (!fullName.trim() || !email.trim()) {
        setErrorMsg('Please provide your full name and email address.');
        return;
      }
      if (!email.includes('@') || !email.includes('.')) {
        setErrorMsg('Please enter a valid email address.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!agreeTerms || !agreePrivacy) {
      setErrorMsg('You must accept the Terms & Conditions and Privacy Policy.');
      return;
    }

    if (!isPasswordValid) {
      setErrorMsg('Password does not meet all security criteria.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    const cleanPhoneDigits = phoneNumber.replace(/\D/g, '');
    const fullPhone = cleanPhoneDigits ? `${countryCode} ${cleanPhoneDigits}` : '';

    setLoading(true);

    try {
      await signUp({
        email,
        password,
        fullName,
        phone: fullPhone,
        country: 'India',
        state,
        city,
        userType
      });

      setSignupSuccessState(fullName || 'User');
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1800);
    } catch (err) {
      setErrorMsg(err.message || 'Signup failed! Please check your details.');
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      const gRes = await loginWithGoogle();
      setSignupSuccessState(gRes?.user?.displayName || 'User');
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1800);
    } catch (err) {
      setErrorMsg(err.message || 'Google Sign-Up failed.');
      setLoading(false);
    }
  };

  if (signupSuccessState) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="py-12 px-4 text-center space-y-5 select-none"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-bounce">
          <Check className="w-10 h-10 stroke-[3]" />
        </div>
        <div className="space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest border border-emerald-500/20">
            Account Created Successfully
          </span>
          <h2 className="text-2xl font-extrabold text-[#1F2937] dark:text-white tracking-tight">
            Welcome to D.CARD, {signupSuccessState} ✨
          </h2>
          <p className="text-xs text-[#6B7280] dark:text-slate-400 font-medium">
            Initializing your personal debit card portfolio...
          </p>
        </div>
        <div className="w-48 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#2563EB] to-emerald-500 w-full animate-[marquee_1.8s_linear_infinite]" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full text-left select-none space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] dark:text-white tracking-tight">
          Create D.CARD Account
        </h2>
        <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 font-normal mt-1">
          Complete the 3-step onboarding to access personalized AI banking.
        </p>
      </div>

      {/* ── 3-Step Progress Stepper ── */}
      <div className="flex items-center justify-between gap-2 p-1 bg-[#F8FAFC] dark:bg-slate-900/60 rounded-2xl border border-[#E5E7EB] dark:border-slate-800">
        {[
          { num: 1, title: 'Personal' },
          { num: 2, title: 'Profile' },
          { num: 3, title: 'Security' }
        ].map((s) => (
          <button
            key={s.num}
            type="button"
            onClick={() => {
              if (s.num < step) setStep(s.num);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
              step === s.num
                ? 'bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/25'
                : step > s.num
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'text-[#6B7280] dark:text-slate-500'
            }`}
          >
            <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-black ${
              step === s.num ? 'bg-white text-[#2563EB]' : step > s.num ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800'
            }`}>
              {step > s.num ? '✓' : s.num}
            </span>
            <span className="hidden sm:inline">{s.title}</span>
          </button>
        ))}
      </div>

      {errorMsg && (
        <div className="bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 rounded-2xl p-3.5 text-xs font-semibold flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Google Signup Option on Step 1 */}
      {step === 1 && (
        <>
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-[#E5E7EB] dark:border-slate-700 text-xs font-extrabold text-slate-800 dark:text-white shadow-sm hover:shadow-md hover:border-[#2563EB]/40 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Quick Sign Up with Google</span>
          </button>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-[#E5E7EB] dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-[#0F172A] px-3 text-[10px] font-extrabold uppercase tracking-widest text-[#6B7280] whitespace-nowrap">
              OR REGISTER WITH EMAIL
            </span>
          </div>
        </>
      )}

      {/* ── STEP 1: PERSONAL DETAILS ── */}
      {step === 1 && (
        <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleNextStep} className="space-y-4">
          <div>
            <label className="block text-[11px] font-extrabold text-[#1F2937] dark:text-slate-300 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#6B7280] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-2xl border border-[#E5E7EB] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900/60 pl-11 pr-4 py-3 text-xs font-semibold text-[#1F2937] dark:text-white outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/15 transition-all"
                placeholder="Rajdeep Singh"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-[#1F2937] dark:text-slate-300 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#6B7280] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-[#E5E7EB] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900/60 pl-11 pr-4 py-3 text-xs font-semibold text-[#1F2937] dark:text-white outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/15 transition-all"
                placeholder="rajdeep@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-[#1F2937] dark:text-slate-300 uppercase tracking-wider mb-1">
              Phone Number
            </label>
            <div className="flex gap-2">
              <select
                aria-label="Country Code"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="rounded-2xl border border-[#E5E7EB] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900/60 px-3 py-3 text-xs font-bold text-[#1F2937] dark:text-white outline-none cursor-pointer"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                ))}
              </select>
              <div className="relative flex-1">
                <Phone className="w-4 h-4 text-[#6B7280] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full rounded-2xl border border-[#E5E7EB] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900/60 pl-11 pr-4 py-3 text-xs font-semibold text-[#1F2937] dark:text-white outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/15 transition-all"
                  placeholder="9876543210"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-xs font-extrabold text-white uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue to Profile Setup</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.form>
      )}

      {/* ── STEP 2: PROFILE & LOCATION ── */}
      {step === 2 && (
        <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleNextStep} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-extrabold text-[#1F2937] dark:text-slate-300 uppercase tracking-wider mb-1">State</label>
              <select
                value={state}
                onChange={(e) => {
                  const s = e.target.value;
                  setState(s);
                  if (INDIAN_LOCATIONS[s] && INDIAN_LOCATIONS[s].length > 0) {
                    setCity(INDIAN_LOCATIONS[s][0]);
                  }
                }}
                className="w-full rounded-2xl border border-[#E5E7EB] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900/60 px-3.5 py-3 text-xs font-bold text-[#1F2937] dark:text-white outline-none cursor-pointer"
              >
                {Object.keys(INDIAN_LOCATIONS).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-[#1F2937] dark:text-slate-300 uppercase tracking-wider mb-1">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-2xl border border-[#E5E7EB] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900/60 px-3.5 py-3 text-xs font-bold text-[#1F2937] dark:text-white outline-none cursor-pointer"
              >
                {availableCities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-[#1F2937] dark:text-slate-300 uppercase tracking-wider mb-1">
              Financial Segment Profile
            </label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full rounded-2xl border border-[#E5E7EB] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900/60 px-3.5 py-3 text-xs font-extrabold text-[#1F2937] dark:text-white outline-none cursor-pointer"
            >
              <option value="Student">🎓 Student Cards</option>
              <option value="Working Professional">💼 Working Professional</option>
              <option value="Traveler">✈️ Traveler & Airport Lounge</option>
              <option value="Senior Citizen">👴 Senior High Yield</option>
              <option value="Women">👩 Women Special</option>
              <option value="Premium User">👑 Elite Wealth Management</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="py-3.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-[#6B7280] dark:text-slate-300 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-xs font-extrabold text-white uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue to Security</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.form>
      )}

      {/* ── STEP 3: SECURITY & VERIFICATION ── */}
      {step === 3 && (
        <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleFinalSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-extrabold text-[#1F2937] dark:text-slate-300 uppercase tracking-wider mb-1">
              Set Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#6B7280] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-[#E5E7EB] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900/60 pl-11 pr-11 py-3 text-xs font-semibold text-[#1F2937] dark:text-white outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/15 transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#2563EB] p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-extrabold">
                  <span className="text-[#6B7280]">Strength:</span>
                  <span className={passwordStrength.label === 'Strong' ? 'text-emerald-500' : passwordStrength.label === 'Medium' ? 'text-amber-500' : 'text-rose-500'}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${passwordStrength.color}`} style={{ width: `${(passwordStrength.score / 5) * 100}%` }} />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-[#1F2937] dark:text-slate-300 uppercase tracking-wider mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#6B7280] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-2xl border border-[#E5E7EB] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900/60 pl-11 pr-4 py-3 text-xs font-semibold text-[#1F2937] dark:text-white outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/15 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <label className="flex items-center gap-2.5 text-xs text-[#6B7280] dark:text-slate-300 font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
              />
              <span>I agree to D.CARD Terms & Conditions</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-[#6B7280] dark:text-slate-300 font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreePrivacy}
                onChange={(e) => setAgreePrivacy(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
              />
              <span>I agree to Privacy Policy</span>
            </label>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="py-3.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-[#6B7280] dark:text-slate-300 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              disabled={loading || !agreeTerms || !agreePrivacy}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-xs font-extrabold text-white uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Account Registration</span>
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </motion.form>
      )}

      {/* Switch to Login */}
      <div className="text-center text-xs font-semibold text-[#6B7280] dark:text-slate-400 pt-2 border-t border-[#E5E7EB] dark:border-slate-800">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-[#2563EB] dark:text-[#60A5FA] font-bold hover:underline cursor-pointer"
        >
          Sign In 🚀
        </button>
      </div>
    </motion.div>
  );
}

export default SignupPage;
