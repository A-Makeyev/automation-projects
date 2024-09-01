import { defineConfig, devices } from '@playwright/test'


export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html', 
  
  use: {
    headless: true,
    baseURL: 'https://jsonplaceholder.typicode.com',
    // extraHTTPHeaders: {
    //   'Authorization': `token ${process.env.API_TOKEN}`,
    // },
    // proxy: {
    //   server: 'http://my-proxy:8080',
    //   username: 'user',
    //   password: 'secret'
    // },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
})
