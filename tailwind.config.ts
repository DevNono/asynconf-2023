import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#47D981',
        'primary-dark': '#30AA61',
        secondary: '#0085FF',
        main: '#222528',
      },
      fontFamily: {
        sans: ['var(--font-lexend)', 'sans-serif'],
      },

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      backgroundImage: (theme) => ({
        'main-gradient': 'linear-gradient(180deg, #8AF657 0%, #47D981 100%)',
        'background-gradient': 'linear-gradient(315deg, #000000 0%, #154B2C 100%)',
      }),
    },
  },
  plugins: [],
};
export default config;
