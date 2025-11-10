<script lang="ts">
	import { GroupCard } from "../group-card";
	import type { CardItem } from "./card-item";

	interface Props {
		// Input
		onclick: (index: number) => void;
		itemSets?: CardItem[];
		selectedIndex?: number;
	}

	let { onclick, itemSets = [], selectedIndex = $bindable<number>() }: Props = $props();
</script>

<div class="group-card-list">
	{#each itemSets as itemSet, ii}
		<GroupCard
			icon={itemSet.icon}
			items={itemSet.items}
			onclick={() => onclick(ii)}
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
		padding-top: 1rem;
		/* overflow: auto; */
	}
</style>
