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
          50:  "#E6F9FF",
          100: "#C2F0FF",
          200: "#99E6FF",
          300: "#70DBFF",
          400: "#00D6FF",
          500: "#33B9FF",
          600: "#2DAAE1",
          700: "#0099FF",
          800: "#0088FF",
          900: "#0077FF",
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
          50:  "#F4F8FB", 
          100: "#E6EEF5", 
          200: "#CBDCE8", 
          300: "#B0C9DA", 
          400: "#90AFC3", 
          500: "#70879D", 
          600: "#5A6D82",
          700: "#445162",
          800: "#2F3743", 
          900: "#1F252F",
        },
         // Background - أغمق ومتماسك أكثر
        background: {
          light: "#E6F9FF",
          dark: "#2DAAE1",
        },
      },

      backgroundImage: {
        "primary-gradient":
          "linear-gradient(180deg, #0077FF 10%, #00D6FF 100%)",
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
        primary: "0 0 5px rgba(45, 174, 225, 0.7), 0 0 10px rgba(45, 174, 225, 0.5)",
        "primary-soft": "0 0 15px rgba(45, 174, 225, 0.15)",
        "primary-strong": "0 0 25px rgba(45, 174, 225, 0.2)",
        "card-light": "0 10px 30px -5px rgba(0, 0, 0, 0.1)",
        "card-dark": "0 10px 30px -5px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [],
};
