import type { Config } from 'tailwindcss';

/**
 * Design tokens do SiteForge.
 * Toda cor, raio, sombra e animação da interface nasce aqui.
 * Componentes usam somente estes nomes (bg-canvas, text-ink, bg-brand-500...).
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        canvas: '#F6F6F4',
        surface: '#FFFFFF',
        line: '#E5E5E0',
        ink: { DEFAULT: '#1A1D23', muted: '#5B616B', subtle: '#8A909A' },
        graphite: {
          950: '#111318',
          900: '#171A20',
          800: '#20242C',
          700: '#2B303A',
          600: '#3A404C',
        },
        brand: {
          50: '#FFF8E6',
          100: '#FEEFC3',
          200: '#FDDD8A',
          300: '#FBC94F',
          400: '#F8B62B',
          500: '#F5A524',
          600: '#D98A0B',
          700: '#8F5A05',
        },
        success: { DEFAULT: '#1B8A5A', soft: '#E6F5EE' },
        danger: { DEFAULT: '#D64545', soft: '#FDECEC' },
        info: { DEFAULT: '#2F62D6', soft: '#E9EFFD' },
      },
      // Sobrescreve as chaves padrão para o tailwind-merge continuar reconhecendo os nomes.
      borderRadius: { lg: '0.625rem', xl: '0.875rem', '2xl': '1.125rem' },
      boxShadow: {
        sm: '0 1px 2px rgba(17, 19, 24, 0.05), 0 0 0 1px rgba(17, 19, 24, 0.01)',
        lg: '0 16px 40px -12px rgba(17, 19, 24, 0.22), 0 2px 8px rgba(17, 19, 24, 0.06)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'fade-out': { from: { opacity: '1' }, to: { opacity: '0' } },
        'pop-in': {
          from: { opacity: '0', transform: 'translate(-50%, -48%) scale(0.97)' },
          to: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
        },
        'pop-out': {
          from: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
          to: { opacity: '0', transform: 'translate(-50%, -48%) scale(0.97)' },
        },
        'slide-in-left': { from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(0)' } },
        'slide-out-left': { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-100%)' } },
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'menu-in': {
          from: { opacity: '0', transform: 'translateY(-4px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 150ms ease-out',
        'fade-out': 'fade-out 120ms ease-in',
        'pop-in': 'pop-in 180ms cubic-bezier(0.16, 1, 0.3, 1)',
        'pop-out': 'pop-out 120ms ease-in',
        'slide-in-left': 'slide-in-left 220ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-out-left': 'slide-out-left 160ms ease-in',
        'toast-in': 'toast-in 200ms ease-out',
        'menu-in': 'menu-in 120ms ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config;
