import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { topCards, debitCards } from '../data/mockData';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../hooks/useAuth';

const RANK_STYLES = [
  { bg: 'linear-gradient(135deg,#FFD700,#FFA500)', shadow: 'rgba(255,185,0,0.5)', crown: '👑', textColor: '#7a5500', label: 'Gold Pick' },
  { bg: 'linear-gradient(135deg,#C0C0C0,#9E9E9E)', shadow: 'rgba(180,180,180,0.45)', crown: '🥈', textColor: '#444', label: 'Silver Pick' },
  { bg: 'linear-gradient(135deg,#CD7F32,#A0522D)', shadow: 'rgba(180,100,30,0.45)', crown: '🥉', textColor: '#6b3a1f', label: 'Bronze Pick' },
];

function RatingBar({ value }) {
  const pct = (value / 5) * 100;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
      <div style={{ flex: 1, height: '4px', borderRadius: '99px', background: 'rgba(122,15,82,0.1)', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
          style={{ height: '100%', borderRadius: '99px', background: pct >= 94 ? 'linear-gradient(90deg,#FFD700,#FFA500)' : 'linear-gradient(90deg,#A30D62,#C21875)' }}
        />
      </div>
      <span style={{ fontSize: '10px', fontWeight: '800', color: '#7A0F52' }}>{value}★</span>
    </div>
  );
}

function TopCardItem({ card, index, onViewDetails }) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user, openAuthModal } = useAuth();
  
  const fullCard = debitCards.find(c => c.id === card.id) || card;
  const wishlisted = isWishlisted(fullCard.id);
  const isTop3 = index < 3;
  const rs = RANK_STYLES[index] || RANK_STYLES[2];

  const cardName = fullCard.cardName || fullCard.name || "Debit Card";
  const bankName = fullCard.bank || "Partner Bank";
  const ratingVal = fullCard.rating || 4.5;
  const feeText = typeof fullCard.annualFee === 'number' 
    ? (fullCard.annualFee === 0 ? 'FREE' : `₹${fullCard.annualFee}`) 
    : (fullCard.fee || 'FREE');
  const cashbackText = fullCard.cashbackPct ? `${fullCard.cashbackPct}%` : 'Rewards';
  const benefitHighlight = String(fullCard.benefits || "Premium bank perks & rewards").split(',')[0];

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!user) {
      openAuthModal('required', `save-card-${fullCard.id}`);
      return;
    }
    toggleWishlist(fullCard);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.055, type: 'spring', stiffness: 230, damping: 22 }}
      whileHover={{ y: -7, scale: 1.022, transition: { duration: 0.25 } }}
      onClick={() => onViewDetails && onViewDetails(fullCard)}
      style={{
        minWidth: isTop3 ? '296px' : '264px',
        flexShrink: 0,
        position: 'relative',
        borderRadius: '20px',
        padding: isTop3 ? '22px 18px 16px' : '18px 16px 14px',
        cursor: 'pointer',
        background: isTop3
          ? 'var(--bg-card-top3)'
          : 'var(--bg-card)',
        border: isTop3
          ? `1.5px solid ${index === 0 ? 'rgba(255,185,0,0.4)' : index === 1 ? 'rgba(190,190,190,0.4)' : 'rgba(180,100,30,0.35)'}`
          : '1px solid var(--border-color)',
        backdropFilter: 'blur(16px)',
        boxShadow: isTop3
          ? `0 8px 32px ${rs.shadow}, 0 2px 8px rgba(122,15,82,0.07)`
          : 'var(--card-shadow)',
        scrollSnapAlign: 'start',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top accent line */}
      {isTop3 && (
        <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '2.5px', borderRadius: '99px', background: rs.bg }} />
      )}

      {/* Rank badge */}
      <motion.div
        initial={{ scale: 0, rotate: -15 }} animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: index * 0.055 + 0.25, type: 'spring', stiffness: 400, damping: 18 }}
        style={{
          position: 'absolute', top: '-13px', left: '16px',
          background: isTop3 ? rs.bg : 'linear-gradient(135deg,#7A0F52,#C21875)',
          borderRadius: '99px', padding: '3px 11px',
          fontSize: isTop3 ? '12px' : '10px', fontWeight: '900',
          color: isTop3 ? rs.textColor : 'white',
          boxShadow: `0 3px 10px ${isTop3 ? rs.shadow : 'rgba(122,15,82,0.4)'}`,
          border: '2px solid rgba(255,255,255,0.8)',
          letterSpacing: '0.04em', zIndex: 3,
        }}
      >
        {isTop3 ? `${rs.crown} #${index + 1} ${rs.label}` : `#${index + 1}`}
      </motion.div>

      {/* Wishlist Button */}
      <motion.button
        whileTap={{ scale: 0.75 }}
        onClick={handleWishlist}
        title={wishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
        style={{
          position: 'absolute', top: '12px', right: '12px', zIndex: 3,
          width: '32px', height: '32px', borderRadius: '99px',
          border: '1px solid rgba(122,15,82,0.18)',
          background: wishlisted ? 'rgba(194,24,117,0.12)' : 'var(--bg-chip)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px', transition: 'all 0.2s ease',
        }}
      >
        {wishlisted ? '❤️' : '🤍'}
      </motion.button>

      {/* Bank name + Card title */}
      <div style={{ marginTop: '12px', marginBottom: '8px' }}>
        <span style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-soft)' }}>
          {bankName}
        </span>
        <h3 style={{ fontSize: isTop3 ? '15px' : '13.5px', fontWeight: '800', margin: '2px 0 0', lineHeight: '1.25', color: 'var(--text-dark)' }}>
          {cardName}
        </h3>
      </div>

      <RatingBar value={ratingVal} />

      {/* Key metric highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', margin: '12px 0', padding: '8px 10px', borderRadius: '12px', background: 'var(--bg-chip)', border: '1px solid var(--border-subtle)' }}>
        <div>
          <span style={{ fontSize: '9px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Annual Fee</span>
          <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-dark)', marginTop: '1px' }}>
            {feeText}
          </div>
        </div>
        <div>
          <span style={{ fontSize: '9px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cashback</span>
          <div style={{ fontSize: '12px', fontWeight: '800', color: '#C21875', marginTop: '1px' }}>
            {cashbackText}
          </div>
        </div>
      </div>

      {/* Benefit highlight tag */}
      <p style={{ fontSize: '11px', color: 'var(--text-soft)', margin: '0 0 14px', lineHeight: '1.4', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        🎁 {benefitHighlight}
      </p>

      {/* Footer Specs link */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
        <span style={{ fontSize: '11px', fontWeight: '700', color: '#A30D62' }}>View Specs & Limits</span>
        <span style={{ fontSize: '14px', color: '#C21875', fontWeight: '900' }}>→</span>
      </div>
    </motion.div>
  );
}

export default function TopCardsSection({ onViewDetails }) {
  const scrollRef = useRef(null);

  return (
    <section style={{ margin: '36px 0 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <span className="mb-1 inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/10 text-secondary dark:text-roseGold text-[10px] font-black tracking-widest uppercase rounded-full select-none">
            ⭐ EDITORS' CHOICE
          </span>
          <h2 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-dark)', margin: '4px 0 0', fontFamily: 'Georgia, serif' }}>
            Highest Ranked Debit Cards
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
            style={{ width: '34px', height: '34px', borderRadius: '99px', border: '1px solid var(--border-color)', background: 'var(--bg-chip)', cursor: 'pointer', fontWeight: '900' }}
          >
            ←
          </button>
          <button
            onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
            style={{ width: '34px', height: '34px', borderRadius: '99px', border: '1px solid var(--border-color)', background: 'var(--bg-chip)', cursor: 'pointer', fontWeight: '900' }}
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="custom-scrollbar"
        style={{
          display: 'flex', gap: '14px', overflowX: 'auto', padding: '14px 4px',
          scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
        }}
      >
        {topCards.map((card, idx) => (
          <TopCardItem key={card.id} card={card} index={idx} onViewDetails={onViewDetails} />
        ))}
      </div>
    </section>
  );
}
