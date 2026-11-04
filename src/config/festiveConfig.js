/**
 * D.CARD Festive Campaign & Audit Cycle Configuration
 * 
 * Centralized governance for Diwali, Dhanteras, and 15-Day Audit Cycle displays.
 * Set `isFestiveEnabled: false` to instantly disable all festive themes without editing components.
 */

export const FESTIVE_CONFIG = {
  // Master switch for all festive themes (Diwali & Dhanteras)
  isFestiveEnabled: true,

  // Granular feature toggles
  dhanterasHeroCampaignEnabled: true,
  auditCycleSectionEnabled: true,
  diwaliCampaignBannersEnabled: true,
  festiveAnimationsEnabled: true, // Floating diyas, golden particles, fireworks
  navbarFestiveBadgeEnabled: true,

  // 15-Day Internal Information Audit Cycle Configuration
  auditCycle: {
    cycleDays: 15,
    currentDayInCycle: 7, // Day 7 of 15 in the active verification window
    cycleLabel: "Internal Information Audit Cycle",
    cycleLabelHi: "आंतरिक डेटा समीक्षा चक्र",
    mainHeading: "15-DAY AUDIT CYCLE",
    mainHeadingHi: "15-दिवसीय ऑडिट चक्र",
    supportingText: "Your banking information deserves regular verification.",
    supportingTextHi: "आपकी बैंकिंग जानकारी नियमित सत्यापन की हकदार है।",
    shortMessage: "We continuously review banking product information to help keep D.CARD data accurate and up to date.",
    shortMessageHi: "हम D.CARD के डेटा को सटीक और अद्यतित रखने के लिए बैंकिंग उत्पाद जानकारी की निरंतर समीक्षा करते हैं।",
    
    // Explicit internal dates (clearly labeled as internal tariff audit windows)
    lastAuditDate: "October 28, 2026",
    lastAuditDateHi: "28 अक्टूबर, 2026",
    nextScheduledAuditDate: "November 12, 2026",
    nextScheduledAuditDateHi: "12 नवंबर, 2026",
    
    // Transparent governance disclaimer
    disclaimer: "Represents D.CARD's internal scheduled review cycle across publicly published bank tariff schedules and schedule of charges. Independent banking institutions do not verify this platform.",
    disclaimerHi: "यह सार्वजनिक रूप से प्रकाशित बैंक टैरिफ शेड्यूल और शुल्क तालिकाओं पर D.CARD के आंतरिक निर्धारित समीक्षा चक्र को दर्शाता है। स्वतंत्र बैंक इस प्लेटफॉर्म का सत्यापन नहीं करते हैं।"
  },

  // Dhanteras Hero Campaign Configuration
  dhanterasCampaign: {
    headline: "Celebrate Prosperity. Discover Smarter Banking.",
    headlineHi: "समृद्धि का स्वागत करें। स्मार्ट बैंकिंग चुनें।",
    supportingText: "This Dhanteras, explore banking products and make more informed financial choices with D.CARD.",
    supportingTextHi: "इस धनतेरस, D.CARD के साथ बैंकिंग उत्पादों की तुलना करें और अपने लिए सही वित्तीय विकल्प चुनें।",
    ctaExplore: {
      label: "Explore Banking Products",
      labelHi: "बैंकिंग उत्पाद देखें",
      targetId: "product-categories"
    },
    ctaCompare: {
      label: "Compare Now",
      labelHi: "तुलना करें",
      path: "/compare"
    }
  },

  // Diwali Advertisement Campaign Banners (D.CARD's own promotional banners)
  diwaliCampaigns: [
    {
      id: "diwali-match",
      tag: "DIWALI SPECIAL",
      tagHi: "दिवाली स्पेशल",
      headline: "Diwali Special – Discover Your Banking Match",
      headlineHi: "दिवाली स्पेशल – अपने लिए सही बैंक खाता व कार्ड खोजें",
      subtext: "Illuminate your financial journey with transparent, verified debit cards and zero-balance savings accounts.",
      subtextHi: "पारदर्शी और सत्यापित डेबिट कार्ड व बचत खातों के साथ अपनी वित्तीय यात्रा को नई रोशनी दें।",
      ctaLabel: "Find Your Match",
      ctaLabelHi: "कार्ड खोजें",
      ctaPath: "/cards",
      accentColor: "from-amber-500/20 via-yellow-500/10 to-transparent",
      borderColor: "border-amber-500/30"
    },
    {
      id: "dhanteras-choices",
      tag: "DHANTERAS EXCLUSIVE",
      tagHi: "धनतेरस विशेष",
      headline: "This Dhanteras, Make Smarter Banking Choices",
      headlineHi: "इस धनतेरस, करें समझदारी भरे वित्तीय निर्णय",
      subtext: "True financial prosperity begins with clarity. Compare transparent fees, daily withdrawal limits, and verified perks.",
      subtextHi: "सच्ची वित्तीय समृद्धि स्पष्टता से शुरू होती है। वास्तविक शुल्क, दैनिक सीमा और सत्यापित लाभों की एक साथ तुलना करें।",
      ctaLabel: "Compare Accounts",
      ctaLabelHi: "खातों की तुलना करें",
      ctaPath: "/savings-accounts",
      accentColor: "from-rose-500/20 via-amber-500/10 to-transparent",
      borderColor: "border-rose-500/30"
    },
    {
      id: "independent-compare",
      tag: "INDEPENDENT DISCOVERY",
      tagHi: "स्वतंत्र तुलना",
      headline: "Compare. Discover. Choose Better.",
      headlineHi: "तुलना करें। जानें। बेहतर चुनें।",
      subtext: "Zero sponsored bias, zero inflated ratings. 100% independent data on 130+ cards and 70+ savings accounts.",
      subtextHi: "शून्य प्रायोजित पूर्वाग्रह, निष्पक्ष डेटा। 130+ कार्ड और 70+ बचत खातों की निष्पक्ष जानकारी एक मंच पर।",
      ctaLabel: "Explore Product Matrix",
      ctaLabelHi: "उत्पाद मैट्रिक्स देखें",
      ctaPath: "/compare",
      accentColor: "from-blue-500/20 via-indigo-500/10 to-transparent",
      borderColor: "border-blue-500/30"
    }
  ],

  // Navbar Accent
  navbarAccent: {
    badgeText: "Diwali & Dhanteras Special",
    badgeTextHi: "दिवाली व धनतेरस विशेष",
    targetId: "dhanteras-hero"
  }
};

