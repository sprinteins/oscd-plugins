<svelte:options
	customElement={{
		props: {
			doc: { reflect: true, type: "Object" },
			docName: { reflect: true, type: "String" },
			editCount: { reflect: true, type: "Number" },
			locale: { reflect: true, type: "String" },
			pluginType: { reflect: true, type: "String" },
			isCustomInstance: { reflect: true, type: "Boolean" },
		},
	}}
/>

<script lang="ts">
// PACKAGE
import jsonPackage from '../package.json'
// CORE
import { initPlugin, initScdTemplate, DialogWorkaround } from '@oscd-plugins/core-ui-svelte'
// TYPES
import type { Plugin } from '@oscd-plugins/core-api/plugin/v1'
// COMPONENTS
import { TypeDistributorView } from '@/ui/components/views'
import { Toolbar } from '@/ui/components'

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
	use:initPlugin={{
		getDoc: () => doc,
		getDocName: () => docName,
		getEditCount: () => editCount,
		getEditor: () => editor,
		getIsCustomInstance: () => isCustomInstance,
		getHost: () => $host() || window,
		theme: "legacy-oscd-instance",
		definition: {
			edition: "ed2Rev1",
		},
	}}
	use:initScdTemplate={{pluginName: 'TypeDistributor'}}
	data-plugin-name={jsonPackage.name}
	data-plugin-version={jsonPackage.version}
	class="overflow-hidden"
>
	<div class="flex flex-col w-full h-[--plugin-container-height] min-h-full">
		<Toolbar />
		<TypeDistributorView />
	</div>
	
	<DialogWorkaround />
</main>
