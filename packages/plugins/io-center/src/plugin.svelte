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
>
	<div class="w-full">
		<ObjectTree {objectTree} />
	</div>
	<div class="flex flex-col space-y-9 items-center justify-center h-screen">
		<h1 class="h1 font-black text-9xl">Hello Plugin!</h1>
		<span>See the <i>README</i> file in <b>`packages/template`</b> (oscd-plugins monorepo)</span>
	</div>
</main>


<script lang="ts">
import { onMount } from 'svelte'
import jsonPackage from '../package.json'
import type { Utils } from '@oscd-plugins/core-api/plugin/v1'
import Layout from "./ui/layout.svelte"
import store from "./store.svelte"
import { initQuery } from './query.svelte';


// CORE
import { initPlugin, initSsdTemplate } from '@oscd-plugins/core-ui-svelte'
import ObjectTree from './ui/components/object-tree/object-tree.svelte';

const objectTree = [
    {
      name: 'Device1',
	  isOpen: true,
      children: [
        {
          name: 'Node1',
		  isOpen: true,
          children: [
            {
              name: 'ObjectInstance1',
			  isOpen: true,
              children: [
                { name: 'Attribute1' },
                { name: 'Attribute2' },
              ],
            },
            {
              name: 'ObjectInstance2',
			  isOpen: false,
              children: [
                { name: 'Attribute3' },
                { name: 'Attribute4' },
              ],
            },
          ],
        },
        {
          name: 'Node2',
		  isOpen: false,
          children: [
            {
              name: 'ObjectInstance3',
			  isOpen: false,
              children: [
                { name: 'Attribute5' },
                { name: 'Attribute6' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'Device2',
	  isOpen: true,
      children: [
        {
          name: 'Node3',
		  isOpen: true,
          children: [
            {
              name: 'ObjectInstance4',
	  		  isOpen: true,
              children: [
                { name: 'Attribute7' },
                { name: 'Attribute8' },
              ],
            },
          ],
        },
        {
          name: 'Node4',
	  	  isOpen: true,
          children: [
            {
              name: 'ObjectInstance5',
			  isOpen: true,
              children: [
                { name: 'Attribute9' },
                { name: 'Attribute10' },
              ],
            },
          ],
        },
      ],
    },
  ];


// props
const {
	doc,
	docName,
	editCount,
	isCustomInstance
}: Utils.PluginCustomComponentsProps = $props()

initQuery(store)

onMount(() => {
	store.doc = doc
})
// we need to trigger a rerendering when the editCount changes
// this is how OpenSCD lets us know that there was a change in the document
$effect( () => {
	let onlyForEffectTriggering = editCount
	// biome-ignore lint/correctness/noSelfAssign: We need to trigger a rerendering
	store.doc = store.doc
})
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
