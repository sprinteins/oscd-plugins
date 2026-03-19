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

// TYPES
import type { Plugin } from '@oscd-plugins/core-api/plugin/v1'
// CORE
import {
	DialogWorkaround,
	initPlugin,
	initScdTemplate
} from '@oscd-plugins/core-ui-svelte'
import { Toolbar } from '@/ui/components'
// COMPONENTS
import { TypeDistributorView } from '@/ui/components/views'
import jsonPackage from '../package.json'

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
