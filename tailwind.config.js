/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },

      colors: {
        // ── Primary Palette ──────────────────────────────
        primary:     "#860038",   // Axis Burgundy
        primaryHover:"#70002E",   // Darker Burgundy
        secondary:   "#AE1D58",   // Burgundy Rose
        accent:      "#F9E6EE",   // Soft Blush Pink
 
        // ── CTA ──────────────────────────────────────────
        cta:         "#96003F",   // Maroon/Burgundy
        ctaHover:    "#70002E",   // Darker Burgundy
 
        // ── Text ─────────────────────────────────────────
        textDark:    "#1E040D",   // Rich Black Burgundy
        textSoft:    "#6B7280",   // Cool Gray
 
        // ── Borders & Backgrounds ────────────────────────
        highlight:   "#EDD6E0",   // Soft Burgundy Border
        neutralBg:   "#FAF5F7",   // Light Blush background
        cardBg:      "rgba(255, 255, 255, 0.85)", // Frosted white card
 
        // ── Icon / Decorative ────────────────────────────
        roseGold:    "#E0B2C4",   // Light Rose Gold Accent
 
        // ── Dark Mode ────────────────────────────────────
        darkBg:      "#0B0508",   // Obsidian Burgundy Dark Space
        darkCard:    "#16080E",   // Frosted obsidian burgundy card
        darkHighlight:"#2A0E17",  // Subtle elegant dark burgundy highlight
      },
 
      boxShadow: {
        soft:      "0 4px 20px rgba(134,0,56,0.08)",
        card:      "0 4px 24px rgba(134,0,56,0.06)",
        cardHover: "0 20px 50px rgba(134,0,56,0.18)",
        indigo:    "0 8px 32px rgba(174,29,88,0.2)",
        glow:      "0 0 24px rgba(174,29,88,0.35), 0 0 48px rgba(134,0,56,0.15)",
        magenta:   "0 8px 24px rgba(150,0,63,0.25)",
      },
 
      backgroundImage: {
        'card-gradient': 'linear-gradient(135deg, #860038, #AE1D58)',
        'page-gradient': 'linear-gradient(135deg, #FAF5F7, #F5ECF0)',
        'plum-rose':     'linear-gradient(135deg, #860038, #AE1D58)',
        'blush-fade':    'linear-gradient(135deg, #F9E6EE, #F5ECF0)',
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
          '0%, 100%': { boxShadow: '0 0 10px rgba(194,24,117,0.3)' },
          '50%':       { boxShadow: '0 0 28px rgba(194,24,117,0.65), 0 0 50px rgba(122,15,82,0.25)' },
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
