<svelte:options tag={null} />

<script lang="ts">
  import { IOCenter } from "@oscd-plugins/uilib/src/lib/plugins/io-center";
  import * as pckg from "../package.json";

  // Inputs
  export let doc: XMLDocument;
</script>

{#if doc}
  <IOCenter root={doc?.documentElement} />
{/if}

<input type="hidden" name="package-name" value={pckg.name} />
<input type="hidden" name="package-version" value={pckg.version} />
