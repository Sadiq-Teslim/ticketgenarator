// tailwind.config.js
module.exports = {
  content: [
    "./*.html",          // Scans index.html
    "./pages/**/*.html", // Scans all HTML files in the pages folder
    "./scripts/**/*.js"  // Scans all JS files in the scripts folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}