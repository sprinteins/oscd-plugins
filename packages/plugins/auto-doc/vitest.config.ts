import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		globals: true,
		environment: 'jsdom', // Or 'jsdom', depending on your needs
		setupFiles: './tests/setupTests.ts',
		include: ['**/*.spec.ts'] // Ensure this pattern matches your test files
	}
})
