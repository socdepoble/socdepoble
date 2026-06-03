const { devices } = require('@playwright/test');

module.exports = {
  testDir: './tests/e2e',
  projects: [
    {
      name: 'webkit',
      use: {
        ...devices['iPad Air'],
        browserName: 'webkit', // Simula WKWebView (Safari iOS)
        viewport: { width: 820, height: 1180 }, // iPad A10
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
        deviceScaleFactor: 2, // Retina
        isMobile: true,
        hasTouch: true,
        defaultBrowserType: 'webkit',
      },
    },
  ],
  webServer: {
    command: 'npm run dev', // Inicia el servidor Vite/React
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },
  timeout: 60000, // 60s per a tests lents en WKWebView
};
