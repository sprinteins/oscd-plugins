
<!-- 
 This is needed to convert our component into a web component
 empty tag lets openscd name the component with a specific hash
-->
<svelte:options customElement={null} />
<!-- Link tags are allowed at root of a shadow dom -->

<!-- <link rel="stylesheet" href={styleURL} /> -->

<!-- Plugin logs -->
<input type="hidden" name="package-name" value={jsonPackage.name} />
<input type="hidden" name="package-version" value={jsonPackage.version} />

{#if xmlDocument}
<MaterialTheme>
	<type-designer bind:this={htmlRoot}>
		<ElementsTypeContainer />
	</type-designer>
</MaterialTheme>

{/if}

<style>
	:root,
	:host {
		--header-height: 128px;
	}
	type-designer {
		height: calc(100vh - var(--header-height));
		display: flex;
		align-items: stretch;
		position: relative;
	}
	</style>



<script lang="ts">
// COMPONENTS
import { MaterialTheme } from '@oscd-plugins/ui'
import { ElementsTypeContainer } from './components'
// PACKAGE
import jsonPackage from '../package.json'
// STORES
import { dataTypeTemplatesStore, xmlDocumentStore } from './stores'

//==== STYLES ====//
// const baseURL = new URL(import.meta.url)
// const cssURL = new URL(css)
// const styleURL = css.toString()

//==== INITIALIZATION ====//
//props
export let xmlDocument: XMLDocument
// refs
let htmlRoot: HTMLElement

//==== REACTIVITY ====//

$: xmlDocumentStore.init(xmlDocument)
$: dataTypeTemplatesStore.init(xmlDocument.documentElement)
</script>
	