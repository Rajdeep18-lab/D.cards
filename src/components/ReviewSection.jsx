import React from 'react';
import { reviews } from '../data/mockData';
import { motion } from 'framer-motion';

function ReviewSection({ onOpenContact }) {
  return (
    <section id="reviews" className="py-10 mt-8 select-none">
      <div className="section-divider mb-10" />

      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold font-serif text-gradient mb-2">User Reviews</h2>
        <p className="text-sm text-textSoft dark:text-[#D89AB6]/70">Trusted by thousands of users comparing daily</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.slice(0, 5).map((review, index) => (
          <div key={review.id}
            className="glass-panel glass-panel-hover premium-border p-6 rounded-2xl flex flex-col group text-left"
            style={{ animation: `fade-in-up 0.6s ease-out ${index * 120}ms both` }}>

            {/* Stars */}
            <div className="flex mb-3 gap-0.5 select-none">
              {[...Array(5)].map((_, i) => (
                <span key={i}
                  className={`text-lg transition-transform group-hover:scale-110 ${i < review.rating ? 'text-[#C21875]' : 'text-[#E8D9E3]'}`}
                  style={{ transitionDelay: `${i * 30}ms` }}>
                  ★
                </span>
              ))}
            </div>

            <p className="text-[#1E0B16]/80 dark:text-[#F5D9E8]/80 italic mb-5 flex-grow leading-relaxed text-sm">
              "{review.text}"
            </p>

            <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[#E8D9E3]/60">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 shimmer-effect"
                style={{
                  background: 'linear-gradient(135deg, #8A0E5A, #C21875)',
                  boxShadow: '0 4px 12px rgba(122,15,82,0.3)'
                }}>
                {review.user.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-sm text-[#1E0B16] dark:text-[#F5D9E8]">{review.user}</p>
                <p className="text-xs text-textSoft dark:text-[#D89AB6]/70">{review.role}</p>
              </div>
            </div>
          </div>
        ))}

        {/* ── 6th Card: Balanced Inline Contact Card ── */}
        <motion.div 
          whileHover={{ y: -6, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenContact}
          className="glass-panel glass-panel-hover premium-border p-6 rounded-2xl flex flex-col justify-between bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent text-left relative overflow-hidden group/contact cursor-pointer"
          style={{ 
            animation: `fade-in-up 0.6s ease-out 600ms both`,
            boxShadow: '0 10px 30px rgba(134, 0, 56, 0.04)'
          }}
        >
          {/* Decorative glowing background orb */}
          <div className="absolute -right-10 -top-10 w-24 h-24 rounded-full bg-secondary/10 blur-xl group-hover/contact:bg-secondary/20 transition-all duration-500 pointer-events-none" />

          <div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-xl shadow-sm mb-4">
              ✉️
            </div>
            
            <h3 className="text-lg font-black font-serif text-[#1E0B16] dark:text-[#F5D9E8] tracking-tight leading-tight">
              Have Questions or Feedback?
            </h3>
            
            <p className="text-xs text-textSoft dark:text-[#D89AB6]/80 mt-2.5 leading-relaxed font-semibold font-sans">
              Can't find a specific bank's debit card, or noticed an error in our charges sheet? Let our research team know.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E8D9E3]/60 flex items-center justify-between">
            <span className="text-[10px] text-secondary dark:text-roseGold font-black uppercase tracking-wider group-hover/contact:translate-x-1 transition-transform duration-300">
              Get in Touch ➔
            </span>
            <span className="text-[9px] text-textMuted dark:text-slate-400 font-extrabold uppercase bg-slate-100 dark:bg-secondary/10 px-2.5 py-0.5 rounded-full">
              Avg. Reply: 24h
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default ReviewSection;
