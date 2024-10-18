
<!-- Plugin logs -->
<input type="hidden" name="package-name" value={jsonPackage.name} />
<input type="hidden" name="package-version" value={jsonPackage.version} />

<!-- {#if xmlDocument} -->
<MaterialTheme>
	<auto-doc>
		<ElementsTypeContainer />
	</auto-doc>
</MaterialTheme>
<!-- {/if} -->

<script lang="ts">
// COMPONENTS
import { MaterialTheme } from '@oscd-plugins/ui'
import { ElementsTypeContainer } from './components'
// PACKAGE
import jsonPackage from '../package.json'
// STORES
import { pluginStore, dataTypeTemplatesStore } from './stores'

import type { PluginType } from '@oscd-plugins/core'

//==== INITIALIZATION ====//
//props
export let xmlDocument: XMLDocument
export let pluginHostElement: Element
export let pluginType: PluginType = 'editor'

//==== REACTIVITY ====//

$: pluginStore.init({
	newXMLDocument: xmlDocument,
	newPluginHostElement: pluginHostElement
})

$: dataTypeTemplatesStore.init(xmlDocument?.documentElement)

</script>
	