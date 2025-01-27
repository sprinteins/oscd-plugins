import tailwindConfig from './src/lib/theme/tailwind-preset'
// TYPES
import type { Config } from 'tailwindcss'

const config: Config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	presets: [tailwindConfig]
}

export default config
