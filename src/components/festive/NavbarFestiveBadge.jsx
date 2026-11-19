import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useFestivalTheme } from '../../hooks/useFestivalTheme';

/**
 * NavbarFestiveBadge
 * 
 * Dynamically displays a refined festival badge in the navbar:
 * - In NORMAL MODE: returns null (completely disappears, clean navbar).
 * - In FESTIVAL MODE: renders bilingual label, festival icon, and festival-tailored gradient.
 * - Supports both "desktop" and "mobile" variants.
 */
export default function NavbarFestiveBadge({ variant = 'desktop', onCloseDrawer }) {
  const { isFestivalMode, activeFestival, theme } = useFestivalTheme();
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const location = useLocation();
  const navigate = useNavigate();

  // If Normal Mode or no active festival, render nothing
  if (!isFestivalMode || !activeFestival) {
    return null;
  }

  const badgeLabel = isHindi 
    ? (activeFestival.badgeLabelHi || activeFestival.nameHi) 
    : (activeFestival.badgeLabelEn || activeFestival.nameEn);

  const handleClick = (e) => {
    e.preventDefault();
    if (onCloseDrawer) onCloseDrawer();

    const targetId = 'festival-campaign';
    if (location.pathname === '/') {
      const el = document.getElementById(targetId) || document.getElementById('dhanteras-hero') || document.getElementById('home');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    // Navigate home with hash or target path
    navigate(activeFestival.ctaPath || '/');
  };

  if (variant === 'mobile') {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => { if (e.key === 'Enter') handleClick(e); }}
        className="block p-3 rounded-2xl text-white shadow-sm text-xs font-bold select-none cursor-pointer border transition-transform active:scale-[0.98]"
        style={{
          background: `linear-gradient(135deg, ${theme?.primaryColor || '#800020'}, ${theme?.secondaryColor || '#D97706'})`,
          borderColor: theme?.accentColor ? `${theme.accentColor}55` : 'rgba(251, 191, 36, 0.4)'
        }}
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="text-base">{activeFestival.badgeIcon || '✨'}</span>
            <span className="font-semibold">{badgeLabel}</span>
          </span>
          <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-white/20 text-white">
            ➔
          </span>
        </div>
      </div>
    );
  }

  // Desktop variant
  return (
    <a
      href="#festival-campaign"
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-[11px] font-bold tracking-wide shadow-sm hover:shadow-md hover:scale-105 transition-all cursor-pointer shrink-0 ml-1.5 xl:ml-2.5 mr-2 xl:mr-4 select-none border"
      style={{
        background: `linear-gradient(135deg, ${theme?.primaryColor || '#800020'}, ${theme?.secondaryColor || '#D97706'})`,
        borderColor: theme?.accentColor ? `${theme.accentColor}66` : 'rgba(251, 191, 36, 0.4)'
      }}
      title={`${activeFestival.badgeIcon || '✨'} ${badgeLabel}`}
    >
      <span className="text-xs">{activeFestival.badgeIcon || '✨'}</span>
      <span className="whitespace-nowrap">{badgeLabel}</span>
    </a>
  );
}
