<script lang="ts">
import '../scl-icon'
import type { Item } from './item'

interface Props {
	items: Item[]
	emptyText: string
}

let { items, emptyText }: Props = $props()
</script>

<div>
	{#if items.length === 0}
		<p class="empty-state">{emptyText}</p>
	{:else}
		<ul>
			{#each items as item}
				<li>
					{#if item.icon}
						<oscd-icon class="type-icon">{item.icon}</oscd-icon>
					{/if}
					<div class="text-container">
						<div class="primary-text">{item.primaryText}</div>
						<div class="secondary-text" title={item.secondaryText}>
							{item.secondaryText}
						</div>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	ul {
		line-height: 1.15;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 0.75rem;
	}
	li {
		font-family: var(--font-family);
		display: flex;
		color: var(--color-grey-dark);
		align-items: center;
		gap: 0.5rem;
	}

	:global(.type-icon) {
		--md-icon-size: 1.5rem;
		flex: 0 0 auto;
		height: 1.5rem;
		width: 1.65rem;
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

	.empty-state {
		color: var(--muted-foreground);
		font-size: 0.75rem;
		line-height: 1.4;
		margin: 0.75rem 0.5rem;
	}
</style>
