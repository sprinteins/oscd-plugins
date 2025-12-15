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
// TYPES
import type { Utils } from '@oscd-plugins/core-api/plugin/v1'
// CORE
import { initPlugin } from '@oscd-plugins/core-ui-svelte'
import { MaterialTheme } from '@oscd-plugins/ui'
// PACKAGE
import jsonPackage from '../package.json'

import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'

import { docTemplatesStore } from './stores'

import ViewNavigator from './ui/components/views/view-navigator/view-navigator.svelte'

// props
const {
	doc,
	docName,
	editCount,
	isCustomInstance
}: Utils.PluginCustomComponentsProps = $props()

let hasRunInit = $state(false)

$effect(() => {
	setTimeout(() => {
		docTemplatesStore.init()
		hasRunInit = true
	}, 0)
})
</script>

<main
  use:initPlugin={{
    getDoc: () => doc,
    getDocName: () => docName,
    getEditCount: () => editCount,
    getIsCustomInstance: () => isCustomInstance,
    getHost: () => $host() || window,
    theme: "legacy-oscd-instance",
    definition: {
      edition: "ed2Rev1",
    },
  }}
  data-plugin-name={jsonPackage.name}
  data-plugin-version={jsonPackage.version}
>
  <MaterialTheme pluginType="editor">
    <auto-doc class="auto-doc">
      {#if hasRunInit && pluginGlobalStore.xmlDocument}
        <ViewNavigator></ViewNavigator>
      {:else}
        <div class="file-missing">
          <p>No XML file loaded</p>
        </div>
      {/if}
    </auto-doc>
  </MaterialTheme>
</main>

<style lang="scss">
	:global(main) {
		min-height: var(--plugin-container-height);
		height: auto;
	}

  .file-missing {
    padding-top: 20px;
    p {
      text-align: center;
    }
  }
</style>
