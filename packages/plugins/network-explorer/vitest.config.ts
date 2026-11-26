import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		include: ['src/**/*.spec.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text'],
			include: ['src/sidebar/new-connection/cable-form.new-connection.ts']
		}
	}
})
