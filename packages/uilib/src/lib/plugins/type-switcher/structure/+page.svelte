<script lang="ts">
	import Example from "../../../components/internal/example/example.svelte"
	import { Structure } from "."
import type { Item } from "../../../components/list"
	
	let items: Item[] = [
		{ icon: "dAIcon", primaryText: "primary text", secondaryText: "secondary text"}
	]

</script>

<Example name="Structure">
	<div class="container">
		<Structure 
			{items}
		/>
	</div>
</Example>

<style>
	.container{
		width: 200px;
	}
</style>