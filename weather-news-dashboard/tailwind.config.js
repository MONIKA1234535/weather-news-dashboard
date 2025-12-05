/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // This path is crucial. It tells Tailwind to look at all 
    // .html, .js, .jsx, .ts, and .tsx files in the src folder and its subfolders.
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}