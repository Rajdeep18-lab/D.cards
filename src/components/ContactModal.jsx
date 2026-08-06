import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { contactService } from '../services/contactService';

function ContactModal({ isOpen, onClose }) {
  const toast = useToast();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    subject: 'Debit Card Eligibility & Offers',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedQuery, setSubmittedQuery] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.mobile.trim()) e.mobile = 'Mobile Number is required';
    else if (!/^[0-9+\-\s]{8,15}$/.test(form.mobile.trim())) e.mobile = 'Enter a valid mobile number (8-15 digits)';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim()) e.message = 'Message is required';
    else if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters';
    return e;
  };

  const handleChange = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);

    try {
      const res = await contactService.submitQuery({
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        subject: form.subject,
        message: form.message
      });

      setSubmittedQuery(res);
      toast('Query submitted successfully! Our support team will reply to your email shortly ✉️', 'success', 5000);
      setTimeout(() => {
        setSubmittedQuery(null);
        setForm({
          name: '',
          email: '',
          mobile: '',
          subject: 'Debit Card Eligibility & Offers',
          message: ''
        });
        onClose();
      }, 3000);
    } catch (err) {
      toast(err.message || 'Failed to submit contact query. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#1E0B16]/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white/95 dark:bg-[#120710]/95 border border-roseGold/20 shadow-2xl backdrop-blur-2xl p-6 sm:p-8 z-[1201]"
        >
          {/* Close X Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 flex items-center justify-center text-slate-500 dark:text-slate-300 transition-all cursor-pointer"
          >
            ✕
          </button>

          {submittedQuery ? (
            /* Success View */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-10 text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 text-3xl flex items-center justify-center mx-auto border border-emerald-500/30">
                ✓
              </div>
              <h3 className="text-2xl font-black font-serif text-slate-900 dark:text-white">
                Query Received!
              </h3>
              <p className="text-xs text-textSoft dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                Thank you <strong className="text-roseGold">{submittedQuery.name}</strong>. Your query has been logged under ID:
              </p>

              <div className="inline-block px-4 py-2 rounded-xl bg-roseGold/10 border border-roseGold/30 text-roseGold dark:text-pink-300 font-mono text-sm font-black">
                {submittedQuery.query_id}
              </div>

              <p className="text-[11px] text-slate-400 pt-2">
                Our Founder / Support Team will review your inquiry and email you a response at <strong className="text-slate-300">{submittedQuery.email}</strong>.
              </p>
            </motion.div>
          ) : (
            /* Contact Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Header */}
              <div className="flex items-center gap-3 pb-2 border-b border-slate-200 dark:border-white/10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-roseGold to-secondary flex items-center justify-center text-white text-xl shadow-md flex-shrink-0">
                  📩
                </div>
                <div>
                  <h2 className="text-xl font-black font-serif text-slate-900 dark:text-white">
                    Contact & Support Desk
                  </h2>
                  <p className="text-xs text-textSoft dark:text-slate-400">
                    Get in touch directly with our leadership and support team.
                  </p>
                </div>
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-black/40 border text-slate-900 dark:text-white outline-none transition-all ${
                      errors.name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-roseGold/20 focus:border-roseGold'
                    }`}
                  />
                  {errors.name && <p className="text-[10px] text-rose-500">{errors.name}</p>}
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="rahul@example.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-black/40 border text-slate-900 dark:text-white outline-none transition-all ${
                      errors.email ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-roseGold/20 focus:border-roseGold'
                    }`}
                  />
                  {errors.email && <p className="text-[10px] text-rose-500">{errors.email}</p>}
                </div>

                {/* Mobile Number */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={(e) => handleChange('mobile', e.target.value)}
                    placeholder="+91 98765 43210"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-black/40 border text-slate-900 dark:text-white outline-none transition-all ${
                      errors.mobile ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-roseGold/20 focus:border-roseGold'
                    }`}
                  />
                  {errors.mobile && <p className="text-[10px] text-rose-500">{errors.mobile}</p>}
                </div>

                {/* Subject */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Subject <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    placeholder="e.g. Card Inquiry / Feature Request"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-black/40 border text-slate-900 dark:text-white outline-none transition-all ${
                      errors.subject ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-roseGold/20 focus:border-roseGold'
                    }`}
                  />
                  {errors.subject && <p className="text-[10px] text-rose-500">{errors.subject}</p>}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  placeholder="Describe your inquiry, question, or request in detail..."
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-black/40 border text-slate-900 dark:text-white outline-none transition-all resize-none ${
                    errors.message ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-roseGold/20 focus:border-roseGold'
                  }`}
                />
                {errors.message && <p className="text-[10px] text-rose-500">{errors.message}</p>}
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-roseGold to-secondary text-white text-xs font-bold hover:opacity-95 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Submitting to Firestore...' : 'Submit Support Query ➔'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ContactModal;
