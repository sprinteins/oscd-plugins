<svelte:options tag={null} />

<script lang="ts">
  import { TypeDesigner } from "@oscd-plugins/uilib/src/lib/plugins/type-designer";
  import * as pckg from "../package.json";

  // TODO 20.09 - not passed
  // <Plugin> was created without expected prop 'root'
  // <Plugin> was created without expected prop 'editCount'
  export let doc: XMLDocument
  export let editCount: number
  export let root: Element
</script>

{#if doc}
  <TypeDesigner doc={root} {editCount} root={doc?.documentElement} />
{/if}

<input type="hidden" name="package-name" value={pckg.name} />
<input type="hidden" name="package-version" value={pckg.version} />
