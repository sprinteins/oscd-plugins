<script lang="ts">
	import { Example } from "../../../components/internal"
	import { CategorySelector, type EventDetailCategorySelect } from "."

	import type { ElementCategory } from "./categories"
	import { UIState } from "../ui-state"

	const categories: ElementCategory[] = [
		"LN Type",
		"DO Type",
		"DA Type",
		"Enum Type",
	]

	let selectedIndex: number[] = []
	function handleSelect(e: CustomEvent<EventDetailCategorySelect>){
		selectedIndex = e.detail.selection
	}
	$: selection = selectedIndex.map( ix => categories[ix] )


</script>
  
<Example name="Category Selector">
	<div>
		<CategorySelector 
			testid="category-selector" 
			labels={categories} 
			on:select={handleSelect}
		/>
	</div>
	<hr />
	<div>
		Selected<pre>{selection}</pre>
	</div>
</Example>