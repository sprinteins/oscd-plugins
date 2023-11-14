<script lang="ts">
	import { Icons } from "../icons"
	import type { Item } from "./item"

	export let items: Item[]
</script>

<list>
	<ul>
		{#each items as item}
			<li>
				{#if item.icon}
					<div>
						<!-- 
					It is not quite optimal to use the Icon component
					directly and we will change it, but currently 
					it covers the use cases we need and a more 
					dynamic approach would be more complex
				-->
						<Icons name={item.icon} size="rect" />
					</div>
				{/if}
				<div class="text-container">
					<div class="primary-text">{item.primaryText}</div>
					<div class="secondary-text">{item.secondaryText}</div>
				</div>
			</li>
		{/each}
	</ul>
</list>

<style>
	ul {
		margin-left: -2.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	li {
		font-family: var(--font-family);
		display: flex;
		color: var(--color-grey-dark);
		align-items: center;
		gap: 0.5rem;
	}

	.text-container {
		margin: 0;
		padding: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.primary-text {
		font-size: 12px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.secondary-text {
		font-size: 10px;
		color: var(--color-grey-dark-70pc-opacity);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
