<script lang="ts">
  import { generateMockRootNode } from "../../../mocks/root-node"
import Sidebar from "./sidebar.svelte"

const rootNode = generateMockRootNode()

</script>

<h1>Add Sidebar</h1>

<div style="position: relative; height: 100vh;">
	{#await rootNode then value}
    	<Sidebar rootNode={value} />
	{/await}
</div>
