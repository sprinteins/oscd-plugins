<!-- 
 This is needed to convert our component into a web component
 empty tag lets openscd name the component with a specific hash
-->
<svelte:options customElement={null} />
<!-- Link tags are allowed at root of a shadow dom -->
<link rel="stylesheet" href={pluginCss} />
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
// STYLES
import pluginUrl from './style.css?url'
// COMPONENTS
import { MaterialTheme } from '@oscd-plugins/ui'
import { ElementsTypeContainer } from './components'
// PACKAGE
import jsonPackage from '../package.json'
// STORES
import { dataTypeTemplatesStore, pluginStore } from './stores'

const baseURL = new URL(import.meta.url)
const pluginCss = new URL(pluginUrl, baseURL).href

//==== INITIALIZATION ====//
//props
export let xmlDocument: XMLDocument
export let pluginHostElement: Element

//==== REACTIVITY ====//

$: pluginStore.init({
	newXMLDocument: xmlDocument,
	newPluginHostElement: pluginHostElement
})
$: dataTypeTemplatesStore.init(xmlDocument.documentElement)
</script>