/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))',
        'primary-hover': 'hsl(var(--primary-hover))',
        secondary: 'hsl(var(--secondary))',
        accent: 'hsl(var(--accent))',
        destructive: 'hsl(var(--destructive))',
        
        background: 'hsl(var(--background))',
        surface: 'hsl(var(--surface))',
        'surface-hover': 'hsl(var(--surface-hover))',
        'surface-card': 'hsl(var(--surface-card))',
        
        'text-primary': 'hsl(var(--text-primary))',
        'text-secondary': 'hsl(var(--text-secondary))',
        'text-muted': 'hsl(var(--text-muted))',
        
        border: 'hsl(var(--border))',
        'border-hover': 'hsl(var(--border-hover))',
        
        'farm-color': 'hsl(var(--farm-color))',
        'city-color': 'hsl(var(--city-color))',
        'magic-color': 'hsl(var(--magic-color))',
        'event-color': 'hsl(var(--event-color))',
      },
      animation: {
        'card-draw': 'card-draw 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'card': 'var(--shadow-card)',
        'glow': 'var(--shadow-glow)',
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-card': 'var(--gradient-card)',
      },
    },
  },
  plugins: [],
}

