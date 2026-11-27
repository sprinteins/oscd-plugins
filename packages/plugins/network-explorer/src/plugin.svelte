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
		getEditor: () => editor,
		getIsCustomInstance: () => isCustomInstance,
		getHost: () => $host() || window,
		theme: 'legacy-oscd-instance',
		definition: {
			edition: 'ed2Rev1',
		}
	}}
	use:injectDiagramStyles={componentStyles}
	data-plugin-name={jsonPackage.name}
	data-plugin-version={jsonPackage.version}
>
	<NetworkExplorer doc={doc} editCount={editCount} />
</main>


<script lang="ts">
// PACKAGE

// TYPES
import type { Plugin } from '@oscd-plugins/core-api/plugin/v1'
// CORE
import { initPlugin } from '@oscd-plugins/core-ui-svelte'
import jsonPackage from '../package.json'
import { injectDiagramStyles } from './diagram/inject-styles.diagram'
import NetworkExplorer from './network-explorer.svelte'
import componentStyles from './styles.css?inline'

// props
const {
	doc,
	docName,
	editCount,
	editor,
	isCustomInstance
}: Plugin.CustomComponentsProps = $props()
</script>

<style>
	main {
		--sidebar-width: 20rem;
		--color-white: #f9f7f1;
		--color-cyan: #2aa198;
		--color-red: #b00020;
	}
</style>