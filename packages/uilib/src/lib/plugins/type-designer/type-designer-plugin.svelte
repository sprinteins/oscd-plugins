<Theme>
	<type-designer bind:this={htmlRoot}>
		<ElementsTypeContainer />
	</type-designer>
</Theme>

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
import { onMount } from 'svelte'
// COMPONENTS
import Theme from '../../theme/theme.svelte'
import { ElementsTypeContainer } from './components'
// STORES
import { dataTypeTemplatesStore, xmlDocumentStore } from './stores'

//==== INITIALIZATION ====//
//props
export let xmlDocument: XMLDocument

// refs
let htmlRoot: HTMLElement

//==== HOOKS ====//
onMount(() => {
	xmlDocumentStore.init(xmlDocument)
	dataTypeTemplatesStore.init(xmlDocument.documentElement)
})
</script>
