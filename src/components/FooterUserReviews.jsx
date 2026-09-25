import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, AlertCircle } from 'lucide-react';

const REVIEWS_STORAGE_KEY = 'dcard_user_reviews';

/**
 * Storage helpers - modular so a database/backend API can easily replace this.
 */
export function getStoredReviews() {
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Could not read user reviews from localStorage:', e);
    return [];
  }
}

export function saveStoredReview(newReview) {
  try {
    const current = getStoredReviews();
    const updated = [newReview, ...current].slice(0, 50);
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('Could not save user review to localStorage:', e);
    return null;
  }
}

/**
 * Basic sensitive data pattern detector to protect user privacy.
 * Disallows card numbers, CVV, PIN, PAN, Aadhaar.
 */
function containsSensitiveData(text) {
  if (!text) return false;
  // 16-digit card numbers (grouped or contiguous)
  const cardPattern = /\b(?:\d[ -]?){15,16}\b/;
  // CVV / CVC mentions
  const cvvPattern = /\b(?:cvv|cvc)\s*[:=]?\s*\d{3,4}\b/i;
  // PIN mentions
  const pinPattern = /\b(?:pin|atm pin|upi pin)\s*[:=]?\s*\d{4,6}\b/i;
  // Indian PAN card pattern (5 letters, 4 digits, 1 letter)
  const panPattern = /\b[A-Z]{5}[0-9]{4}[A-Z]\b/i;
  // 12-digit Aadhaar pattern
  const aadhaarPattern = /\b\d{4}\s\d{4}\s\d{4}\b/;

  return (
    cardPattern.test(text) ||
    cvvPattern.test(text) ||
    pinPattern.test(text) ||
    panPattern.test(text) ||
    aadhaarPattern.test(text)
  );
}

function FooterUserReviews() {
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Load reviews on mount
  useEffect(() => {
    setReviews(getStoredReviews());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    const trimmedReview = reviewText.trim();
    const trimmedEmail = email.trim();

    // Validation
    if (!trimmedName || trimmedName.length < 2) {
      setError('Please enter your name (minimum 2 characters).');
      return;
    }

    if (trimmedName.length > 50) {
      setError('Name cannot exceed 50 characters.');
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      setError('Please select a star rating between 1 and 5.');
      return;
    }

    if (!trimmedReview || trimmedReview.length < 5) {
      setError('Please write your review (minimum 5 characters).');
      return;
    }

    if (trimmedReview.length > 1000) {
      setError('Review cannot exceed 1000 characters.');
      return;
    }

    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address, or leave it blank.');
      return;
    }

    // Sensitive info check
    if (containsSensitiveData(trimmedReview) || containsSensitiveData(trimmedName)) {
      setError('For your security, please do not share debit card numbers, CVV, PIN, PAN, Aadhaar or account details.');
      return;
    }

    const newReview = {
      id: `review-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: trimmedName,
      user: trimmedName,
      rating: Number(rating),
      text: trimmedReview,
      // Date formatted cleanly, e.g. "15 Sep 2026"
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      createdAt: new Date().toISOString()
      // Note: User's optional email is intentionally NOT stored or exposed in public review object
    };

    const updated = saveStoredReview(newReview);
    if (updated) {
      setReviews(updated);
    } else {
      setReviews((prev) => [newReview, ...prev]);
    }

    // Reset form state & notify
    setName('');
    setEmail('');
    setRating(5);
    setHoverRating(0);
    setReviewText('');
    setSuccessMessage('Thanks for your review! Your feedback has been submitted.');

    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  return (
    <div className="space-y-3.5">
      {/* 1. Heading & 2. Short Description */}
      <div>
        <h4 className="font-extrabold text-[#1F2937] dark:text-white text-sm tracking-tight">
          User Reviews
        </h4>
        <p className="text-xs text-[#6B7280] dark:text-slate-400 mt-1 leading-relaxed font-normal">
          Share your experience with D.CARD and help others make smarter banking decisions.
        </p>
      </div>

      {/* 3. Review Submission Card */}
      <form
        id="footer-review-form"
        onSubmit={handleSubmit}
        className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-[#E5E7EB] dark:border-slate-700 shadow-xs space-y-3 transition-colors"
      >
        <div className="space-y-2">
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            placeholder="Enter your name"
            maxLength={60}
            className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900 outline-none text-[#1F2937] dark:text-white placeholder-[#9CA3AF] dark:placeholder-slate-500 focus:border-[#2563EB] transition-colors"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            placeholder="Enter email (optional)"
            maxLength={80}
            className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900 outline-none text-[#1F2937] dark:text-white placeholder-[#9CA3AF] dark:placeholder-slate-500 focus:border-[#2563EB] transition-colors"
          />
        </div>

        {/* Star rating selector */}
        <div className="flex items-center justify-between py-0.5 px-0.5">
          <span className="text-[11px] font-semibold text-[#6B7280] dark:text-slate-400">
            Rating:
          </span>
          <div className="flex items-center gap-1" role="radiogroup" aria-label="Star rating selector">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-0.5 text-amber-400 hover:scale-115 transition-transform cursor-pointer focus:outline-none"
                title={`${star} Star${star > 1 ? 's' : ''}`}
                aria-label={`${star} Star${star > 1 ? 's' : ''}`}
              >
                <Star
                  className={`w-4 h-4 transition-colors ${
                    star <= (hoverRating || rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300 dark:text-slate-600'
                  }`}
                />
              </button>
            ))}
            <span className="text-xs font-extrabold text-[#2563EB] dark:text-[#60A5FA] ml-1 min-w-[20px] text-right">
              {hoverRating || rating}★
            </span>
          </div>
        </div>

        {/* Review Textarea */}
        <textarea
          rows={3}
          value={reviewText}
          onChange={(e) => {
            setReviewText(e.target.value);
            if (error) setError('');
          }}
          placeholder="Write your review about D.CARD..."
          maxLength={500}
          className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900 outline-none text-[#1F2937] dark:text-white placeholder-[#9CA3AF] dark:placeholder-slate-500 focus:border-[#2563EB] transition-colors resize-none leading-relaxed"
        />

        {/* Validation Error Message */}
        {error && (
          <div className="flex items-start gap-1.5 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-[11px] leading-tight">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:opacity-95 text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>Submit Review</span>
        </button>
      </form>

      {/* 4. Success Message */}
      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-2 animate-in fade-in duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-200 leading-snug">
            {successMessage}
          </p>
        </div>
      )}

      {/* 5. Reviews Display */}
      <div className="space-y-2">
        {reviews.length === 0 ? (
          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-800/40 border border-dashed border-[#E5E7EB] dark:border-slate-700/80 text-center">
            <p className="text-xs text-[#6B7280] dark:text-slate-400 font-normal leading-relaxed">
              No reviews yet. Be the first to share your experience!
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-[#E5E7EB] dark:border-slate-700 shadow-xs space-y-1.5 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#2563EB] to-[#3B82F6] text-white flex items-center justify-center text-[10px] font-extrabold shrink-0 shadow-xs">
                      {rev.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-xs font-bold text-[#1F2937] dark:text-white truncate">
                      {rev.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0" title={`${rev.rating} of 5 stars`}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
                          s <= rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[#4B5563] dark:text-slate-300 font-normal leading-relaxed break-words">
                  {rev.text}
                </p>
                <div className="flex justify-end pt-0.5">
                  <span className="text-[10px] text-[#9CA3AF] dark:text-slate-500 font-medium">
                    {rev.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FooterUserReviews;
