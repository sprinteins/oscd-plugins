<!-- Link tags are allowed at root of a shadow dom -->
<link rel="stylesheet" href={fontCss} />
<link rel="stylesheet" href={themeCss} />
<link rel="stylesheet" href={svelteMaterialUiCss} />

{#if mode.isStandAlone}
	<DevMenuBar pluginType={pluginType}/>
{/if}
<tscd-theme style={cssDynamicStyles}>
	{@render children?.()}
</tscd-theme>


<script lang="ts">
	import { run } from 'svelte/legacy';

// STYLES
import fontsUrl from '../../assets/styles/fonts.css?url'
import themeUrl from '../../assets/styles/theme.css?url'
import svelteMaterialUiUrl from 'svelte-material-ui/bare.css?url'
// DEV COMPONENTS
import { DevMenuBar } from '../../components/dev'
// UTILS
import { setInlineStyles } from '../../utils'
// TYPES
import type { PluginType } from '@oscd-plugins/core'

//====== INITIALIZATION ======//


	interface Props {
		// props
		pluginType?: PluginType | undefined;
		children?: import('svelte').Snippet;
	}

	let { pluginType = undefined, children }: Props = $props();

// local variables

// styles
const baseURL = new URL(import.meta.url)
const fontCss = new URL(fontsUrl, baseURL).href
const themeCss = new URL(themeUrl, baseURL).href
const svelteMaterialUiCss = new URL(svelteMaterialUiUrl, baseURL).href

const cssFixedStyles = $state({
	'header-height': '',
	'global-height': '',
	'global-background-color': ''
})


//====== FUNCTIONS ======//

function setGlobalHeight(mode: {
	isStandAlone: boolean
	isStorybook: boolean
}) {
	if (mode.isStorybook) return 'inherit'
	return 'calc(100vh - var(--header-height))'
}

function setHeaderHeight(mode: {
	isStandAlone: boolean
	isStorybook: boolean
}) {
	if (mode.isStorybook) return '0px'
	if (mode.isStandAlone) return '64px'
	return '112px'
}

function setGlobalBackgroundColor(mode: {
	isStandAlone: boolean
	isStorybook: boolean
}) {
	if (mode.isStorybook) return 'inherit'
	return 'var(--mdc-theme-surface)'
}
//====== REACTIVITY ======//

// stand alone mode works with this setting vite --mode STAND_ALONE
let mode = $derived({
	isStandAlone: import.meta.env.DEV && import.meta.env.MODE === 'STAND_ALONE',
	isStorybook: import.meta.env.DEV && import.meta.env.MODE === 'STORYBOOK'
})
run(() => {
		if (mode.isStandAlone) import('normalize.css/normalize.css')
	});
// style
run(() => {
		cssFixedStyles['header-height'] = setHeaderHeight(mode)
	});
run(() => {
		cssFixedStyles['global-height'] = setGlobalHeight(mode)
	});
run(() => {
		cssFixedStyles['global-background-color'] = setGlobalBackgroundColor(mode)
	});
let cssDynamicStyles = $derived(setInlineStyles(cssFixedStyles))
</script>

<style>
	tscd-theme {
		font-family: "Roboto", sans-serif;
		display: block;
		position: relative;
		background-color: var(--global-background-color);
	}
</style>