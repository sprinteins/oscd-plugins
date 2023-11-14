<svelte:options tag={null} />

<script lang="ts">
  import { TypeSwitcher } from "@oscd-plugins/uilib/src/lib/plugins/type-switcher";
  import * as pckg from "../package.json";

  // Inputs
  export let doc: XMLDocument;
</script>

{#if doc}
  {#key doc}
    <TypeSwitcher doc={doc?.documentElement} />
  {/key}
{/if}

<input type="hidden" name="package-name" value={pckg.name} />
<input type="hidden" name="package-version" value={pckg.version} />
