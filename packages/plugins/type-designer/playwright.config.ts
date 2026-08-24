import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
	testDir: './e2e',
	timeout: 60_000,
	expect: {
		timeout: 5_000,
	},
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [
		['list'],
		['html', { open: 'never' }],
	],
	use: {
		baseURL: 'http://localhost:4175',
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
	},

	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
			},
		},
	],

	webServer: {
		command: 'pnpm run dev',
		port: 4175,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	},
})