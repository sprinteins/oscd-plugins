<svelte:options tag={null} />

<script lang="ts">
  import { TypeDesigner } from "@oscd-plugins/uilib/src/lib/plugins/type-designer";
  import * as pckg from "../package.json";

  export let doc: XMLDocument;
	export let editCount: number
</script>

{#if doc}
  <TypeDesigner {editCount} root={doc?.documentElement} />
{/if}

<input type="hidden" name="package-name" value={pckg.name} />
<input type="hidden" name="package-version" value={pckg.version} />
