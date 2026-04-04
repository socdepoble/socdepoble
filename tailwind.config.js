/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", ":root.light"],
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ['"Noto Sans"', 'sans-serif'] },
      colors: {
        "theme-base": "var(--bg-app)",
        "theme-panel": "var(--bg-panel)",
        "theme-sidebar": "var(--bg-sidebar)",
        "theme-text": "var(--text-main)",
        "theme-muted": "var(--text-muted)",
        "border-master": "var(--border-master)",
        primary: "var(--theme-accent-primary)",
        secondary: "var(--theme-accent-secondary)",
      },
      spacing: {
        header: "var(--spacing-header)",
        sidebar: "var(--spacing-sidebar)",
      },
      borderRadius: {
        genesis: "var(--radius-genesis)",
        tactile: "var(--radius-tactile)",
      },
      zIndex: {
        base: "var(--z-base)",
        dropdown: "var(--z-dropdown)",
        sticky: "var(--z-sticky)",
        overlay: "var(--z-overlay)",
        sidebar: "var(--z-sidebar)",
        modal: "var(--z-modal)",
        toast: "var(--z-toast)",
        max: "var(--z-max)",
      },
      boxShadow: {
        glass: "var(--glass-shadow)",
      },
      padding: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      minHeight: {
        'dvh': '100dvh',
        'fill-available': '-webkit-fill-available',
      },
      height: {
        'dvh': '100dvh',
        'fill-available': '-webkit-fill-available',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true
  }
};
