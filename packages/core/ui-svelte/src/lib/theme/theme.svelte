<!-- Link tags are allowed at root of a shadow dom -->
<link rel="stylesheet" href={themeCss} />
<link rel="stylesheet" href={fontCss} />

<script lang="ts">
// STYLES
import themeUrl from './styles/theme.css?url'
import fontsUrl from './styles/fonts.css?url'
// UTILS
import { setInlineStyles } from '$lib/utils/style.js'
// LIBRARIES
import { mode as themeMode } from 'mode-watcher'
// TYPES
import type { Snippet } from 'svelte'

//====== INITIALIZATION ======//

// props
const {
	children,
	pluginName,
	pluginVersion
}: {
	children: Snippet
	pluginName?: string
	pluginVersion?: string
} = $props()

// // styles
const baseURL = new URL(import.meta.url)
const themeCss = new URL(themeUrl, baseURL).href
const fontCss = new URL(fontsUrl, baseURL).href

//====== REACTIVITY ======//

const mode = $state({
	isDev: import.meta.env.DEV,
	isStorybook: import.meta.env.DEV && import.meta.env.MODE === 'STORYBOOK'
})

const cssFixedStyles = $derived({
	'header-height': setHeaderHeight(mode),
	'global-height': setGlobalHeight(mode),
	'global-background-color': setGlobalBackgroundColor(mode)
})

const cssDynamicStyles = $derived(setInlineStyles(cssFixedStyles))

//====== FUNCTIONS ======//

function setGlobalHeight(mode: {
	isStorybook: boolean
}) {
	if (mode.isStorybook) return 'inherit'
	return 'calc(100vh - var(--header-height))'
}

function setHeaderHeight(mode: {
	isStorybook: boolean
}) {
	return '116px'
}

function setGlobalBackgroundColor(mode: {
	isStorybook: boolean
}) {
	if (mode.isStorybook) return 'inherit'
	return 'var(--mdc-theme-surface)'
}
</script>

<main class="{$themeMode} h-full w-full" style={cssDynamicStyles} data-plugin-name={pluginName} data-plugin-version={pluginVersion}>
	{@render children?.()}
</main>

<style>
	main {
		font-family: "Roboto", sans-serif;
		height: var(--global-height);
		display: block;
		position: relative;
		background-color: var(--global-background-color);
	}
</style>