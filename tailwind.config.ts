import type { Config } from 'tailwindcss'
import daisyui from "daisyui";

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      //h1 h2 h3 h4 h5 h6
        fontFamily: {
            sans: ['Inter', 'sans-serif'],
            serif: ['Inter', 'sans-serif'],
            mono: ['Inter', 'sans-serif'],
        },
        backgroundColor: {

        },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ["light"],
  },
}
export default config
