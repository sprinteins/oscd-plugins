<!-- Link tags are allowed at root of a shadow dom -->
<!-- <link rel="stylesheet" href={fontCss.toString()} />
<link rel="stylesheet" href={themeCss.toString()} />
<link rel="stylesheet" href={svelteMaterialUiCss.toString()} /> -->

<tscd-theme>
	<slot />
</tscd-theme>


<script lang="ts">
import "../assets/styles/fonts.css";
import "../assets/styles/theme.css";
import "svelte-material-ui/bare.css"
//==== STYLES ====//
// const baseURL = new URL(import.meta.url)
// const fontCss = new URL('../assets/styles/fonts.css', baseURL)
// const themeCss = new URL('../assets/styles/theme.css', baseURL)
// const svelteMaterialUiCss = new URL('svelte-material-ui/bare.css', baseURL)

// console.log(fontCss.toString())
// console.log(themeCss.toString())
// console.log(svelteMaterialUiCss.toString())
</script>