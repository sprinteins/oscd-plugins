<svelte:options tag={null} />

<script lang="ts">
import { PluginStore } from '@oscd-plugins/uilib/src/lib/plugins/plugin-store'
import * as pckg from '../package.json'

// Inputs
export let doc: XMLDocument
</script>

{#if doc}
<PluginStore root={doc?.documentElement} />
{/if}

<input type="hidden" name="package-name" value={pckg.name} />
<input type="hidden" name="package-version" value={pckg.version} />
