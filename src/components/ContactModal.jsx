import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, CheckCircle2, Send, X } from 'lucide-react';
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
      toast('Query submitted successfully! Our support team will reply to your email shortly.', 'success', 5000);
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
          className="fixed inset-0 bg-[#0F172A]/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-2xl backdrop-blur-2xl p-6 sm:p-8 z-[1201] text-left"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F8FAFC] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 flex items-center justify-center text-[#6B7280] dark:text-slate-300 hover:text-[#2563EB] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {submittedQuery ? (
            /* Success View */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-10 text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 text-3xl flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-[#1F2937] dark:text-white">
                Query Received!
              </h3>
              <p className="text-xs text-[#6B7280] dark:text-slate-300 max-w-sm mx-auto leading-relaxed font-normal">
                Thank you <strong className="text-[#2563EB] dark:text-[#60A5FA]">{submittedQuery.name}</strong>. Reference ID:
              </p>

              <div className="inline-block px-4 py-2 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/30 text-[#2563EB] dark:text-[#60A5FA] text-xs font-bold">
                {submittedQuery.query_id}
              </div>

              <p className="text-[11px] text-[#6B7280] dark:text-slate-400 pt-2 font-normal">
                Our support team will review your inquiry and email you a response at <strong className="text-[#1F2937] dark:text-white">{submittedQuery.email}</strong>.
              </p>
            </motion.div>
          ) : (
            /* Contact Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Header */}
              <div className="flex items-center gap-3.5 pb-3 border-b border-[#E5E7EB] dark:border-slate-800">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center text-white text-xl shadow-md shadow-[#2563EB]/20 flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1F2937] dark:text-white">
                    Contact Support Desk
                  </h2>
                  <p className="text-xs text-[#6B7280] dark:text-slate-400 font-normal">
                    Get in touch directly with our support team.
                  </p>
                </div>
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#1F2937] dark:text-slate-300">
                    Full Name <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#F8FAFC] dark:bg-slate-900 border text-[#1F2937] dark:text-white outline-none transition-all ${
                      errors.name ? 'border-[#EF4444] ring-1 ring-[#EF4444]' : 'border-[#E5E7EB] dark:border-slate-700 focus:border-[#2563EB]'
                    }`}
                  />
                  {errors.name && <p className="text-[10px] text-[#EF4444] font-semibold">{errors.name}</p>}
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#1F2937] dark:text-slate-300">
                    Email Address <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="rahul@example.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#F8FAFC] dark:bg-slate-900 border text-[#1F2937] dark:text-white outline-none transition-all ${
                      errors.email ? 'border-[#EF4444] ring-1 ring-[#EF4444]' : 'border-[#E5E7EB] dark:border-slate-700 focus:border-[#2563EB]'
                    }`}
                  />
                  {errors.email && <p className="text-[10px] text-[#EF4444] font-semibold">{errors.email}</p>}
                </div>

                {/* Mobile Number */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#1F2937] dark:text-slate-300">
                    Mobile Number <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={(e) => handleChange('mobile', e.target.value)}
                    placeholder="+91 98765 43210"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#F8FAFC] dark:bg-slate-900 border text-[#1F2937] dark:text-white outline-none transition-all ${
                      errors.mobile ? 'border-[#EF4444] ring-1 ring-[#EF4444]' : 'border-[#E5E7EB] dark:border-slate-700 focus:border-[#2563EB]'
                    }`}
                  />
                  {errors.mobile && <p className="text-[10px] text-[#EF4444] font-semibold">{errors.mobile}</p>}
                </div>

                {/* Subject */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#1F2937] dark:text-slate-300">
                    Subject Topic <span className="text-[#EF4444]">*</span>
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#F8FAFC] dark:bg-slate-900 border text-[#1F2937] dark:text-white outline-none transition-all cursor-pointer font-semibold ${
                      errors.subject ? 'border-[#EF4444] ring-1 ring-[#EF4444]' : 'border-[#E5E7EB] dark:border-slate-700 focus:border-[#2563EB]'
                    }`}
                  >
                    <option value="Debit Card Eligibility & Offers">Debit Card Eligibility & Offers</option>
                    <option value="Lounge Access & Airport Perks">Lounge Access & Airport Perks</option>
                    <option value="Hidden Fee Disclosures">Hidden Fee Disclosures</option>
                    <option value="Data Correction Request">Data Correction Request</option>
                    <option value="Institutional Inquiries">Institutional Inquiries</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                  {errors.subject && <p className="text-[10px] text-[#EF4444] font-semibold">{errors.subject}</p>}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#1F2937] dark:text-slate-300">
                  Message Detail <span className="text-[#EF4444]">*</span>
                </label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  placeholder="Describe your inquiry or question in detail..."
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#F8FAFC] dark:bg-slate-900 border text-[#1F2937] dark:text-white outline-none transition-all resize-none ${
                    errors.message ? 'border-[#EF4444] ring-1 ring-[#EF4444]' : 'border-[#E5E7EB] dark:border-slate-700 focus:border-[#2563EB]'
                  }`}
                />
                {errors.message && <p className="text-[10px] text-[#EF4444] font-semibold">{errors.message}</p>}
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-slate-700 text-[#6B7280] dark:text-slate-300 text-xs font-semibold hover:bg-[#F8FAFC] dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white text-xs font-semibold hover:opacity-95 shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Submit Inquiry'}</span>
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
