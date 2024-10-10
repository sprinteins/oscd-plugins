<!-- Link tags are allowed at root of a shadow dom -->
<link rel="stylesheet" href={fontCss} />
<link rel="stylesheet" href={themeCss} />
<link rel="stylesheet" href={svelteMaterialUiCss} />

{#if isStandAloneMode}
	<DevMenuBar />
	{/if}
<tscd-theme>
	<slot />
</tscd-theme>


<script lang="ts">
// STYLES
import fontsUrl from '../../assets/styles/fonts.css?url'
import themeUrl from '../../assets/styles/theme.css?url'
import svelteMaterialUiUrl from 'svelte-material-ui/bare.css?url'
// DEV COMPONENTS
import { DevMenuBar } from '../../components/dev'

//====== STYLES ======//
const baseURL = new URL(import.meta.url)
const fontCss = new URL(fontsUrl, baseURL).href
const themeCss = new URL(themeUrl, baseURL).href
const svelteMaterialUiCss = new URL(svelteMaterialUiUrl, baseURL).href

//====== REACTIVITY ======//
// stand alone mode works with this setting vite --mode STAND_ALONE
$: isStandAloneMode =
	import.meta.env.DEV && import.meta.env.MODE === 'STAND_ALONE'
$: if (isStandAloneMode) import('normalize.css/normalize.css')
</script>