import type { StorybookConfig } from '@storybook/svelte-vite'

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts|svelte)'],
	addons: [
		'@storybook/addon-svelte-csf',
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@chromatic-com/storybook',
		'@storybook/addon-interactions'
	],
	framework: {
		name: '@storybook/svelte-vite',
		options: {}
	},
	async viteFinal(config) {
		const { mergeConfig } = await import('vite')
		return mergeConfig(config, {
			mode: 'STORYBOOK'
		})
	}
}
export default config
