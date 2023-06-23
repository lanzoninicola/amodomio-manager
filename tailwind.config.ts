const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./app/components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        "brand-green": {
          DEFAULT: "var(--brand-green)",
        },
        "brand-military": {
          DEFAULT: "var(--brand-military)",
        },
        "brand-green-accent": {
          DEFAULT: "var(--brand-green-accent)",
        },
        "brand-yellow": {
          DEFAULT: "var(--brand-yellow)",
        },
        "brand-orange": {
          DEFAULT: "var(--brand-orange)",
        },
        "brand-cloud": {
          DEFAULT: "var(--brand-cloud)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        logo: ["var(--font-logo)", ...fontFamily.sans],
        accent: ["var(--font-accent)", ...fontFamily.sans],
        menu: ["var(--font-menu)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "rotate-360": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        move: {
          "0%": {
            opacity: "0.1",
            transform: "translateX(200px)",
          },
          "10%": {
            opacity: 0.7,
          },
          "90%": {
            opacity: 0,
          },
          "100%": {
            opacity: 0,
            transform: "translateX(-1000px)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "rotate-360": "rotate-360 1s linear infinite",
        "rotate-360-slow": "rotate-360 15s linear infinite",
        move: "move 8s ease-in-out infinite",
        "move-slow": "move 9.2s ease-in-out infinite",
        "move-slower": "move 11.2s ease-in-out infinite",
        "move-slowest": "move 13.5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
