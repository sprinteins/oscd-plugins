<main 
	use:initPlugin={{
		getDoc: () => doc,
		getDocName: () => docName,
		getEditCount: () => editCount,
		getIsCustomInstance: () => isCustomInstance,
		host: $host(),
		theme: 'legacy-oscd-instance'
	}}
	data-plugin-name={jsonPackage.name}
	data-plugin-version={jsonPackage.version}
	bind:this={root}
>
<Layout>
	<div slot="sidebar-left">
		<IEDSelect ieds={store.iedList} />
		<ObjectTreeView />
	</div>
	<div slot="content">
		Document: {docName}
		<p>
			<button onclick={addIED}>Add IED</button>
		</p>
	</div>
	<div slot="sidebar-right">sidebar right</div>
</Layout>
</main>


<script lang="ts">

import { onMount } from 'svelte'
import jsonPackage from '../package.json'
import { initPlugin, initSsdTemplate } from '@oscd-plugins/core-ui-svelte'
import type { Utils } from '@oscd-plugins/core-api/plugin/v1'
import Layout from "./ui/layout.svelte"
import store from "./store.svelte"
import { initQuery } from './query.svelte';
import { newCommand, type Command } from "./command.svelte"
import IEDSelect from "./ied/ied-select.svelte"
import type { Nullable } from './types';
import ObjectTreeView from './ui/components/views/object-tree-view.svelte';



// props
const {
	doc,
	docName,
	editCount,
	// isCustomInstance
}: Utils.PluginCustomComponentsProps = $props()


// 
// Setup
// 
let root = $state<Nullable<HTMLElement>>(null)
let cmd = $state<Command>(newCommand(store, () => root))

initQuery(store)
onMount(() => { storeDoc(doc) })
// we need to trigger a rerendering when the editCount changes
// this is how OpenSCD lets us know that there was a change in the document
$effect( () => {
	let onlyForEffectTriggering = editCount
	storeDoc(store.doc)
})


function storeDoc(doc: Nullable<XMLDocument>){
	console.log("changing doc:", doc)
	store.doc = doc
}

function addIED(){
	cmd.addIED()
}


</script>

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
