<script lang="ts">
  import * as pckg from "../package.json";
  import Documentation from "@oscd-plugins/uilib/src/lib/plugins/documentation/documentation.svelte";

  export let doc: XMLDocument;
</script>

<main>
  <Documentation root={doc?.documentElement} />

  <input type="hidden" name="package-name" value={pckg.name} />
  <input type="hidden" name="package-version" value={pckg.version} />
</main>

<style>
</style>
