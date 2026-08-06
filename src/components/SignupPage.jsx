import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import { INDIAN_LOCATIONS, COUNTRY_CODES } from '../data/indianLocations';

function evaluatePasswordStrength(pass) {
  if (!pass) return { score: 0, label: 'None', color: 'bg-gray-300' };

  let score = 0;
  if (pass.length >= 8) score += 1;
  if (/[A-Z]/.test(pass)) score += 1;
  if (/[a-z]/.test(pass)) score += 1;
  if (/[0-9]/.test(pass)) score += 1;
  if (/[^A-Za-z0-9]/.test(pass)) score += 1;

  if (score <= 2) return { score, label: 'Weak', color: 'bg-[#EF4444]' };
  if (score <= 4) return { score, label: 'Medium', color: 'bg-amber-500' };
  return { score, label: 'Strong', color: 'bg-emerald-500' };
}

function SignupPage({ onSwitchToLogin, onSuccess }) {
  const { signUp, loginWithGoogle } = useAuth();
  const toast = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('Maharashtra');
  const [city, setCity] = useState('Mumbai');
  const [userType, setUserType] = useState('Working Professional');

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleSignUp = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      await loginWithGoogle();
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMsg(err.message || 'Google Sign-Up failed.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!agreeTerms || !agreePrivacy) {
      setErrorMsg('You must accept the Terms & Conditions and Privacy Policy.');
      return;
    }

    if (!isPasswordValid) {
      setErrorMsg('Password does not meet the security criteria.');
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
        country,
        state,
        city,
        userType
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMsg(err.message || 'Signup failed! Check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full text-left select-none"
    >
      <div className="text-center mb-4">
        <h2 className="text-2xl sm:text-3xl font-black text-primary dark:text-accent tracking-tight">
          Create D.Card Account
        </h2>
        <p className="text-xs text-textSoft dark:text-gray-400 font-semibold mt-1 flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Firebase Authentication Powered</span>
        </p>
      </div>

      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 rounded-2xl p-3 text-xs font-semibold flex items-center gap-2"
        >
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </motion.div>
      )}

      {/* Firebase Google Auth Button */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={loading}
        className="w-full py-3 px-4 mb-3 rounded-2xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 text-xs font-black text-slate-700 dark:text-white shadow-sm hover:bg-slate-50 dark:hover:bg-white/20 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        <span>Sign Up with Google</span>
      </button>

      <div className="relative my-3 flex items-center justify-center">
        <div className="border-t border-slate-200 dark:border-white/10 w-full" />
        <span className="bg-white dark:bg-[#0d0714] px-3 text-[10px] uppercase font-bold text-slate-400">or sign up with email</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label htmlFor="signup-name" className="block text-[10px] font-black text-secondary dark:text-roseGold uppercase tracking-widest mb-1 px-0.5">
            Full Name *
          </label>
          <input
            id="signup-name"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-2xl border border-highlight dark:border-secondary/20 bg-white dark:bg-black/30 px-3.5 py-2.5 text-xs text-textDark dark:text-white font-semibold outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/30 transition-all leading-normal"
            placeholder="John Doe"
          />
        </div>

        {/* Email Address */}
        <div>
          <label htmlFor="signup-email" className="block text-[10px] font-black text-secondary dark:text-roseGold uppercase tracking-widest mb-1 px-0.5">
            Email Address *
          </label>
          <input
            id="signup-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-highlight dark:border-secondary/20 bg-white dark:bg-black/30 px-3.5 py-2.5 text-xs text-textDark dark:text-white font-semibold outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/30 transition-all leading-normal"
            placeholder="name@example.com"
          />
        </div>

        {/* Phone Number with International Code */}
        <div>
          <label htmlFor="signup-phone" className="block text-[10px] font-black text-secondary dark:text-roseGold uppercase tracking-widest mb-1 px-0.5">
            Phone Number
          </label>
          <div className="flex gap-2">
            <select
              aria-label="Country Code"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="rounded-2xl border border-highlight dark:border-secondary/20 bg-white dark:bg-[#160814]/90 px-3 py-2.5 text-xs text-textDark dark:text-white font-black outline-none cursor-pointer"
            >
              {COUNTRY_CODES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
            <input
              id="signup-phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1 rounded-2xl border border-highlight dark:border-secondary/20 bg-white dark:bg-black/30 px-3.5 py-2.5 text-xs text-textDark dark:text-white font-semibold outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/30 transition-all leading-normal"
              placeholder="9876543210"
            />
          </div>
        </div>

        {/* Location Section Header */}
        <div className="pt-1">
          <div className="mb-1.5 px-0.5">
            <label className="block text-[10px] font-black text-secondary dark:text-roseGold uppercase tracking-widest">
              Location Setup
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* State Searchable Dropdown */}
            <div>
              <label htmlFor="signup-state" className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">State</label>
              <select
                id="signup-state"
                value={state}
                onChange={(e) => {
                  const newState = e.target.value;
                  setState(newState);
                  if (INDIAN_LOCATIONS[newState] && INDIAN_LOCATIONS[newState].length > 0) {
                    setCity(INDIAN_LOCATIONS[newState][0]);
                  }
                }}
                className="w-full rounded-2xl border border-highlight dark:border-secondary/20 bg-white dark:bg-[#160814]/90 px-3 py-2 text-xs text-textDark dark:text-white font-semibold outline-none cursor-pointer focus:ring-2 focus:ring-secondary/30"
              >
                {Object.keys(INDIAN_LOCATIONS).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* City Searchable Dropdown */}
            <div>
              <label htmlFor="signup-city" className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">City</label>
              <select
                id="signup-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-2xl border border-highlight dark:border-secondary/20 bg-white dark:bg-[#160814]/90 px-3 py-2 text-xs text-textDark dark:text-white font-semibold outline-none cursor-pointer focus:ring-2 focus:ring-secondary/30"
              >
                {availableCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Life Segment Target Profile */}
        <div>
          <label htmlFor="signup-segment" className="block text-[10px] font-black text-secondary dark:text-roseGold uppercase tracking-widest mb-1 px-0.5">
            Life Segment Profile
          </label>
          <select
            id="signup-segment"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="w-full rounded-2xl border border-highlight dark:border-secondary/20 bg-white dark:bg-[#160814]/90 px-3.5 py-2.5 text-xs text-textDark dark:text-white font-black outline-none cursor-pointer focus:ring-2 focus:ring-secondary/30"
          >
            <option value="Student">🎓 Student</option>
            <option value="Working Professional">💼 Working Professional</option>
            <option value="Traveler">✈️ Traveler</option>
            <option value="Senior Citizen">👴 Senior Citizen</option>
            <option value="Women">👩 Women Special</option>
            <option value="Premium User">👑 Elite Premium</option>
          </select>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="signup-password" className="block text-[10px] font-black text-secondary dark:text-roseGold uppercase tracking-widest mb-1 px-0.5">
            Password *
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-highlight dark:border-secondary/20 bg-white dark:bg-black/30 px-3.5 py-2.5 text-xs text-textDark dark:text-white font-semibold outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/30 transition-all pr-11 leading-normal"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary text-xs focus:outline-none p-1"
            >
              {showPassword ? '👁️' : '🙈'}
            </button>
          </div>

          {/* Password Strength Bar */}
          {password && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-gray-400">Password Strength:</span>
                <span className={passwordStrength.label === 'Strong' ? 'text-emerald-500' : passwordStrength.label === 'Medium' ? 'text-amber-500' : 'text-[#EF4444]'}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-black/40 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-1 text-[9.5px] font-semibold text-gray-400 mt-1">
                <span className={passwordRules.minLength ? 'text-emerald-500' : ''}>
                  {passwordRules.minLength ? '✓' : '•'} Min 8 chars
                </span>
                <span className={passwordRules.uppercase ? 'text-emerald-500' : ''}>
                  {passwordRules.uppercase ? '✓' : '•'} Uppercase letter
                </span>
                <span className={passwordRules.lowercase ? 'text-emerald-500' : ''}>
                  {passwordRules.lowercase ? '✓' : '•'} Lowercase letter
                </span>
                <span className={passwordRules.number ? 'text-emerald-500' : ''}>
                  {passwordRules.number ? '✓' : '•'} Number
                </span>
                <span className={passwordRules.specialChar ? 'text-emerald-500' : ''}>
                  {passwordRules.specialChar ? '✓' : '•'} Special symbol
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="signup-confirm" className="block text-[10px] font-black text-secondary dark:text-roseGold uppercase tracking-widest mb-1 px-0.5">
            Confirm Password *
          </label>
          <input
            id="signup-confirm"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-2xl border border-highlight dark:border-secondary/20 bg-white dark:bg-black/30 px-3.5 py-2.5 text-xs text-textDark dark:text-white font-semibold outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/30 transition-all leading-normal"
            placeholder="••••••••"
          />
        </div>

        {/* Terms & Privacy Checkboxes */}
        <div className="space-y-2 pt-1">
          <label className="flex items-center gap-2.5 text-xs text-textSoft dark:text-gray-300 font-medium cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-secondary focus:ring-secondary cursor-pointer"
            />
            <span>I agree to D.Card <strong className="text-secondary dark:text-roseGold">Terms & Conditions</strong></span>
          </label>

          <label className="flex items-center gap-2.5 text-xs text-textSoft dark:text-gray-300 font-medium cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreePrivacy}
              onChange={(e) => setAgreePrivacy(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-secondary focus:ring-secondary cursor-pointer"
            />
            <span>I agree to <strong className="text-secondary dark:text-roseGold">Privacy Policy</strong></span>
          </label>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading || !agreeTerms || !agreePrivacy}
          whileHover={{ scale: (loading || !agreeTerms || !agreePrivacy) ? 1 : 1.02 }}
          whileTap={{ scale: (loading || !agreeTerms || !agreePrivacy) ? 1 : 0.98 }}
          className="w-full mt-4 rounded-full bg-gradient-to-r from-secondary to-primary py-3.5 px-6 font-extrabold text-xs text-white tracking-widest uppercase shadow-[0_6px_25px_rgba(194,24,117,0.3)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
              <span>Creating Account...</span>
            </>
          ) : (
            <span>Create Cloud Account ✨</span>
          )}
        </motion.button>
      </form>

      {/* Switch to Login */}
      <div className="mt-5 text-center text-xs font-semibold text-textSoft dark:text-gray-400">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-secondary dark:text-roseGold font-bold hover:underline cursor-pointer"
        >
          Sign In 🚀
        </button>
      </div>
    </motion.div>
  );
}

export default SignupPage;
