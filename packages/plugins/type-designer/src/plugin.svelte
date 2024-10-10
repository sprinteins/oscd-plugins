
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
	<type-designer>
		<ElementsTypeContainer />
	</type-designer>
</MaterialTheme>
{/if}

<script lang="ts">
// COMPONENTS
import { MaterialTheme } from '@oscd-plugins/ui'
import { ElementsTypeContainer } from './components'
// PACKAGE
import jsonPackage from '../package.json'
// STORES
import { dataTypeTemplatesStore, xmlDocumentStore } from './stores'

//==== INITIALIZATION ====//
//props
export let xmlDocument: XMLDocument

//==== REACTIVITY ====//

$: xmlDocumentStore.init(xmlDocument)
$: dataTypeTemplatesStore.init(xmlDocument.documentElement)
</script>
	