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
        // ── Approved Final Palette ──
        cream:               "#FAF9F4",   // Primary background: Warm Cream (#FAF9F4)
        'cream-light':       "#FFFFFF",   // Pure White (#FFFFFF)
        ivory:               "#FAF9F4",   // Warm Cream Surface
        'sage-light':        "#EEF4EE",   // Soft Sage Light Surface
        sage:                "#DCE9E1",   // Soft Sage Border (#DCE9E1)
        forest:              "#064E3B",   // Forest Green (#064E3B)
        'forest-dark':       "#123C30",   // Deep Forest Green Headings (#123C30)
        'forest-soft':       "#45534D",   // Body Text Dark Grey (#45534D)
        'emerald-rich':      "#006B50",   // Primary: Deep Emerald Green (#006B50)
        'emerald-hover':     "#064E3B",   // Secondary: Forest Green (#064E3B)
        'emerald-accent':    "#159B72",   // Accent: Fresh Green (#159B72)
        'border-subtle':     "#DCE9E1",   // Borders: Soft Sage (#DCE9E1)
        'border-warm':       "#DCE9E1",   // Soft Sage Border

        // ── Unified Aliases ──
        primary:      "#006B50",   // Deep Emerald Green (#006B50)
        secondary:    "#064E3B",   // Forest Green (#064E3B)
        accent:       "#159B72",   // Fresh Green Accent (#159B72)
        darkNavy:     "#123C30",   // Deep Forest Green
        lightBg:      "#FAF9F4",   // Warm Cream (#FAF9F4)
        cardBg:       "#FFFFFF",   // Pure White Cards (#FFFFFF)
        borderLine:   "#DCE9E1",   // Soft Sage (#DCE9E1)
        textDark:     "#123C30",   // Deep Forest Green Headings (#123C30)
        textSoft:     "#45534D",   // Dark Grey Body Text (#45534D)
        hoverBlue:    "#064E3B",   // Button Hover
        cta:          "#006B50",   // Deep Emerald CTA
        ctaHover:     "#064E3B",   // Forest Green Hover
        highlight:    "#EEF4EE",   // Soft Sage Highlight
        neutralBg:    "#FAF9F4",   // Warm Cream
        roseGold:     "#DCE9E1",

        // Dark Mode
        darkBg:       "#0C1813",
        darkCard:     "#13241C",
        darkHighlight:"#1A2E24",
      },

      boxShadow: {
        soft:         "0 4px 20px -2px rgba(6, 78, 59, 0.05)",
        card:         "0 4px 24px -2px rgba(6, 78, 59, 0.06)",
        cardHover:    "0 20px 40px -4px rgba(6, 78, 59, 0.12)",
        indigo:       "0 8px 32px rgba(0, 107, 80, 0.15)",
        glow:         "0 0 24px rgba(21, 155, 114, 0.25), 0 0 48px rgba(0, 107, 80, 0.15)",
        blueGlow:     "0 10px 30px rgba(0, 107, 80, 0.25)",
        emeraldGlow:  "0 10px 30px rgba(0, 107, 80, 0.3)",
      },

      backgroundImage: {
        'card-gradient': 'linear-gradient(135deg, #006B50, #064E3B)',
        'page-gradient': 'linear-gradient(180deg, #FAF9F4 0%, #FFFFFF 100%)',
        'blue-gradient': 'linear-gradient(135deg, #006B50 0%, #064E3B 50%, #159B72 100%)',
        'navy-gradient': 'linear-gradient(135deg, #123C30 0%, #064E3B 100%)',
        'plum-rose':     'linear-gradient(135deg, #006B50, #159B72)',
        'blush-fade':    'linear-gradient(135deg, #FAF9F4, #FFFFFF)',
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
          '0%, 100%': { boxShadow: '0 0 10px rgba(0, 107, 80, 0.2)' },
          '50%':       { boxShadow: '0 0 28px rgba(0, 107, 80, 0.4), 0 0 50px rgba(21, 155, 114, 0.2)' },
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
