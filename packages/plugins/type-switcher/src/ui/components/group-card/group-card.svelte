<script lang="ts">
import { Button } from '@oscd-plugins/core-ui-svelte'
import '../scl-icon'

interface Props {
	onclick: (e: Event) => void
	items: string[]
	icon: string | undefined
	dataTestid: string
	selected: boolean
}

let { onclick, items, icon, dataTestid, selected }: Props = $props()

// Internal
const MAX_NR_OF_ITEMS = 3
let displayedItems = $derived(items.slice(0, MAX_NR_OF_ITEMS))
let titleText = $derived(items.join('\n'))
</script>

<Button.Root
	variant="outline"
	class="grid h-[90px] w-full grid-cols-[1fr_3rem] items-stretch justify-stretch whitespace-normal rounded-lg border-border bg-card p-0 text-left shadow-sm transition-all duration-100 {selected
		? 'border-primary shadow'
		: 'hover:border-dashed hover:border-primary'}"
	aria-pressed={selected}
	{onclick}
	data-testid={dataTestid}
	title={titleText}
>
	<div class="overflow-hidden py-2 pl-3">
		{#if icon}
			<oscd-icon class="type-icon">{icon}</oscd-icon>
		{/if}
		<ul class="m-0 list-none p-0 leading-[1.15]">
			{#each displayedItems as item}
				<li class="truncate">{item}</li>
			{/each}
		</ul>
	</div>
	<span class="flex justify-end p-2">
		<span class="counter">{items.length <= 9 ? items.length : '9+'}</span>
	</span>
</Button.Root>

<style>
	:global(.type-icon) {
		--md-icon-size: 1.5rem;
		display: block;
		height: 1.5rem;
		margin-bottom: 0.2rem;
		width: 1.65rem;
	}

	.counter {
		align-items: center;
		background: hsl(var(--primary));
		border-radius: 9999px;
		color: hsl(var(--primary-foreground));
		display: inline-flex;
		font-size: 0.75rem;
		height: 1.25rem;
		justify-content: center;
		line-height: 1;
		min-width: 1.25rem;
		padding: 0 0.25rem;
	}
</style>
