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
import ImportToolbar from '@/ui/components/import/import-toolbar.svelte'
import ColumnsContainer from '@/ui/views/columns-container.svelte'
import SidebarWrapper from '@/ui/components/sidebar/sidebar-wrapper.svelte'
// TYPES
import type { Plugin } from '@oscd-plugins/core-api/plugin/v1'

// props
const {
	doc,
	docName,
	editCount,
	editor,
	isCustomInstance
}: Plugin.CustomComponentsProps = $props()
</script>

<main
	id="plugin-container"
	class="overflow-hidden"
	use:initPlugin={{
		getDoc: () => doc,
		getDocName: () => docName,
		getEditCount: () => editCount,
		getEditor: () => editor,
		getIsCustomInstance: () => isCustomInstance,
		getHost: () => $host() || window,
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
		class=" h-[--plugin-container-height] min-h-full"
		style="--sidebar-width: 20rem; --sidebar-width-mobile: 20rem;"
	>
		<div class="flex flex-col w-full h-[--plugin-container-height] min-h-full">
			<ImportToolbar />
			<ColumnsContainer />
		</div>
		<SidebarWrapper />
	</Sidebar.Provider>
	
	<DialogWorkaround />

</main>


