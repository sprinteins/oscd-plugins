<svelte:options tag={null} />

<script lang="ts">
import { TypeDesignerPlugin } from '@oscd-plugins/uilib'
import * as pckg from '../package.json'

export let doc: XMLDocument
</script>

{#if doc}
	<TypeDesignerPlugin xmlDocument={doc} />
{/if}

<input type="hidden" name="package-name" value={pckg.name} />
<input type="hidden" name="package-version" value={pckg.version} />
