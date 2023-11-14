<script lang="ts">
	import Example from "../../../components/internal/example/example.svelte"
	import { GroupCardList } from "."
	import type { CardItem } from "./card-item"

	const itemSets: CardItem[] = [
		{ icon: "lNIcon", items: ["phaseA", "phaseB", "phaseC","phaseD","phaseE","phaseF"] },
		{ icon: "dAIcon", items: ["phaseA", "phaseB", "phaseC","phaseD"] },
		{ icon: "dOIcon", items: ["phaseA", "phaseB", "phaseC","phaseD","phaseF"] },
	]

	let selectedIndex = -1
	function handleSelect(index:number){
		selectedIndex = index
	}
	$: selection = selectedIndex >= 0 ? itemSets[selectedIndex] : []

</script>

<Example name="Group Card List">
	<div class="container">
		<GroupCardList 
			{itemSets} 
			on:select={(e) => handleSelect(e.detail.index)}
		/>
	</div>
	<hr />
	<div>
		Selection: <pre>{selection}</pre>
	</div>
</Example>

<style>
	.container{
		width: 200px;
	}
</style>