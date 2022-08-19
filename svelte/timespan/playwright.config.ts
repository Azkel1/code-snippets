import type { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	testDir: './tests',
	webServer: {
		command: 'npm run build && npm run preview',
		port: 3000
	},
	use: {
		baseURL: 'http://localhost:3000',
		trace: 'on-first-retry'
	}
}
export default config
