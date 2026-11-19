/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Playfair Display', 'Georgia', 'serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['monospace'],
      },

      colors: {
        // ── Editorial Luxury Fintech Palette ──
        cream:               "#FAF8F5",   // Primary background: Warm Cream / Off-White
        'cream-light':       "#FDFCF7",   // Highlight Cream
        ivory:               "#F5F3EC",   // Secondary Surface: Soft Ivory
        'sage-light':        "#EEF4EE",   // Secondary Surface: Very Light Sage
        sage:                "#D8E3D7",   // Accent Sage
        forest:              "#14291F",   // Primary text: Deep Forest Green
        'forest-dark':       "#0E1E16",   // Deepest Forest Shadow
        'forest-soft':       "#445B4D",   // Secondary / Muted Text
        'emerald-rich':      "#0E5C3E",   // Primary Buttons & Actions: Rich Emerald Green
        'emerald-hover':     "#0A4730",   // Hover Emerald Green
        'emerald-accent':    "#10B981",   // Accent Emerald Green
        'border-subtle':     "#E0E6DC",   // Subtle Warm Grey / Sage Border
        'border-warm':       "#E7E4DC",   // Warm Card Border

        // ── Unified Aliases ──
        primary:      "#0E5C3E",   // Rich Emerald Green
        secondary:    "#14291F",   // Deep Forest Green
        accent:       "#10B981",   // Emerald Accent
        darkNavy:     "#14291F",   // Deep Forest
        lightBg:      "#FAF8F5",   // Warm Cream
        cardBg:       "#FFFFFF",   // Crisp Card Surface
        borderLine:   "#E0E6DC",   // Subtle Warm Grey / Sage
        textDark:     "#14291F",   // Deep Forest Green Text
        textSoft:     "#445B4D",   // Muted Sage Text
        hoverBlue:    "#0A4730",   // Button Hover
        cta:          "#0E5C3E",   // Rich Emerald CTA
        ctaHover:     "#0A4730",   // Rich Emerald CTA Hover
        highlight:    "#EEF4EE",   // Soft Sage Highlight
        neutralBg:    "#FAF8F5",   // Warm Cream
        roseGold:     "#D8E3D7",

        // Dark Mode Forest & Deep Slate
        darkBg:       "#0C1813",   // Deep Night Forest
        darkCard:     "#13241C",   // Dark Forest Card Surface
        darkHighlight:"#1A2E24",
      },

      boxShadow: {
        soft:         "0 4px 20px -2px rgba(20, 41, 31, 0.05)",
        card:         "0 4px 24px -2px rgba(20, 41, 31, 0.06)",
        cardHover:    "0 20px 40px -4px rgba(20, 41, 31, 0.12)",
        indigo:       "0 8px 32px rgba(14, 92, 62, 0.15)",
        glow:         "0 0 24px rgba(16, 185, 129, 0.25), 0 0 48px rgba(14, 92, 62, 0.15)",
        blueGlow:     "0 10px 30px rgba(14, 92, 62, 0.25)",
        emeraldGlow:  "0 10px 30px rgba(14, 92, 62, 0.3)",
      },

      backgroundImage: {
        'card-gradient': 'linear-gradient(135deg, #2563EB, #3B82F6)',
        'page-gradient': 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)',
        'blue-gradient': 'linear-gradient(135deg, #2563EB 0%, #3B82F6 50%, #60A5FA 100%)',
        'navy-gradient': 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        'plum-rose':     'linear-gradient(135deg, #2563EB, #60A5FA)',
        'blush-fade':    'linear-gradient(135deg, #EFF6FF, #F8FAFC)',
      },

      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-12px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-20px)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':       { backgroundPosition: '100% 50%' },
        },
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(37, 99, 235, 0.2)' },
          '50%':       { boxShadow: '0 0 28px rgba(37, 99, 235, 0.5), 0 0 50px rgba(96, 165, 250, 0.2)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'rotate-slow': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
      },

      animation: {
        'float':       'float 3.5s ease-in-out infinite',
        'float-slow':  'float-slow 6s ease-in-out infinite',
        'gradient-x':  'gradient-x 3s ease infinite',
        'fade-in-up':  'fade-in-up 0.6s ease-out forwards',
        'pulse-glow':  'pulse-glow 2.5s ease-in-out infinite',
        'shimmer':     'shimmer 2.5s infinite linear',
        'rotate-slow': 'rotate-slow 12s linear infinite',
      },
    },
  },
  plugins: [],
};
