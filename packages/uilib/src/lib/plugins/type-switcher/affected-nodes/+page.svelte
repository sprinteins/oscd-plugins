<script lang="ts">
	import Example from "../../../components/internal/example/example.svelte"
	import { AffectedNodes } from "."
import type { Item } from "../../../components/list"

	let items: Item[] = [
		{ icon: "dAIcon", secondaryText: "dOIcon", primaryText: "b1"}
	]

</script>

<Example name="Affected Nodes">
	<div class="container">
		<AffectedNodes 
			{items}
		/>
	</div>
</Example>

<style>
	.container{
		width: 200px;
	}
</style>