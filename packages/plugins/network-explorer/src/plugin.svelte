<svelte:options 
	customElement={{
		props: {
			doc: { reflect: true, type: 'Object'},
			docName: { reflect: true, type: 'String'},
			editCount: { reflect: true, type: 'Number'},
			locale: { reflect: true, type: 'String'},
			pluginType: { reflect: true, type: 'String'},
			isCustomInstance: { reflect: true, type: 'Boolean'},
		}
	}}
/>

<main 
	use:initPlugin={{
		getDoc: () => doc,
		getDocName: () => docName,
		getEditCount: () => editCount,
		getIsCustomInstance: () => isCustomInstance,
		getHost: () => $host() || window,
		theme: 'legacy-oscd-instance',
		definition: {
			edition: 'ed2Rev1',
		}
	}}
	data-plugin-name={jsonPackage.name}
	data-plugin-version={jsonPackage.version}
>
	<MaterialTheme pluginType="editor">
		<NetworkExplorer { doc } { editCount }>
		</NetworkExplorer>
	</MaterialTheme>
</main>


<script lang="ts">
// PACKAGE
import jsonPackage from '../package.json'
// CORE
import { initPlugin, initSsdTemplate } from '@oscd-plugins/core-ui-svelte'
import { MaterialTheme } from '@oscd-plugins/ui'
// TYPES
import type { Utils } from '@oscd-plugins/core-api/plugin/v1'
import NetworkExplorer from './network-explorer.svelte';

// props
const {
	doc,
	docName,
	editCount,
	isCustomInstance
}: Utils.PluginCustomComponentsProps = $props()
</script>