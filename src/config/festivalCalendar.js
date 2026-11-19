/**
 * D.CARD Centralized Indian Festival & Special Occasion Calendar
 * 
 * Governance & Date Rules:
 * - Timezone: Asia/Kolkata (IST, UTC+5:30)
 * - Multi-year verified dates for Lunisolar & Islamic festivals (2025, 2026, 2027)
 * - Solar national holidays (Independence Day, Republic Day, Christmas, New Year) auto-apply for any year
 * - Easily maintainable: update periods year-by-year without modifying core application code
 */

export const FESTIVAL_SYSTEM_CONFIG = {
  // Master switch to enable/disable automatic festival theming globally (Default: disabled, stays in normal mode)
  isFestivalSystemEnabled: false,

  // Allow manual preview via URL param (e.g. ?festival=diwali) or session storage for testing
  previewAllowed: true,

  // Target timezone for accurate date detection
  timeZone: "Asia/Kolkata",

  // Check frequency in milliseconds for automatic day transition (default: 60 seconds)
  autoCheckIntervalMs: 60000,
};

/**
 * Verified Festival Definitions & Visual Theme Parameters
 */
export const FESTIVALS = [
  // ── 1. DIWALI & DHANTERAS (Festival of Lights & Prosperity) ──
  {
    id: "diwali",
    nameEn: "Diwali & Dhanteras",
    nameHi: "दीपावली व धनतेरस",
    badgeLabelEn: "Diwali Special",
    badgeLabelHi: "दिवाली स्पेशल",
    badgeIcon: "🪔",
    greetingEn: "Wishing You a Joyous & Prosperous Diwali",
    greetingHi: "शुभ दीपावली एवं धनतेरस की हार्दिक शुभकामनाएं",
    subtextEn: "Illuminate your financial journey with transparent, verified debit cards and zero-balance savings accounts.",
    subtextHi: "पारदर्शी और सत्यापित डेबिट कार्ड व बचत खातों के साथ अपनी वित्तीय यात्रा को नई समृद्धि दें।",
    ctaLabelEn: "Explore Festive Offers",
    ctaLabelHi: "विशेष ऑफर्स देखें",
    ctaPath: "/cards",
    periods: [
      { year: 2025, startDate: "2025-10-18", endDate: "2025-10-23" }, // Dhanteras (Oct 18) to Bhai Dooj (Oct 23)
      { year: 2026, startDate: "2026-11-05", endDate: "2026-11-10" }, // Dhanteras (Nov 06) to Bhai Dooj (Nov 10)
      { year: 2027, startDate: "2027-10-27", endDate: "2027-11-01" }, // Dhanteras (Oct 27) to Bhai Dooj (Nov 01)
    ],
    theme: {
      primaryColor: "#800020",      // Burgundy
      secondaryColor: "#D97706",    // Warm Amber
      accentColor: "#F59E0B",       // Radiant Gold
      highlightColor: "#EA580C",    // Deep Saffron
      badgeGradient: "from-[#800020] via-[#9F1239] to-[#D97706]",
      badgeBorder: "border-amber-400/40",
      badgeText: "text-amber-200",
      ambientGlow: "radial-gradient(ellipse_at_center, rgba(251,191,36,0.16) 0%, rgba(245,158,11,0.06) 50%, transparent 75%)",
      motifType: "diwali_diya_mandala",
      cssVars: {
        "--fest-primary": "#800020",
        "--fest-accent": "#F59E0B",
        "--fest-glow": "rgba(245, 158, 11, 0.2)"
      }
    }
  },

  // ── 2. HOLI (Festival of Colors & Joy) ──
  {
    id: "holi",
    nameEn: "Holi",
    nameHi: "होली",
    badgeLabelEn: "Happy Holi",
    badgeLabelHi: "होली स्पेशल",
    badgeIcon: "🎨",
    greetingEn: "Wishing You a Vibrant & Joyful Holi",
    greetingHi: "रंगों के पावन पर्व होली की हार्दिक शुभकामनाएं",
    subtextEn: "Add colors of prosperity and financial freedom to your life with smart banking choices.",
    subtextHi: "समझदार बैंकिंग विकल्पों के साथ अपने जीवन में वित्तीय स्वतंत्रता और समृद्धि के रंग भरें।",
    ctaLabelEn: "Discover Smart Cards",
    ctaLabelHi: "स्मार्ट कार्ड्स खोजें",
    ctaPath: "/cards",
    periods: [
      { year: 2025, startDate: "2025-03-13", endDate: "2025-03-15" },
      { year: 2026, startDate: "2026-03-02", endDate: "2026-03-04" },
      { year: 2027, startDate: "2027-03-21", endDate: "2027-03-23" },
    ],
    theme: {
      primaryColor: "#064E3B",      // Royal Indigo
      secondaryColor: "#E11D48",    // Rose Magenta
      accentColor: "#0D9488",       // Vibrant Teal
      highlightColor: "#F59E0B",    // Golden Gulal
      badgeGradient: "from-[#064E3B] via-[#E11D48] to-[#F59E0B]",
      badgeBorder: "border-pink-400/40",
      badgeText: "text-white",
      ambientGlow: "radial-gradient(ellipse_at_center, rgba(244,63,94,0.14) 0%, rgba(99,102,241,0.08) 50%, transparent 75%)",
      motifType: "holi_color_splash",
      cssVars: {
        "--fest-primary": "#064E3B",
        "--fest-accent": "#E11D48",
        "--fest-glow": "rgba(225, 29, 72, 0.22)"
      }
    }
  },

  // ── 3. CHRISTMAS (Season of Goodwill & Giving) ──
  {
    id: "christmas",
    nameEn: "Christmas",
    nameHi: "क्रिसमस",
    badgeLabelEn: "Merry Christmas",
    badgeLabelHi: "मेरी क्रिसमस",
    badgeIcon: "🎄",
    greetingEn: "Merry Christmas & Season's Greetings",
    greetingHi: "क्रिसमस के पावन पर्व की मंगलमय शुभकामनाएं",
    subtextEn: "Celebrate the season of giving with cards that reward every purchase and holiday getaway.",
    subtextHi: "हर खरीदारी और छुट्टियों पर विशेष रिवार्ड्स देने वाले कार्ड्स के साथ खुशियों का पर्व मनाएं।",
    ctaLabelEn: "Holiday Travel & Rewards",
    ctaLabelHi: "रिवार्ड कार्ड्स देखें",
    ctaPath: "/cards",
    fixedSolarDate: { startMonth: 12, startDay: 23, endMonth: 12, endDay: 26 },
    periods: [
      { year: 2025, startDate: "2025-12-23", endDate: "2025-12-26" },
      { year: 2026, startDate: "2026-12-23", endDate: "2026-12-26" },
      { year: 2027, startDate: "2027-12-23", endDate: "2027-12-26" },
    ],
    theme: {
      primaryColor: "#047857",      // Fir Emerald
      secondaryColor: "#DC2626",    // Holiday Crimson
      accentColor: "#F59E0B",       // Warm Gold
      highlightColor: "#EEF4EE",    // Crisp Frost
      badgeGradient: "from-[#047857] via-[#15803D] to-[#DC2626]",
      badgeBorder: "border-emerald-400/40",
      badgeText: "text-white",
      ambientGlow: "radial-gradient(ellipse_at_center, rgba(4,120,87,0.15) 0%, rgba(220,38,38,0.06) 50%, transparent 75%)",
      motifType: "christmas_snow_ribbon",
      cssVars: {
        "--fest-primary": "#047857",
        "--fest-accent": "#DC2626",
        "--fest-glow": "rgba(4, 120, 87, 0.22)"
      }
    }
  },

  // ── 4. EID (Eid al-Fitr & Eid al-Adha - Peace & Reflection) ──
  {
    id: "eid",
    nameEn: "Eid Mubarak",
    nameHi: "ईद मुबारक",
    badgeLabelEn: "Eid Mubarak",
    badgeLabelHi: "ईद मुबारक",
    badgeIcon: "🌙",
    greetingEn: "Eid Mubarak – Peace, Prosperity & Joy",
    greetingHi: "ईद मुबारक – अमन, खुशहाली और बरकत की दुआएं",
    subtextEn: "May this auspicious festival bring enduring financial peace and abundance to your family.",
    subtextHi: "यह मुबारक पर्व आपके जीवन में स्थायी वित्तीय शांति और समृद्धि लेकर आए।",
    ctaLabelEn: "Explore Accounts",
    ctaLabelHi: "खातों की तुलना करें",
    ctaPath: "/savings-accounts",
    periods: [
      // Eid al-Fitr
      { year: 2025, startDate: "2025-03-30", endDate: "2025-04-01" },
      // Eid al-Adha
      { year: 2025, startDate: "2025-06-06", endDate: "2025-06-08" },
      // Eid al-Fitr
      { year: 2026, startDate: "2026-03-19", endDate: "2026-03-21" },
      // Eid al-Adha
      { year: 2026, startDate: "2026-05-26", endDate: "2026-05-28" },
      // Eid al-Fitr
      { year: 2027, startDate: "2027-03-09", endDate: "2027-03-11" },
      // Eid al-Adha
      { year: 2027, startDate: "2027-05-15", endDate: "2027-05-17" },
    ],
    theme: {
      primaryColor: "#065F46",      // Deep Islamic Emerald
      secondaryColor: "#047857",    // Emerald Green
      accentColor: "#D97706",       // Celestial Gold
      highlightColor: "#0F172A",    // Starry Night Navy
      badgeGradient: "from-[#065F46] via-[#047857] to-[#D97706]",
      badgeBorder: "border-emerald-400/40",
      badgeText: "text-emerald-100",
      ambientGlow: "radial-gradient(ellipse_at_center, rgba(5,150,105,0.16) 0%, rgba(217,119,6,0.06) 50%, transparent 75%)",
      motifType: "eid_crescent_arabesque",
      cssVars: {
        "--fest-primary": "#065F46",
        "--fest-accent": "#D97706",
        "--fest-glow": "rgba(5, 150, 105, 0.22)"
      }
    }
  },

  // ── 5. GURU NANAK JAYANTI (Gurpurab - Divine Light & Wisdom) ──
  {
    id: "gurpurab",
    nameEn: "Guru Nanak Jayanti",
    nameHi: "गुरु नानक जयंती",
    badgeLabelEn: "Gurpurab Special",
    badgeLabelHi: "गुरुपर्व विशेष",
    badgeIcon: "ੴ",
    greetingEn: "Happy Guru Nanak Jayanti (Gurpurab)",
    greetingHi: "गुरुपर्व की आप सभी को लख-लख बधाई",
    subtextEn: "Embrace the divine teachings of truthful living, hard work, and shared community welfare.",
    subtextHi: "सत्य, ईमानदारी और लोक-कल्याण के पावन संदेश को आत्मसात करें।",
    ctaLabelEn: "Transparent Banking",
    ctaLabelHi: "पारदर्शी बैंकिंग",
    ctaPath: "/cards",
    periods: [
      { year: 2025, startDate: "2025-11-04", endDate: "2025-11-06" },
      { year: 2026, startDate: "2026-11-23", endDate: "2026-11-25" },
      { year: 2027, startDate: "2027-11-13", endDate: "2027-11-15" },
    ],
    theme: {
      primaryColor: "#B45309",      // Divine Amber
      secondaryColor: "#D97706",    // Golden Saffron
      accentColor: "#F59E0B",       // Radiant Sun Gold
      highlightColor: "#1E293B",    // Serene Navy
      badgeGradient: "from-[#B45309] via-[#D97706] to-[#F59E0B]",
      badgeBorder: "border-amber-400/40",
      badgeText: "text-amber-100",
      ambientGlow: "radial-gradient(ellipse_at_center, rgba(245,158,11,0.16) 0%, rgba(180,83,9,0.06) 50%, transparent 75%)",
      motifType: "gurpurab_divine_light",
      cssVars: {
        "--fest-primary": "#B45309",
        "--fest-accent": "#F59E0B",
        "--fest-glow": "rgba(245, 158, 11, 0.22)"
      }
    }
  },

  // ── 6. LOHRI / MAKAR SANKRANTI / PONGAL (Harvest & Warmth) ──
  {
    id: "lohri",
    nameEn: "Lohri & Makar Sankranti",
    nameHi: "लोहड़ी व मकर संक्रांति",
    badgeLabelEn: "Lohri & Sankranti",
    badgeLabelHi: "लोहड़ी व संक्रांति",
    badgeIcon: "🪁",
    greetingEn: "Happy Lohri, Makar Sankranti & Pongal",
    greetingHi: "लोहड़ी, मकर संक्रांति व पोंगल की हार्दिक शुभकामनाएं",
    subtextEn: "May the harvest season bring abundant prosperity, warmth, and rising financial growth.",
    subtextHi: "यह नई फसल और पतंगों का उत्सव आपके जीवन में निरंतर वित्तीय उन्नति और समृद्धि लाए।",
    ctaLabelEn: "High-Yield Accounts",
    ctaLabelHi: "बचत खाते देखें",
    ctaPath: "/savings-accounts",
    fixedSolarDate: { startMonth: 1, startDay: 13, endMonth: 1, endDay: 15 },
    periods: [
      { year: 2025, startDate: "2025-01-13", endDate: "2025-01-15" },
      { year: 2026, startDate: "2026-01-13", endDate: "2026-01-15" },
      { year: 2027, startDate: "2027-01-13", endDate: "2027-01-15" },
    ],
    theme: {
      primaryColor: "#C2410C",      // Bonfire Orange
      secondaryColor: "#EA580C",    // Fiery Amber
      accentColor: "#F59E0B",       // Harvest Yellow
      highlightColor: "#006B50",    // Clear Kite Sky
      badgeGradient: "from-[#C2410C] via-[#EA580C] to-[#F59E0B]",
      badgeBorder: "border-orange-400/40",
      badgeText: "text-white",
      ambientGlow: "radial-gradient(ellipse_at_center, rgba(234,88,12,0.15) 0%, rgba(245,158,11,0.06) 50%, transparent 75%)",
      motifType: "lohri_kite_bonfire",
      cssVars: {
        "--fest-primary": "#C2410C",
        "--fest-accent": "#F59E0B",
        "--fest-glow": "rgba(234, 88, 12, 0.22)"
      }
    }
  },

  // ── 7. INDEPENDENCE DAY (15 August - National Pride) ──
  {
    id: "independence_day",
    nameEn: "Independence Day",
    nameHi: "स्वतंत्रता दिवस",
    badgeLabelEn: "Independence Day",
    badgeLabelHi: "स्वतंत्रता दिवस",
    badgeIcon: "🇮🇳",
    greetingEn: "Happy Independence Day – Pride of the Nation",
    greetingHi: "79वें स्वतंत्रता दिवस की समस्त देशवासियों को शुभकामनाएं",
    subtextEn: "Celebrate financial independence with transparent bank comparisons and unbiased metrics.",
    subtextHi: "पारदर्शी और निष्पक्ष बैंक तुलना के साथ अपनी वित्तीय स्वतंत्रता की नई शुरुआत करें।",
    ctaLabelEn: "Explore Independent Data",
    ctaLabelHi: "निष्पक्ष तुलना देखें",
    ctaPath: "/compare",
    fixedSolarDate: { startMonth: 8, startDay: 13, endMonth: 8, endDay: 15 },
    periods: [
      { year: 2025, startDate: "2025-08-13", endDate: "2025-08-15" },
      { year: 2026, startDate: "2026-08-13", endDate: "2026-08-15" },
      { year: 2027, startDate: "2027-08-13", endDate: "2027-08-15" },
    ],
    theme: {
      primaryColor: "#EA580C",      // India Saffron
      secondaryColor: "#15803D",    // India Green
      accentColor: "#123C30",       // Navy Ashoka Chakra
      highlightColor: "#FFFFFF",    // Pure White
      badgeGradient: "from-[#EA580C] via-[#FFFFFF] to-[#15803D]",
      badgeBorder: "border-orange-500/50",
      badgeText: "text-slate-900 font-black",
      ambientGlow: "radial-gradient(ellipse_at_center, rgba(234,88,12,0.14) 0%, rgba(21,128,61,0.08) 50%, transparent 75%)",
      motifType: "tricolour_ashoka_chakra",
      cssVars: {
        "--fest-primary": "#EA580C",
        "--fest-accent": "#15803D",
        "--fest-glow": "rgba(234, 88, 12, 0.2)"
      }
    }
  },

  // ── 8. REPUBLIC DAY (26 January - National Honor) ──
  {
    id: "republic_day",
    nameEn: "Republic Day",
    nameHi: "गणतंत्र दिवस",
    badgeLabelEn: "Republic Day",
    badgeLabelHi: "गणतंत्र दिवस",
    badgeIcon: "🇮🇳",
    greetingEn: "Happy Republic Day – Celebrating Our Constitution",
    greetingHi: "गणतंत्र दिवस की हार्दिक शुभकामनाएं",
    subtextEn: "Honoring democratic transparency with 100% public, verified banking data for every citizen.",
    subtextHi: "प्रत्येक भारतीय नागरिक के लिए शत-प्रतिशत पारदर्शी व सत्यापित बैंकिंग डेटा।",
    ctaLabelEn: "Compare Top Banks",
    ctaLabelHi: "बैंकों की सूची देखें",
    ctaPath: "/banks",
    fixedSolarDate: { startMonth: 1, startDay: 24, endMonth: 1, endDay: 26 },
    periods: [
      { year: 2025, startDate: "2025-01-24", endDate: "2025-01-26" },
      { year: 2026, startDate: "2026-01-24", endDate: "2026-01-26" },
      { year: 2027, startDate: "2027-01-24", endDate: "2027-01-26" },
    ],
    theme: {
      primaryColor: "#EA580C",      // Saffron
      secondaryColor: "#15803D",    // Green
      accentColor: "#123C30",       // Chakra Navy
      highlightColor: "#FFFFFF",    // White
      badgeGradient: "from-[#EA580C] via-[#FFFFFF] to-[#15803D]",
      badgeBorder: "border-orange-500/50",
      badgeText: "text-slate-900 font-black",
      ambientGlow: "radial-gradient(ellipse_at_center, rgba(234,88,12,0.14) 0%, rgba(21,128,61,0.08) 50%, transparent 75%)",
      motifType: "tricolour_ashoka_chakra",
      cssVars: {
        "--fest-primary": "#EA580C",
        "--fest-accent": "#15803D",
        "--fest-glow": "rgba(234, 88, 12, 0.2)"
      }
    }
  },

  // ── 9. JANMASHTAMI (Divine Grace & Devotion) ──
  {
    id: "janmashtami",
    nameEn: "Krishna Janmashtami",
    nameHi: "श्री कृष्ण जन्माष्टमी",
    badgeLabelEn: "Janmashtami Special",
    badgeLabelHi: "जन्माष्टमी विशेष",
    badgeIcon: "🪶",
    greetingEn: "Happy Krishna Janmashtami",
    greetingHi: "श्री कृष्ण जन्माष्टमी की हार्दिक शुभकामनाएं",
    subtextEn: "May Lord Krishna bless your financial journey with wisdom, clarity, and boundless prosperity.",
    subtextHi: "भगवान श्री कृष्ण आपके वित्तीय जीवन में विवेक, स्पष्टता और समृद्धि का वरदान दें।",
    ctaLabelEn: "Discover Premium Cards",
    ctaLabelHi: "प्रीमियम कार्ड्स देखें",
    ctaPath: "/cards",
    periods: [
      { year: 2025, startDate: "2025-08-15", endDate: "2025-08-17" },
      { year: 2026, startDate: "2026-09-03", endDate: "2026-09-05" },
      { year: 2027, startDate: "2027-08-24", endDate: "2027-08-26" },
    ],
    theme: {
      primaryColor: "#006B50",      // Peacock Blue
      secondaryColor: "#0369A1",    // Deep Ocean Sapphire
      accentColor: "#EAB308",       // Luminous Gold
      highlightColor: "#059669",    // Feather Emerald
      badgeGradient: "from-[#006B50] via-[#059669] to-[#EAB308]",
      badgeBorder: "border-[#159B72]/40",
      badgeText: "text-white",
      ambientGlow: "radial-gradient(ellipse_at_center, rgba(2,132,199,0.15) 0%, rgba(234,179,8,0.06) 50%, transparent 75%)",
      motifType: "janmashtami_peacock_feather",
      cssVars: {
        "--fest-primary": "#006B50",
        "--fest-accent": "#EAB308",
        "--fest-glow": "rgba(2, 132, 199, 0.22)"
      }
    }
  },

  // ── 10. NAVRATRI (Nine Divine Nights of Energy) ──
  {
    id: "navratri",
    nameEn: "Navratri",
    nameHi: "शारदीय नवरात्रि",
    badgeLabelEn: "Shubh Navratri",
    badgeLabelHi: "शुभ नवरात्रि",
    badgeIcon: "🌸",
    greetingEn: "Shubh Navratri – Celebrating Divine Energy",
    greetingHi: "माँ दुर्गा के पावन पर्व नवरात्रि की हार्दिक शुभकामनाएं",
    subtextEn: "Empower your financial decisions across nine sacred days of celebration and prosperity.",
    subtextHi: "शक्ति और समृद्धि के पावन नौ दिनों में अपने लिए सही बैंकिंग निर्णय लें।",
    ctaLabelEn: "Explore Debit Cards",
    ctaLabelHi: "डेबिट कार्ड देखें",
    ctaPath: "/cards",
    periods: [
      { year: 2025, startDate: "2025-09-22", endDate: "2025-10-01" },
      { year: 2026, startDate: "2026-10-10", endDate: "2026-10-19" },
      { year: 2027, startDate: "2027-09-30", endDate: "2027-10-09" },
    ],
    theme: {
      primaryColor: "#BE185D",      // Festive Magenta
      secondaryColor: "#EA580C",    // Radiant Saffron
      accentColor: "#F59E0B",       // Marigold Gold
      highlightColor: "#6D28D9",    // Sacred Violet
      badgeGradient: "from-[#BE185D] via-[#EA580C] to-[#F59E0B]",
      badgeBorder: "border-pink-400/40",
      badgeText: "text-white",
      ambientGlow: "radial-gradient(ellipse_at_center, rgba(190,24,93,0.15) 0%, rgba(245,158,11,0.06) 50%, transparent 75%)",
      motifType: "navratri_garba_lotus",
      cssVars: {
        "--fest-primary": "#BE185D",
        "--fest-accent": "#F59E0B",
        "--fest-glow": "rgba(190, 24, 93, 0.22)"
      }
    }
  },

  // ── 11. DUSSEHRA / VIJAYADASHAMI (Triumph of Good Over Evil) ──
  {
    id: "dussehra",
    nameEn: "Dussehra (Vijayadashami)",
    nameHi: "विजयादशमी (दशहरा)",
    badgeLabelEn: "Happy Dussehra",
    badgeLabelHi: "दशहरा स्पेशल",
    badgeIcon: "🏹",
    greetingEn: "Happy Dussehra – Victory of Truth & Goodness",
    greetingHi: "असत्य पर सत्य की विजय के पावन पर्व दशहरा की शुभकामनाएं",
    subtextEn: "Conquer hidden banking fees and high charges with transparent product comparisons.",
    subtextHi: "छुपे हुए बैंक शुल्कों और अत्यधिक दरों पर पारदर्शी तुलना के साथ विजय पाएं।",
    ctaLabelEn: "Compare Zero Fee Cards",
    ctaLabelHi: "जीरो-फीस कार्ड्स",
    ctaPath: "/compare",
    periods: [
      { year: 2025, startDate: "2025-10-02", endDate: "2025-10-03" },
      { year: 2026, startDate: "2026-10-20", endDate: "2026-10-21" },
      { year: 2027, startDate: "2027-10-10", endDate: "2027-10-11" },
    ],
    theme: {
      primaryColor: "#991B1B",      // Victory Crimson
      secondaryColor: "#C2410C",    // Saffron Gold
      accentColor: "#D97706",       // Marigold
      highlightColor: "#F59E0B",    // Golden Bow
      badgeGradient: "from-[#991B1B] via-[#C2410C] to-[#D97706]",
      badgeBorder: "border-orange-400/40",
      badgeText: "text-white",
      ambientGlow: "radial-gradient(ellipse_at_center, rgba(153,27,27,0.15) 0%, rgba(217,119,6,0.06) 50%, transparent 75%)",
      motifType: "dussehra_bow_arrow",
      cssVars: {
        "--fest-primary": "#991B1B",
        "--fest-accent": "#D97706",
        "--fest-glow": "rgba(153, 27, 27, 0.22)"
      }
    }
  },

  // ── 12. NEW YEAR (January 1 - New Financial Beginnings) ──
  {
    id: "new_year",
    nameEn: "New Year Celebration",
    nameHi: "नव वर्ष उत्सव",
    badgeLabelEn: "Happy New Year",
    badgeLabelHi: "नव वर्ष विशेष",
    badgeIcon: "✨",
    greetingEn: "Happy New Year – Fresh Financial Beginnings",
    greetingHi: "नव वर्ष की हार्दिक शुभकामनाएं – नए वित्तीय संकल्प",
    subtextEn: "Start the year strong with smarter savings accounts, optimized card benefits, and zero hidden costs.",
    subtextHi: "नए साल में समझदारी से बचत बढ़ाएं और अपने लिए सर्वोत्तम बैंकिंग उत्पाद चुनें।",
    ctaLabelEn: "Set Financial Goals",
    ctaLabelHi: "खाते देखें",
    ctaPath: "/savings-accounts",
    fixedSolarDate: { startMonth: 12, startDay: 31, endMonth: 1, endDay: 2 },
    periods: [
      { year: 2025, startDate: "2024-12-31", endDate: "2025-01-02" },
      { year: 2026, startDate: "2025-12-31", endDate: "2026-01-02" },
      { year: 2027, startDate: "2026-12-31", endDate: "2027-01-02" },
    ],
    theme: {
      primaryColor: "#0F172A",      // Midnight Navy
      secondaryColor: "#1E293B",    // Slate
      accentColor: "#F59E0B",       // Champagne Gold
      highlightColor: "#94A3B8",    // Platinum Silver
      badgeGradient: "from-[#0F172A] via-[#1E293B] to-[#F59E0B]",
      badgeBorder: "border-amber-400/40",
      badgeText: "text-amber-200",
      ambientGlow: "radial-gradient(ellipse_at_center, rgba(245,158,11,0.14) 0%, rgba(148,163,184,0.06) 50%, transparent 75%)",
      motifType: "new_year_champagne_stars",
      cssVars: {
        "--fest-primary": "#0F172A",
        "--fest-accent": "#F59E0B",
        "--fest-glow": "rgba(245, 158, 11, 0.2)"
      }
    }
  },

  // ── 13. GANESH CHATURTHI (Auspicious Beginnings) ──
  {
    id: "ganesh_chaturthi",
    nameEn: "Ganesh Chaturthi",
    nameHi: "गणेश चतुर्थी",
    badgeLabelEn: "Ganesh Utsav",
    badgeLabelHi: "गणेश उत्सव",
    badgeIcon: "🐘",
    greetingEn: "Ganpati Bappa Morya – Auspicious Beginnings",
    greetingHi: "गणपति बाप्पा मोरया – मंगलमूर्ति का पावन आशीर्वाद",
    subtextEn: "Initiate new financial milestones with the blessings of Lord Ganesha and reliable bank data.",
    subtextHi: "विघ्नहर्ता श्री गणेश के आशीर्वाद के साथ अपनी वित्तीय यात्रा के शुभ संकल्प लें।",
    ctaLabelEn: "Explore Bank Accounts",
    ctaLabelHi: "बैंक खाते देखें",
    ctaPath: "/savings-accounts",
    periods: [
      { year: 2025, startDate: "2025-08-27", endDate: "2025-09-06" },
      { year: 2026, startDate: "2026-09-14", endDate: "2026-09-24" },
      { year: 2027, startDate: "2027-09-04", endDate: "2027-09-14" },
    ],
    theme: {
      primaryColor: "#B91C1C",      // Sacred Sindoor Red
      secondaryColor: "#C2410C",    // Modak Orange
      accentColor: "#F59E0B",       // Marigold Gold
      highlightColor: "#059669",    // Durva Grass Green
      badgeGradient: "from-[#B91C1C] via-[#C2410C] to-[#F59E0B]",
      badgeBorder: "border-amber-400/40",
      badgeText: "text-white",
      ambientGlow: "radial-gradient(ellipse_at_center, rgba(185,28,28,0.15) 0%, rgba(245,158,11,0.06) 50%, transparent 75%)",
      motifType: "ganesh_lotus_modak",
      cssVars: {
        "--fest-primary": "#B91C1C",
        "--fest-accent": "#F59E0B",
        "--fest-glow": "rgba(185, 28, 28, 0.22)"
      }
    }
  },

  // ── 14. RAKSHA BANDHAN (Bond of Love & Protection) ──
  {
    id: "raksha_bandhan",
    nameEn: "Raksha Bandhan",
    nameHi: "रक्षाबंधन",
    badgeLabelEn: "Raksha Bandhan",
    badgeLabelHi: "रक्षाबंधन विशेष",
    badgeIcon: "🧵",
    greetingEn: "Happy Raksha Bandhan – Protecting What Matters",
    greetingHi: "स्नेह और सुरक्षा के पावन पर्व रक्षाबंधन की शुभकामनाएं",
    subtextEn: "Protect your family's financial future with secure, high-interest savings and reliable cards.",
    subtextHi: "सुरक्षित बचत खातों और विश्वसनीय कार्ड्स के साथ अपने परिवार के भविष्य को सुरक्षित रखें।",
    ctaLabelEn: "Family Savings Accounts",
    ctaLabelHi: "सुरक्षित बचत खाते",
    ctaPath: "/savings-accounts",
    periods: [
      { year: 2025, startDate: "2025-08-08", endDate: "2025-08-10" },
      { year: 2026, startDate: "2026-08-27", endDate: "2026-08-29" },
      { year: 2027, startDate: "2027-08-16", endDate: "2027-08-18" },
    ],
    theme: {
      primaryColor: "#BE185D",      // Silk Rose
      secondaryColor: "#E11D48",    // Red Thread
      accentColor: "#D97706",       // Golden Bead
      highlightColor: "#F59E0B",    // Amber Silk
      badgeGradient: "from-[#BE185D] via-[#E11D48] to-[#D97706]",
      badgeBorder: "border-rose-400/40",
      badgeText: "text-white",
      ambientGlow: "radial-gradient(ellipse_at_center, rgba(190,24,93,0.15) 0%, rgba(217,119,6,0.06) 50%, transparent 75%)",
      motifType: "rakhi_silk_thread",
      cssVars: {
        "--fest-primary": "#BE185D",
        "--fest-accent": "#D97706",
        "--fest-glow": "rgba(190, 24, 93, 0.22)"
      }
    }
  },

  // ── 15. MAHA SHIVRATRI (Divine Serenity & Wisdom) ──
  {
    id: "maha_shivratri",
    nameEn: "Maha Shivratri",
    nameHi: "महाशिवरात्रि",
    badgeLabelEn: "Maha Shivratri",
    badgeLabelHi: "महाशिवरात्रि विशेष",
    badgeIcon: "🔱",
    greetingEn: "Har Har Mahadev – Happy Maha Shivratri",
    greetingHi: "महाशिवरात्रि के पावन पर्व की मंगलमय शुभकामनाएं",
    subtextEn: "Wishing you inner strength, spiritual clarity, and steady financial peace.",
    subtextHi: "सदाशिव के पावन आशीर्वाद से आपके जीवन में धैर्य, स्पष्टता और समृद्धि का वास हो।",
    ctaLabelEn: "Explore Products",
    ctaLabelHi: "उत्पाद देखें",
    ctaPath: "/cards",
    periods: [
      { year: 2025, startDate: "2025-02-25", endDate: "2025-02-26" },
      { year: 2026, startDate: "2026-02-14", endDate: "2026-02-15" },
      { year: 2027, startDate: "2027-03-05", endDate: "2027-03-06" },
    ],
    theme: {
      primaryColor: "#1E293B",      // Cosmic Blue
      secondaryColor: "#006B50",    // Neelkanth Blue
      accentColor: "#D97706",       // Sacred Sandalwood Gold
      highlightColor: "#EEF4EE",    // Bhasma Silver
      badgeGradient: "from-[#1E293B] via-[#006B50] to-[#D97706]",
      badgeBorder: "border-[#159B72]/40",
      badgeText: "text-emerald-50",
      ambientGlow: "radial-gradient(ellipse_at_center, rgba(2,132,199,0.15) 0%, rgba(30,41,59,0.08) 50%, transparent 75%)",
      motifType: "trishul_damru_crescent",
      cssVars: {
        "--fest-primary": "#1E293B",
        "--fest-accent": "#006B50",
        "--fest-glow": "rgba(2, 132, 199, 0.2)"
      }
    }
  }
];
