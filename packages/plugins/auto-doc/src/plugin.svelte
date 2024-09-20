<svelte:options tag={null} />

<script lang="ts">
  import { AutoDoc } from "@oscd-plugins/uilib/src/lib/plugins/auto-doc";
  import * as pckg from "../package.json";

  // Inputs
  export let doc: XMLDocument;
</script>

{#if doc}
  <AutoDoc root={doc?.documentElement} />
{/if}

<input type="hidden" name="package-name" value={pckg.name} />
<input type="hidden" name="package-version" value={pckg.version} />
