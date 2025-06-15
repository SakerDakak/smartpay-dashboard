/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // دعم الثيم الليلي باستخدام class
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          50: "#FFF9E6",
          100: "#FFF0C2",
          200: "#FFE699",
          300: "#FFDB70",
          400: "#FFD600",
          500: "#F9B233",
          600: "#ffb300",
          700: "#ff9900",
          800: "#ff8800",
          900: "#ff7700",
        },
        // Success
        success: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          DEFAULT: "#12B76A",
        },
        // Warning
        warning: {
          50: "#fffbf3",
          100: "#fff5e0",
          200: "#ffe9c2",
          300: "#ffd79e",
          400: "#ffc26e",
          500: "#ffa53e",
          600: "#f97f0e",
          700: "#d66507",
          800: "#a34e08",
          900: "#733b0b",
          DEFAULT: "#FFF8F1",
        },
        // Danger
        danger: {
          50: "#FDF2F2",
          100: "#FDE8E8",
          200: "#eec9c9",
          300: "#F8B4B4",
          400: "#ee6d6d",
          500: "#F05252",
          600: "#E02424",
          700: "#C81E1E",
          800: "#a91616",
          900: "#8A2C0D",
        },
        // Grey
        grey: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#5c6069",
          700: "#374151",
          800: "#252631",
          900: "#21232e",
        },
         // Background - أغمق ومتماسك أكثر
        background: {
          light: "#F9FAFB",
          dark: "#20212a",
        },
      },

      backgroundImage: {
        "primary-gradient":
          "linear-gradient(180deg, #ffb300 10%, #FFD600 100%)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },

      animation: {
        "gradient-xy": "gradient-xy 15s ease infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse-slow 5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-fast": "pulse-fast 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "ping-slow": "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite",
      },

      keyframes: {
        "gradient-xy": {
          "0%, 100%": {
            "background-size": "400% 400%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: 0.7 },
          "50%": { opacity: 0.3 },
        },
        "pulse-fast": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
      },

      boxShadow: {
        glow: "0 0 5px rgba(255, 255, 255, 0.7), 0 0 10px rgba(255, 255, 255, 0.5)",
        primary: "0 0 5px rgba(255, 211, 0, 0.7), 0 0 10px rgba(255, 179, 0, 0.5)",
        "primary-soft": "0 0 15px rgba(249, 178, 51, 0.15)",
        "primary-strong": "0 0 25px rgba(249, 178, 51, 0.2)",
        "card-light": "0 10px 30px -5px rgba(0, 0, 0, 0.1)",
        "card-dark": "0 10px 30px -5px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [],
};