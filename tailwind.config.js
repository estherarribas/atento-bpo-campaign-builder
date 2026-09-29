/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        atento: {
          navy: "#002B49",
          "navy-dark": "#001B30",
          "navy-light": "#003E6B",
          cyan: "#00A3E0",
          "cyan-dark": "#0081B2",
          "cyan-light": "#33B5E6",
          blue: "#0072CE",
          emerald: "#0D9488",
          amber: "#F59E0B",
          coral: "#EF4444",
          surface: "#F4F6F9",
          border: "#E2E8F0",
          muted: "#64748B",
          card: "#FFFFFF",
        },
        primary: {
          DEFAULT: "#002B49",
          foreground: "#ffffff",
          container: "#002B49",
          dark: "#001629",
        },
        secondary: {
          DEFAULT: "#00A3E0",
          foreground: "#ffffff",
          container: "#41BEFD",
        },
        tertiary: {
          DEFAULT: "#0072CE",
          foreground: "#ffffff",
        },
        surface: {
          DEFAULT: "#F4F6F9",
          card: "#FFFFFF",
          dim: "#E2E8F0",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        executive: "0 1px 3px 0 rgba(0, 43, 73, 0.06), 0 1px 2px -1px rgba(0, 43, 73, 0.04)",
        glow: "0 4px 14px -2px rgba(0, 163, 224, 0.25)",
        card: "0 4px 20px -2px rgba(0, 43, 73, 0.08)",
      }
    },
  },
  plugins: [],
}
