/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}",],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        // Paleta principal
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9", // Cor principal
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        // Cores semânticas
        success: {
          50: "#f0fdf4",
          500: "#10b981", // Verde para conclusão
          900: "#064e3b",
        },
        warning: {
          50: "#fefce8",
          500: "#f59e0b", // Amarelo para alertas
          900: "#78350f",
        },
        danger: {
          50: "#fef2f2",
          500: "#ef4444", // Vermelho para urgente
          900: "#7f1d1d",
        },
        // Tons neutros modernos
        neutral: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        // Cor acentual complementar
        secondary: {
          500: "#8b5cf6", // Violeta para destaques
        },
      },
    },
  },
  plugins: [],
};
