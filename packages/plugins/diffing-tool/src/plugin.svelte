<script lang="ts">
  import { DiffingTool } from "@oscd-plugins/uilib/src/lib/plugins/diffing-tool"
  import * as pckg from "../package.json"
</script>

<main>
  <DiffingTool />

<input type="hidden" name="package-name" value={pckg.name} />
<input type="hidden" name="package-version" value={pckg.version} />

</main>

<style>
.tscd-h1{
    color: green
}
.plugin-content {
    width: 50%;
    height: 50%;
    margin: 0 auto;
    display: block;
}
</style>

