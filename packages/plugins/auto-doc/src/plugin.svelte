
<!-- Plugin logs -->
<input type="hidden" name="package-name" value={jsonPackage.name} />
<input type="hidden" name="package-version" value={jsonPackage.version} />


<MaterialTheme pluginType={pluginType}>
	<auto-doc>
		<!-- <ElementsTypeContainer /> -->
		 <Table/>
	</auto-doc>
</MaterialTheme>

<script lang="ts">
// COMPONENTS
import { MaterialTheme } from '@oscd-plugins/ui'
import { ElementsTypeContainer, Table } from './components'
// PACKAGE
import jsonPackage from '../package.json'
// STORES
import { pluginStore, dataTypeTemplatesStore } from './stores'
// TYPES
import type { PluginType } from '@oscd-plugins/core'

//==== INITIALIZATION ====//
//props
export let xmlDocument: XMLDocument | undefined = undefined
export let pluginHostElement: Element
export let pluginType: PluginType = 'editor'

//==== REACTIVITY ====//

$: pluginStore.init({
	newXMLDocument: xmlDocument,
	newPluginHostElement: pluginHostElement
})

$: dataTypeTemplatesStore.init(xmlDocument?.documentElement)

</script>
	