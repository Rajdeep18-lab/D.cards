/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
        serif: ['Poppins', 'sans-serif'],
        mono: ['monospace'],
      },

      colors: {
        // ── Global Diwali Festive Palette (Exact User Spec) ──
        'diwali-ivory':       "#FFF9EE",   // Primary background: Warm Ivory
        'diwali-cream':       "#F7EEDC",   // Secondary background: Soft Cream
        'diwali-navy':        "#111827",   // Primary text: Deep Navy
        'diwali-royal':       "#2455A4",   // Royal Blue
        'diwali-purple':      "#291747",   // Deep Purple
        'diwali-gold':        "#D6A64B",   // Premium Gold
        'diwali-gold-light':  "#F5DFA8",   // Light Gold
        'diwali-gold-dark':   "#B8860B",   // Dark Amber Gold
        'diwali-border':      "#E8D6B3",   // Subtle Gold Border

        // ── Unified Fintech & Festive Aliases ──────────────────
        primary:      "#2455A4",   // Royal Blue (#2455A4)
        secondary:    "#D6A64B",   // Premium Gold
        accent:       "#D6A64B",   // Premium Gold
        darkNavy:     "#111827",   // Deep Navy
        lightBg:      "#FFF9EE",   // Warm Ivory Background
        cardBg:       "#FFFFFF",   // Cards Background
        borderLine:   "#E8D6B3",   // Subtle Gold Border
        textDark:     "#111827",   // Deep Navy Primary Text
        textSoft:     "#4B5563",   // Muted Text
        hoverBlue:    "#1B4080",   // Darker Royal Blue for Hover

        // Helper aliases
        cta:          "#2455A4",
        ctaHover:     "#1B4080",
        highlight:    "#F5DFA8",
        neutralBg:    "#FFF9EE",
        roseGold:     "#D6A64B",

        // Dark Mode Slate & Midnight Navy
        darkBg:       "#0B132B",
        darkCard:     "#1E293B",
        darkHighlight:"#291747",
      },

      boxShadow: {
        soft:      "0 4px 20px rgba(37, 99, 235, 0.06)",
        card:      "0 4px 24px rgba(37, 99, 235, 0.05)",
        cardHover: "0 20px 40px rgba(37, 99, 235, 0.12)",
        indigo:    "0 8px 32px rgba(37, 99, 235, 0.15)",
        glow:      "0 0 24px rgba(37, 99, 235, 0.25), 0 0 48px rgba(96, 165, 250, 0.15)",
        blueGlow:  "0 10px 30px rgba(37, 99, 235, 0.3)",
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
