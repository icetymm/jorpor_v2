/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        ntr: ['NTR', 'sans-serif'], 
        mitr: ['Mitr', 'sans-serif'],
        athiti: ['Athiti', 'sans-serif'],
        prompt: ['Prompt', 'sans-serif'],
        notosansthai: ['Noto Sans Thai', 'sans-serif']
      },
      fontWeight: {
        small: 200,
      },
      screens: {
        'md': '768px',  // เพิ่มขนาดเองสำหรับ md
        'lg': '1081px', // เพิ่มขนาดเองสำหรับ lg
      },
    },
  },
  plugins: [],
}