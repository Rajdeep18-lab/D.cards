import React, { useState, useEffect } from 'react';
import { reviews as initialMockReviews } from '../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
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
      <div className="section-divider mb-10" />

      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-black font-serif text-gradient tracking-tight">User Reviews & Experiences</h2>
          <p className="text-sm font-semibold text-textSoft dark:text-[#D89AB6]/80 mt-1">
            Trusted by thousands of debit card users across India
          </p>
        </div>

        <button
          onClick={() => setIsWriteModalOpen(true)}
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-secondary/25 hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
        >
          <span>✍️</span> Write a Review
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviewsList.slice(0, 5).map((review, index) => (
          <div
            key={review.id}
            className="glass-panel glass-panel-hover premium-border p-6 rounded-2xl flex flex-col group text-left relative overflow-hidden"
            style={{ animation: `fade-in-up 0.6s ease-out ${index * 100}ms both` }}
          >
            {review.isUserSubmitted && (
              <span className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                ✓ Verified Review
              </span>
            )}

            {/* Stars */}
            <div className="flex mb-3 gap-0.5 select-none items-center">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-lg transition-transform group-hover:scale-110 ${
                    i < review.rating ? 'text-[#C21875]' : 'text-slate-300 dark:text-slate-700'
                  }`}
                >
                  ★
                </span>
              ))}
              <span className="ml-2 text-xs font-black text-secondary dark:text-roseGold">{review.rating}.0</span>
            </div>

            {review.cardName && (
              <p className="text-[11px] font-bold text-secondary dark:text-roseGold uppercase tracking-wider mb-2">
                💳 {review.cardName}
              </p>
            )}

            <p className="text-[#1E0B16]/90 dark:text-[#F5D9E8]/90 italic mb-5 flex-grow leading-relaxed text-sm font-medium font-serif">
              "{review.text}"
            </p>

            <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-200/60 dark:border-secondary/15">
              {/* Avatar */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white flex-shrink-0 shadow"
                style={{
                  background: 'linear-gradient(135deg, #7A0F52, #C21875)'
                }}
              >
                {review.user?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="font-black text-sm text-[#1E0B16] dark:text-[#F5D9E8] truncate">{review.user}</p>
                <p className="text-xs text-textSoft dark:text-[#D89AB6]/70 truncate">{review.role || 'Cardholder'}</p>
              </div>
            </div>
          </div>
        ))}

        {/* 6th Card: Interactive Contact & Feedback Card */}
        <motion.div
          whileHover={{ y: -6, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenContact}
          className="glass-panel glass-panel-hover premium-border p-6 rounded-2xl flex flex-col justify-between bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent text-left relative overflow-hidden group/contact cursor-pointer"
          style={{
            animation: `fade-in-up 0.6s ease-out 500ms both`
          }}
        >
          <div className="absolute -right-10 -top-10 w-24 h-24 rounded-full bg-secondary/10 blur-xl group-hover/contact:bg-secondary/20 transition-all duration-500 pointer-events-none" />

          <div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-xl shadow-sm mb-4 text-white">
              ✉️
            </div>

            <h3 className="text-lg font-black font-serif text-[#1E0B16] dark:text-[#F5D9E8] tracking-tight leading-tight">
              Have Questions or Feedback?
            </h3>

            <p className="text-xs text-textSoft dark:text-[#D89AB6]/80 mt-2.5 leading-relaxed font-semibold font-sans">
              Can't find a specific bank's debit card, or noticed an error in our charges sheet? Contact our research team.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-secondary/15 flex items-center justify-between">
            <span className="text-[10px] text-secondary dark:text-roseGold font-black uppercase tracking-wider group-hover/contact:translate-x-1 transition-transform duration-300">
              Get in Touch ➔
            </span>
            <span className="text-[9px] text-textMuted dark:text-slate-400 font-extrabold uppercase bg-slate-100 dark:bg-secondary/10 px-2.5 py-0.5 rounded-full">
              Avg. Reply: 24h
            </span>
          </div>
        </motion.div>
      </div>

      {/* ── WRITE A REVIEW MODAL ── */}
      <AnimatePresence>
        {isWriteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#120718] border border-slate-200 dark:border-secondary/30 shadow-2xl relative text-left"
            >
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 font-bold flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/20 cursor-pointer"
              >
                ✕
              </button>

              <div className="mb-6">
                <span className="text-xs font-black uppercase tracking-widest text-secondary dark:text-roseGold">Community Feedback</span>
                <h3 className="text-2xl font-black font-serif text-slate-900 dark:text-slate-100 mt-1">Share Your Card Experience</h3>
              </div>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="text-5xl">🎉</div>
                  <h4 className="text-xl font-black text-emerald-600 dark:text-emerald-400">Review Submitted!</h4>
                  <p className="text-xs text-textSoft dark:text-slate-300">Thank you for helping the D.Card community.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-secondary/20 bg-slate-50 dark:bg-black/40 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-secondary"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Occupation / Profile</label>
                      <select
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-secondary/20 bg-slate-50 dark:bg-black/40 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-secondary cursor-pointer"
                      >
                        <option value="Student">Student 🎓</option>
                        <option value="Working Professional">Working Professional 💼</option>
                        <option value="Freelancer">Freelancer 💻</option>
                        <option value="Entrepreneur">Entrepreneur 🚀</option>
                        <option value="Senior Citizen">Senior Citizen 👴</option>
                        <option value="Healthcare Worker">Healthcare Worker 🏥</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Star Rating</label>
                      <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-secondary/20 bg-slate-50 dark:bg-black/40 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-secondary cursor-pointer"
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
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Debit Card Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. HDFC Platinum Debit Card"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-secondary/20 bg-slate-50 dark:bg-black/40 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-secondary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Review</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share what you like or dislike about your debit card (fees, lounge access, limits, cashback)..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-secondary/20 bg-slate-50 dark:bg-black/40 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-secondary"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsWriteModalOpen(false)}
                      className="px-5 py-2.5 rounded-full border border-slate-200 dark:border-secondary/20 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-xs font-black uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                    >
                      Submit Review 🚀
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
