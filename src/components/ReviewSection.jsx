import React, { useState, useEffect } from 'react';
import { reviews as initialMockReviews } from '../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquarePlus, Mail, ArrowRight, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

function ReviewSection({ onOpenContact }) {
  const { user } = useAuth();
  const [reviewsList, setReviewsList] = useState([]);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // Form State
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('Account Holder');
  const [cardName, setCardName] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Load reviews from localStorage + mockData
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dcard_user_reviews');
      const customReviews = saved ? JSON.parse(saved) : [];
      setReviewsList([...customReviews, ...initialMockReviews]);
    } catch (e) {
      setReviewsList(initialMockReviews);
    }
  }, []);

  // Pre-fill user name if logged in
  useEffect(() => {
    if (user) {
      setUserName(user.displayName || user.email?.split('@')[0] || '');
    }
  }, [user]);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewText.trim() || !userName.trim()) return;

    const newReview = {
      id: `custom-${Date.now()}`,
      user: userName.trim(),
      role: userRole,
      cardName: cardName.trim() || 'Verified Card User',
      rating: Number(rating),
      text: reviewText.trim(),
      date: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      isUserSubmitted: true
    };

    try {
      const saved = localStorage.getItem('dcard_user_reviews');
      const existingCustom = saved ? JSON.parse(saved) : [];
      const updatedCustom = [newReview, ...existingCustom];
      localStorage.setItem('dcard_user_reviews', JSON.stringify(updatedCustom));
      setReviewsList([newReview, ...reviewsList]);
    } catch (err) {
      setReviewsList([newReview, ...reviewsList]);
    }

    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsWriteModalOpen(false);
      setReviewText('');
      setCardName('');
    }, 1200);
  };

  return (
    <section id="reviews" className="py-10 mt-8 select-none">
      <div className="border-b border-[#E5E7EB] dark:border-slate-800 mb-10" />

      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-bold text-[#1F2937] dark:text-white tracking-tight">User Reviews & Experiences</h2>
          <p className="text-xs sm:text-sm font-normal text-[#6B7280] dark:text-slate-400 mt-1">
            Trusted by thousands of debit card users across India
          </p>
        </div>

        <button
          onClick={() => setIsWriteModalOpen(true)}
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white font-semibold text-xs tracking-wider uppercase shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Write a Review</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviewsList.slice(0, 5).map((review, index) => (
          <div
            key={review.id}
            className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-soft flex flex-col group text-left relative overflow-hidden"
          >
            {review.isUserSubmitted && (
              <span className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">
                ✓ Verified Review
              </span>
            )}

            {/* Stars */}
            <div className="flex mb-3 gap-0.5 select-none items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating ? 'fill-[#2563EB] text-[#2563EB]' : 'text-slate-300 dark:text-slate-700'
                  }`}
                />
              ))}
              <span className="ml-2 text-xs font-bold text-[#2563EB] dark:text-[#60A5FA]">{review.rating}.0</span>
            </div>

            {review.cardName && (
              <p className="text-[11px] font-semibold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wider mb-2">
                {review.cardName}
              </p>
            )}

            <p className="text-[#1F2937] dark:text-slate-200 italic mb-5 flex-grow leading-relaxed text-xs sm:text-sm font-normal">
              "{review.text}"
            </p>

            <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[#E5E7EB] dark:border-slate-800">
              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white flex-shrink-0 shadow-sm bg-gradient-to-br from-[#2563EB] to-[#3B82F6]"
              >
                {review.user?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-xs sm:text-sm text-[#1F2937] dark:text-white truncate">{review.user}</p>
                <p className="text-xs text-[#6B7280] dark:text-slate-400 truncate">{review.role || 'Cardholder'}</p>
              </div>
            </div>
          </div>
        ))}

        {/* 6th Card: Interactive Contact & Feedback Card */}
        <motion.div
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenContact}
          className="p-6 rounded-3xl bg-gradient-to-br from-[#2563EB]/5 to-[#3B82F6]/10 border border-[#2563EB]/20 text-left relative overflow-hidden group cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-[#2563EB] flex items-center justify-center shadow-md text-white mb-4">
              <Mail className="w-5 h-5 text-white" />
            </div>

            <h3 className="text-lg font-bold text-[#1F2937] dark:text-white tracking-tight leading-tight">
              Have Questions or Feedback?
            </h3>

            <p className="text-xs text-[#6B7280] dark:text-slate-400 mt-2 leading-relaxed font-normal">
              Can't find a specific bank's debit card, or noticed an error in our charges sheet? Contact our research team.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#2563EB]/15 flex items-center justify-between">
            <span className="text-[11px] text-[#2563EB] dark:text-[#60A5FA] font-semibold uppercase tracking-wider group-hover:translate-x-1 transition-transform flex items-center gap-1">
              <span>Get in Touch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
            <span className="text-[9px] text-[#6B7280] dark:text-slate-400 font-semibold uppercase bg-white dark:bg-slate-800 px-2.5 py-1 rounded-full border border-[#E5E7EB] dark:border-slate-700">
              Avg. Reply: 24h
            </span>
          </div>
        </motion.div>
      </div>

      {/* ── WRITE A REVIEW MODAL ── */}
      <AnimatePresence>
        {isWriteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-2xl relative text-left"
            >
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F8FAFC] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 text-[#6B7280] dark:text-slate-300 font-bold flex items-center justify-center hover:text-[#2563EB] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-6">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#2563EB] dark:text-[#60A5FA]">Community Feedback</span>
                <h3 className="text-2xl font-bold text-[#1F2937] dark:text-white mt-1">Share Your Card Experience</h3>
              </div>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h4 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Review Submitted!</h4>
                  <p className="text-xs text-[#6B7280] dark:text-slate-300">Thank you for helping the D.CARD community.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1F2937] dark:text-slate-300 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900 text-xs font-normal text-[#1F2937] dark:text-white outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#1F2937] dark:text-slate-300 mb-1">Occupation / Profile</label>
                      <select
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900 text-xs font-normal text-[#1F2937] dark:text-white outline-none focus:border-[#2563EB] cursor-pointer"
                      >
                        <option value="Student">Student</option>
                        <option value="Working Professional">Working Professional</option>
                        <option value="Freelancer">Freelancer</option>
                        <option value="Entrepreneur">Entrepreneur</option>
                        <option value="Senior Citizen">Senior Citizen</option>
                        <option value="Healthcare Worker">Healthcare Worker</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1F2937] dark:text-slate-300 mb-1">Star Rating</label>
                      <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900 text-xs font-normal text-[#1F2937] dark:text-white outline-none focus:border-[#2563EB] cursor-pointer"
                      >
                        <option value={5}>5 Stars ★★★★★ (Excellent)</option>
                        <option value={4}>4 Stars ★★★★☆ (Good)</option>
                        <option value={3}>3 Stars ★★★☆☆ (Average)</option>
                        <option value={2}>2 Stars ★★☆☆☆ (Below Average)</option>
                        <option value={1}>1 Star ★☆☆☆☆ (Poor)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F2937] dark:text-slate-300 mb-1">Debit Card Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. HDFC Platinum Debit Card"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900 text-xs font-normal text-[#1F2937] dark:text-white outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F2937] dark:text-slate-300 mb-1">Your Review</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share what you like or dislike about your debit card (fees, lounge access, limits, cashback)..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900 text-xs font-normal text-[#1F2937] dark:text-white outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsWriteModalOpen(false)}
                      className="px-5 py-2.5 rounded-full border border-[#E5E7EB] dark:border-slate-700 text-xs font-semibold text-[#6B7280] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white text-xs font-semibold uppercase tracking-wider shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default ReviewSection;
