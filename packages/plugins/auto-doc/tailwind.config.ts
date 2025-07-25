import TailwindPreset from '@oscd-plugins/core-ui-svelte/preset'
// TYPES
import type { Config } from 'tailwindcss'

export default {
	presets: [TailwindPreset]
} satisfies Omit<Config, 'content'>
