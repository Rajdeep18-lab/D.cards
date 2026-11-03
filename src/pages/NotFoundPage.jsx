import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, CreditCard, Building2, Landmark, Compass, HelpCircle } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { useLanguage } from '../context/LanguageContext';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { isHindi } = useLanguage();

  // Set robots to noindex, nofollow and document title
  useSEO({
    title: isHindi ? '404 – पृष्ठ नहीं मिला | D.CARD' : '404 – Page Not Found | D.CARD',
    description: isHindi ? 'अनुरोधित पृष्ठ D.CARD पर नहीं मिला।' : 'The requested page could not be found on D.CARD.',
    robots: 'noindex, nofollow'
  });

  return (
    <main className="min-h-[75vh] flex items-center justify-center px-4 py-16 sm:py-24 bg-[#F8FAFC] dark:bg-[#0B1120] text-[#0F172A] dark:text-white transition-colors">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="inline-flex items-center justify-center mb-6"
        >
          <div className="relative">
            <span className="text-8xl sm:text-9xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-indigo-600 select-none">
              404
            </span>
            <div className="absolute -top-2 -right-3 w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-rose-500" />
            </div>
          </div>
        </motion.div>

        {/* Heading & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="space-y-3"
        >
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {isHindi ? 'पृष्ठ नहीं मिला' : 'Page Not Found'}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            {isHindi
              ? 'आप जिस पृष्ठ को खोज रहे हैं वह मौजूद नहीं है, हटा दिया गया है या यूआरएल में कोई त्रुटि हो सकती है।'
              : "The page you are looking for doesn't exist, has been moved, or the link may be mistyped."}
          </p>
        </motion.div>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:opacity-95 text-white font-bold text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>{isHindi ? 'होमपेज पर जाएं' : 'Back to Homepage'}</span>
          </Link>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700/60 font-semibold text-sm transition-all cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isHindi ? 'पीछे जाएं' : 'Go Back'}</span>
          </button>
        </motion.div>

        {/* Helpful Discovery Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-800 text-left"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 text-center mb-4">
            {isHindi ? 'या इन सत्यापित श्रेणियों को देखें' : 'Or explore verified banking categories'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              to="/cards"
              className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/70 hover:border-[#2563EB] dark:hover:border-[#60A5FA] transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA] group-hover:scale-105 transition-transform">
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
                  {isHindi ? 'डेबिट कार्ड' : 'Debit Cards'}
                </div>
                <div className="text-[11px] text-gray-500 dark:text-slate-400 truncate">
                  {isHindi ? '136 सत्यापित कार्ड' : '136 verified cards'}
                </div>
              </div>
            </Link>

            <Link
              to="/savings-accounts"
              className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/70 hover:border-[#2563EB] dark:hover:border-[#60A5FA] transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
                  {isHindi ? 'बचत खाते' : 'Savings Accounts'}
                </div>
                <div className="text-[11px] text-gray-500 dark:text-slate-400 truncate">
                  {isHindi ? '74 सत्यापित खाते' : '74 verified accounts'}
                </div>
              </div>
            </Link>

            <Link
              to="/find-my-bank"
              className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/70 hover:border-[#2563EB] dark:hover:border-[#60A5FA] transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                <Compass className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
                  {isHindi ? 'बैंक और एटीएम खोजें' : 'Find Banks & ATMs'}
                </div>
                <div className="text-[11px] text-gray-500 dark:text-slate-400 truncate">
                  {isHindi ? '297 सत्यापित शाखाएं' : '297 verified branches'}
                </div>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

