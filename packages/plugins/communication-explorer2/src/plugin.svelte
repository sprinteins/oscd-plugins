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
		<communication-explorer>
			Ey jo
			{#key root}
				<TelemetryView {root} />
			{/key}
		</communication-explorer>
	</MaterialTheme>
</main>


<script lang="ts">
// TYPES
import type { Utils } from '@oscd-plugins/core-api/plugin/v1'

// CORE
import { initPlugin } from '@oscd-plugins/core-ui-svelte'
import { MaterialTheme } from '@oscd-plugins/ui'

// PACKAGE
import jsonPackage from '../package.json'
import TelemetryView from "./ui/components/telemetry-view/telemetry-view.svelte"

// props
const {
	doc,
	docName,
	editCount,
	isCustomInstance,
	root
} = $props<Utils.PluginCustomComponentsProps & { root: Element }>()


</script>


<style>
	communication-explorer {
		display: block;
		position: relative;
		font-size: 12px;
		min-height: 80vh;
	}
</style>
