import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle2, Phone, Clock, ShieldCheck, HelpCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { contactService } from '../services/contactService';

function ContactPage() {
  const toast = useToast();

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
      }, 3000);
    } catch (err) {
      toast(err.message || 'Failed to submit contact query. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 relative z-20 space-y-12 text-left select-none">
      {/* Page Header */}
      <div className="border-b border-[#E5E7EB] dark:border-slate-800 pb-8">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] text-xs font-semibold tracking-widest uppercase border border-[#2563EB]/20 mb-2">
          <Phone className="w-3.5 h-3.5" />
          ONLINE SUPPORT & INQUIRIES
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1F2937] dark:text-white tracking-tight">
          Contact Support Desk
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 mt-2 max-w-2xl font-normal leading-relaxed">
          Have questions about savings accounts, debit card eligibility, bank fee disclosures, or feature comparisons? Submit your inquiry to our support team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Side: Support Information Channels */}
        <div className="lg:col-span-5 space-y-6 text-left">
          
          {/* Note Banner */}
          <div className="p-5 rounded-3xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 space-y-2">
            <div className="flex items-center gap-2 text-[#2563EB] dark:text-[#60A5FA]">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Independent Support Platform</h4>
            </div>
            <p className="text-xs text-[#6B7280] dark:text-slate-300 leading-relaxed font-normal">
              D.CARD is an independent comparison and financial information platform covering Savings Accounts and Debit Cards. We answer queries regarding public fee disclosures, interest rates, lounge rules, and product specifications.
            </p>
          </div>

          {/* Quick Channels */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-soft space-y-5">
            <h3 className="text-lg font-bold text-[#1F2937] dark:text-white tracking-tight flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#2563EB]" />
              <span>Direct Assistance Channels</span>
            </h3>

            <div className="space-y-4 pt-1">
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA] flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">Official Email Support</p>
                  <p className="text-xs font-bold text-[#1F2937] dark:text-white">support@dcard.in</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA] flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">Average SLA Response</p>
                  <p className="text-xs font-bold text-[#1F2937] dark:text-white">Within 24 business hours</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA] flex-shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">AI Instant Assistant</p>
                  <p className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA]">Available 24/7 via D.CARD AI Advisor</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Support Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-9 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-soft text-left space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#1F2937] dark:text-white">
                Send Us a Message
              </h3>
              <p className="text-xs text-[#6B7280] dark:text-slate-400 mt-1 font-normal">
                Fill out the form below and our team will get back to you promptly.
              </p>
            </div>

            {submittedQuery ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center text-3xl mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-[#1F2937] dark:text-white">Query Received!</h3>
                <p className="text-xs text-[#6B7280] dark:text-slate-300 max-w-md mx-auto leading-relaxed font-normal">
                  Thank you, <strong>{submittedQuery.name}</strong>. Reference ID: <span className="text-[#2563EB] dark:text-[#60A5FA] font-bold">{submittedQuery.id}</span>. We'll send an update to {submittedQuery.email}.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1F2937] dark:text-slate-300 uppercase tracking-wider mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-slate-900 border text-xs text-[#1F2937] dark:text-white outline-none transition-colors ${
                        errors.name ? 'border-[#EF4444] ring-1 ring-[#EF4444]' : 'border-[#E5E7EB] dark:border-slate-700 focus:border-[#2563EB]'
                      }`}
                    />
                    {errors.name && <p className="text-[10px] font-semibold text-[#EF4444] mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F2937] dark:text-slate-300 uppercase tracking-wider mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="rahul@example.com"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-slate-900 border text-xs text-[#1F2937] dark:text-white outline-none transition-colors ${
                        errors.email ? 'border-[#EF4444] ring-1 ring-[#EF4444]' : 'border-[#E5E7EB] dark:border-slate-700 focus:border-[#2563EB]'
                      }`}
                    />
                    {errors.email && <p className="text-[10px] font-semibold text-[#EF4444] mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1F2937] dark:text-slate-300 uppercase tracking-wider mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      value={form.mobile}
                      onChange={(e) => handleChange('mobile', e.target.value)}
                      placeholder="+91 9876543210"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-slate-900 border text-xs text-[#1F2937] dark:text-white outline-none transition-colors ${
                        errors.mobile ? 'border-[#EF4444] ring-1 ring-[#EF4444]' : 'border-[#E5E7EB] dark:border-slate-700 focus:border-[#2563EB]'
                      }`}
                    />
                    {errors.mobile && <p className="text-[10px] font-semibold text-[#EF4444] mt-1">{errors.mobile}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F2937] dark:text-slate-300 uppercase tracking-wider mb-1">Subject Topic *</label>
                    <select
                      value={form.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-slate-900 border text-xs font-semibold text-[#1F2937] dark:text-white outline-none transition-colors cursor-pointer ${
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
                    {errors.subject && <p className="text-[10px] font-semibold text-[#EF4444] mt-1">{errors.subject}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] dark:text-slate-300 uppercase tracking-wider mb-1">Message Detail *</label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder="Describe your inquiry or question in detail..."
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-slate-900 border text-xs text-[#1F2937] dark:text-white outline-none transition-colors resize-none ${
                      errors.message ? 'border-[#EF4444] ring-1 ring-[#EF4444]' : 'border-[#E5E7EB] dark:border-slate-700 focus:border-[#2563EB]'
                    }`}
                  />
                  {errors.message && <p className="text-[10px] font-semibold text-[#EF4444] mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:opacity-95 text-white font-semibold text-xs tracking-wider uppercase shadow-md active:scale-98 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting Inquiry...' : 'Submit Support Inquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default ContactPage;
