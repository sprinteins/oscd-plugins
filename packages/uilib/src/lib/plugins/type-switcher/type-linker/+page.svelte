<script lang="ts">
	import Example from "../../../components/internal/example/example.svelte"
	import { TypeLinker } from "."
	import type {
		EventDetailRelink,
		EventDetailTypeLinkerSelect,
	} from "./events"

	const items: string[] = [
		"phaseA",
		"phaseB",
		"phaseC",
		"phaseD",
		"phaseE",
		"phaseF",
	]

	let selectedIndex = -1

	let selection: string[] = []
	function handleSelect(event: CustomEvent<EventDetailTypeLinkerSelect>) {
		const indexes = event.detail.indexes
		selection = indexes.map((ix) => items[ix])
	}

	let eventFired: EventDetailRelink
	function handleRelink(event: CustomEvent<EventDetailRelink>) {
		eventFired = event.detail
	}
</script>

<Example name="Type Linker">
	<div class="container">
		<TypeLinker
			items={items.map((item) => ({ label: item }))}
			on:select={handleSelect}
			on:relink={handleRelink}
		/>
	</div>
	<hr />
	<div>
		<span>Selection:</span>
		<pre>{selection}</pre>
	</div>
	<div>
		<span>Last event:</span>
		<pre>{JSON.stringify(eventFired)}</pre>
	</div>
</Example>

<style>
	.container {
		width: 250px;
	}
</style>
