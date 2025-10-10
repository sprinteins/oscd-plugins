<script lang="ts">
	import { GroupCard } from "../group-card";
	import type { CardItem } from "./card-item";

	interface Props {
		// Input
		select: (detail: { index: number }) => void;
		itemSets?: CardItem[];
	}

	let { select, itemSets = [] }: Props = $props();

	// Internal
	let selectedIndex = $state(-1);

	function handleClick(index: number) {
		selectedIndex = index;
		select({ index });
	}
</script>

<div class="group-card-list">
	{#each itemSets as itemSet, ii}
		<GroupCard
			icon={itemSet.icon}
			items={itemSet.items}
			click={() => handleClick(ii)}
			dataTestid={`card_${ii}`}
			selected={selectedIndex === ii}
		/>
	{/each}
</div>

<style>
	.group-card-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		overflow-y: auto;
		padding: 1rem 0;
		/* overflow: auto; */
	}
</style>
