/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      /* Dark Theme Color Palette */
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',
        'bg-glass': 'var(--bg-glass)',
        'bg-glass-hover': 'var(--bg-glass-hover)',
        'border-glass': 'var(--border-glass)',
        'border-glass-hover': 'var(--border-glass-hover)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          glow: 'var(--accent-glow)',
        },
        success: {
          DEFAULT: 'var(--success)',
          glow: 'var(--success-glow)',
        },
        error: {
          DEFAULT: 'var(--error)',
          glow: 'var(--error-glow)',
        },
      },

      /* Glassmorphism Utilities */
      backdropBlur: {
        glass: 'var(--blur-md)',
        'glass-sm': 'var(--blur-sm)',
        'glass-lg': 'var(--blur-lg)',
      },

      /* Border Radius */
      borderRadius: {
        glass: 'var(--radius-xl)',
        'glass-sm': 'var(--radius-lg)',
        'glass-lg': 'var(--radius-2xl)',
      },

      /* Box Shadow */
      boxShadow: {
        glass: 'var(--glass-shadow)',
        'glass-lg': 'var(--glass-shadow-lg)',
        'glass-glow': 'var(--glass-shadow-glow)',
        'accent-glow': '0 0 20px var(--accent-glow-subtle)',
        'accent-glow-lg': '0 0 30px var(--accent-glow)',
      },

      /* Font Sizes */
      fontSize: {
        '2xs': 'var(--font-size-xs)',
      },

      /* Spacing */
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      /* Max Width */
      maxWidth: {
        'container-sm': 'var(--max-width-sm)',
        'container-md': 'var(--max-width-md)',
        'container-lg': 'var(--max-width-lg)',
        'container-xl': 'var(--max-width-xl)',
      },

      /* Animation Timing */
      transitionDuration: {
        instant: 'var(--duration-instant)',
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        slow: 'var(--duration-slow)',
        slower: 'var(--duration-slower)',
      },

      /* Animation Keyframes */
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px var(--accent-glow-subtle)' },
          '50%': { boxShadow: '0 0 30px var(--accent-glow)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in var(--duration-slow) var(--ease-out)',
        'fade-in-up': 'fade-in-up var(--duration-slow) var(--ease-out)',
        'fade-in-down': 'fade-in-down var(--duration-slow) var(--ease-out)',
        'scale-in': 'scale-in var(--duration-slower) var(--ease-out)',
        'slide-in-right': 'slide-in-right var(--duration-slow) var(--ease-out)',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
}
