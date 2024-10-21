<!-- Link tags are allowed at root of a shadow dom -->
<link rel="stylesheet" href={fontCss} />
<link rel="stylesheet" href={themeCss} />
<link rel="stylesheet" href={svelteMaterialUiCss} />

{#if mode.isStandAlone}
	<DevMenuBar pluginType={pluginType}/>
{/if}
<tscd-theme style={cssDynamicStyles}>
	<slot />
</tscd-theme>


<script lang="ts">
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

// props
export let pluginType: PluginType | undefined = undefined

// local variables

// styles
const baseURL = new URL(import.meta.url)
const fontCss = new URL(fontsUrl, baseURL).href
const themeCss = new URL(themeUrl, baseURL).href
const svelteMaterialUiCss = new URL(svelteMaterialUiUrl, baseURL).href

const cssFixedStyles = {
	'header-height': '',
	'global-height': '',
	'global-background-color': ''
}

//====== REACTIVITY ======//

// stand alone mode works with this setting vite --mode STAND_ALONE
$: mode = {
	isStandAlone: import.meta.env.DEV && import.meta.env.MODE === 'STAND_ALONE',
	isStorybook: import.meta.env.DEV && import.meta.env.MODE === 'STORYBOOK'
}
$: if (mode.isStandAlone) import('normalize.css/normalize.css')
// style
$: cssFixedStyles['header-height'] = setHeaderHeight(mode)
$: cssFixedStyles['global-height'] = setGlobalHeight(mode)
$: cssFixedStyles['global-background-color'] = setGlobalBackgroundColor(mode)
// dynamic inline styles
$: cssDynamicStyles = setInlineStyles(cssFixedStyles)

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
</script>

<style>
	tscd-theme {
		font-family: "Roboto", sans-serif;
		height: var(--global-height);
		display: flex;
		align-items: stretch;
		position: relative;
		background-color: var(--global-background-color);
	}
</style>