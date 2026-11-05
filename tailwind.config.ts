import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-source-sans)', 'ui-sans-serif', 'system-ui'],
        serif: ['var(--font-lora)', 'ui-serif', 'Georgia'],
      },
    },
  },
  plugins: [],
};

export default config;
