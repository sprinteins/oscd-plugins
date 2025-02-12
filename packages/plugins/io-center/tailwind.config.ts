import TailwindPreset from '@oscd-plugins/core-ui-svelte/preset'
// TYPES
import type { Config } from 'tailwindcss'

export default {
	presets: [TailwindPreset],
	theme: {
		extend: {
			colors: {
				'beige': 'rgb(197, 185, 163)',
			},
		},
	},
} satisfies Omit<Config, 'content'>
