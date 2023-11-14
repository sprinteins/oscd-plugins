<script lang="ts">
	import { GroupCard } from "../group-card"
	import { createEventDispatcher } from "svelte"
	import type { CardItem } from "./card-item"

	// Input
	export let itemSets: CardItem[] = []

	// Internal
	let selectedIndex = -1
	const dispatch = createEventDispatcher()

	function handleClick(index: number) {
		selectedIndex = index
		dispatch("select", { index })
	}
</script>

<group-card-list>
	{#each itemSets as itemSet, ii}
		<GroupCard
			icon={itemSet.icon}
			items={itemSet.items}
			on:click={() => handleClick(ii)}
			dataTestid={`card_${ii}`}
			selected={selectedIndex === ii}
		/>
	{/each}
</group-card-list>

<style>
	group-card-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		overflow-y: auto;
		padding: 1rem 0;
		/* overflow: auto; */
	}
</style>
