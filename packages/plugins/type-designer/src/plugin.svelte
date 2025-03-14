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

<script lang="ts">
// PACKAGE
import jsonPackage from '../package.json'
// CORE
import {
	Sidebar,
	initPlugin,
	initSsdTemplate,
	removeInstanceWarningAndIssueToast,
	DialogWorkaround
} from '@oscd-plugins/core-ui-svelte'
// STORES
import { pluginLocalStore } from '@/headless/stores'
// COMPONENTS
import ColumnsContainer from '@/ui/views/columns-container.svelte'
import SidebarWrapper from '@/ui/components/sidebar-wrapper.svelte'
import ImportDialog from '@/ui/components/import/compas/import-dialog.svelte'
// TYPES
import type { Plugin } from '@oscd-plugins/core-api/plugin/v1'

// props
const {
	doc,
	docName,
	editCount,
	isCustomInstance
}: Plugin.CustomComponentsProps = $props()
</script>

<main 
	id="plugin-container"
	use:initPlugin={{
		getDoc: () => doc,
		getDocName: () => docName,
		getEditCount: () => editCount,
		getIsCustomInstance: () => isCustomInstance,
		getHost: () => $host() || window,
		getRootElement: () => pluginLocalStore.rootElement,
		customNamespaces: [
			{ 
				namespacePrefix: pluginLocalStore.pluginNamespacePrefix,
				namespaceUri: pluginLocalStore.pluginNamespacePrefix 
			}
		],
		theme: 'legacy-oscd-instance',
		definition: {
			edition: 'ed2Rev1',
			revision: 'IEC61850-90-30'
		}
	}}
	use:initSsdTemplate={{pluginName: 'TypeDesigner'}}
	use:removeInstanceWarningAndIssueToast
	data-plugin-name={jsonPackage.name}
	data-plugin-version={jsonPackage.version}
>
	<Sidebar.Provider
		open={false}
		class="overflow-hidden h-[--plugin-container-height] min-h-full"
		style="--sidebar-width: 20rem; --sidebar-width-mobile: 20rem;"
	>
		<ColumnsContainer />
		<SidebarWrapper />
	</Sidebar.Provider>
</main>


