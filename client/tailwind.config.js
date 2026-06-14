/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  safelist: [
    "bg-indigo-50", "text-indigo-600", "text-indigo-600",
    "bg-purple-50", "text-purple-600", "text-purple-600",
    "bg-fuchsia-50", "text-fuchsia-600", "text-fuchsia-600",
    "bg-emerald-50", "text-emerald-600",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
