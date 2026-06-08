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
        "m3-primary": "var(--md-sys-color-primary)",
        "m3-on-primary": "var(--md-sys-color-on-primary)",
        "m3-primary-container": "var(--md-sys-color-primary-container)",
        "m3-on-primary-container": "var(--md-sys-color-on-primary-container)",
        "m3-secondary": "var(--md-sys-color-secondary)",
        "m3-on-secondary": "var(--md-sys-color-on-secondary)",
        "m3-secondary-container": "var(--md-sys-color-secondary-container)",
        "m3-on-secondary-container": "var(--md-sys-color-on-secondary-container)",
        "m3-surface": "var(--md-sys-color-surface)",
        "m3-on-surface": "var(--md-sys-color-on-surface)",
        "m3-surface-variant": "var(--md-sys-color-surface-variant)",
        "m3-on-surface-variant": "var(--md-sys-color-on-surface-variant)",
        "m3-outline": "var(--md-sys-color-outline)",
        "m3-outline-variant": "var(--md-sys-color-outline-variant)",
        "m3-error": "var(--md-sys-color-error)",
        "m3-on-error": "var(--md-sys-color-on-error)",
        "m3-error-container": "var(--md-sys-color-error-container)",
        "m3-on-error-container": "var(--md-sys-color-on-error-container)",
      },
      spacing: {
        header: "var(--spacing-header)",
        sidebar: "var(--spacing-sidebar)",
        'sp-1': 'var(--sp-space-1, 0.25rem)',
        'sp-2': 'var(--sp-space-2, 0.5rem)',
        'sp-3': 'var(--sp-space-3, 0.75rem)',
        'sp-4': 'var(--sp-space-4, 1rem)',
        'sp-5': 'var(--sp-space-5, 1.5rem)',
        'sp-6': 'var(--sp-space-6, 2rem)',
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
        'safe-top': 'var(--safe-top, env(safe-area-inset-top))',
        'safe-bottom': 'var(--safe-bottom, env(safe-area-inset-bottom))',
        'safe-left': 'var(--safe-left, env(safe-area-inset-left))',
        'safe-right': 'var(--safe-right, env(safe-area-inset-right))',
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
