
<!-- 
 This is needed to convert our component into a web component
 empty tag lets openscd name the component with a specific hash
-->
<svelte:options customElement={null} />
<!-- Plugin logs -->
<input type="hidden" name="package-name" value={jsonPackage.name} />
<input type="hidden" name="package-version" value={jsonPackage.version} />

{#if xmlDocument}
<MaterialTheme>
	<auto-doc>
		<ElementsTypeContainer />
	</auto-doc>
</MaterialTheme>
{/if}

<script lang="ts">
// COMPONENTS
import { MaterialTheme } from '@oscd-plugins/ui'
import { ElementsTypeContainer } from './components'
// PACKAGE
import jsonPackage from '../package.json'
// STORES
import { pluginStore } from './stores'

//==== INITIALIZATION ====//
//props
export let xmlDocument: XMLDocument
export let pluginHostElement: Element

//==== REACTIVITY ====//

$: pluginStore.init({
	newXMLDocument: xmlDocument,
	newPluginHostElement: pluginHostElement
})
</script>
	