<svelte:options tag={null} />

<script lang="ts">
  import { TypeDesigner } from "@oscd-plugins/uilib/src/lib/plugins/type-designer";
  import * as pckg from "../package.json";

  // Inputs
  export let doc: XMLDocument;
</script>

{#if doc}
  <TypeDesigner root={doc?.documentElement} />
{/if}

<input type="hidden" name="package-name" value={pckg.name} />
<input type="hidden" name="package-version" value={pckg.version} />
