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
	<div class="flex flex-col space-y-9 items-center justify-center h-screen">
		<h1 class="h1 font-black text-9xl">Hello Plugin!</h1>
		<span>See the <i>README</i> file in <b>`packages/template`</b> (oscd-plugins monorepo)</span>
	</div>
</main>


<script lang="ts">
// PACKAGE
import jsonPackage from '../package.json'
// CORE
import { initPlugin, initSsdTemplate } from '@oscd-plugins/core-ui-svelte'
// TYPES
import type { Utils } from '@oscd-plugins/core-api/plugin/v1'

// props
const {
	doc,
	docName,
	editCount,
	isCustomInstance
}: Utils.PluginCustomComponentsProps = $props()
</script>