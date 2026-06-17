import type { Config } from 'tailwindcss';

/**
 * Paleta extraída EXCLUSIVAMENTE do site jmsjetski.com.br (tema navy).
 * Nomes de tokens mantidos compatíveis com o template de referência (resources/).
 */
const config: Config = {
  content: [
    './index.html',
    './*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#ffffff',     // acento / CTA / texto principal
        navy: '#0a1a2e',        // fundo principal
        secondary: '#1a3a5c',   // fundo secundário
        surface: '#12294a',     // cartões
        muted: '#c7d3e0',       // texto secundário (contraste AA sobre navy)
        'text-main': '#ffffff',
      },
      fontFamily: {
        display: ["'Archivo'", 'sans-serif'],
        sans: ["'Inter'", 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
