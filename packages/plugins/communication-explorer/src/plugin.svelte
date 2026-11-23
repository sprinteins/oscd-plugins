<svelte:options 
	customElement={{
		props: {
			doc: { reflect: true, type: 'Object'},
			docName: { reflect: true, type: 'String'},
			editCount: { reflect: true, type: 'Number'},
			editor: { reflect: true, type: 'Object'},
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
	data-plugin-name={jsonPackage.name}
	data-plugin-version={jsonPackage.version}
>
	<communication-explorer>
		{#if doc}
			<TelemetryView root={doc.documentElement} />
		{/if}
	</communication-explorer>
</main>


<script lang="ts">
// TYPES

import type { XMLEditor } from '@openscd/oscd-editor'
import type { Utils } from '@oscd-plugins/core-api/plugin/v1'
// CORE
import { initPlugin } from '@oscd-plugins/core-ui-svelte'
// PACKAGE
import jsonPackage from '../package.json'
import { clearSelection } from '../src/stores/_store-view-filter'
import TelemetryView from './ui/components/telemetry-view/telemetry-view.svelte'

// Svelte 5 props syntax
const {
	doc,
	docName,
	editCount,
	editor,
	locale,
	pluginType,
	isCustomInstance
}: {
	doc: XMLDocument
	docName: string
	editCount: number
	editor: XMLEditor
	locale: string
	pluginType: string
	isCustomInstance: boolean
} = $props()

// Svelte 5 effect instead of reactive statement
$effect(() => {
	if (doc) {
		clearSelection()
	}
})
</script>


<style>
	communication-explorer {
		display: block;
		position: relative;
		font-size: 12px;
		height: 100%;
	}
</style>
