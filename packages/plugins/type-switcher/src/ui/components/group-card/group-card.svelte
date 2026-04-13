<script lang="ts">
import { Counter } from '@oscd-plugins/ui'
import { Icons, type IconKeys } from '@oscd-plugins/ui'

interface Props {
	// Input
	onclick?: (e: Event) => void
	onkeydown?: (e: KeyboardEvent) => void
	items?: string[]
	icon: IconKeys | undefined
	dataTestid?: string
	selected?: boolean
}

let {
	onclick,
	onkeydown,
	items = [],
	icon,
	dataTestid = '',
	selected = false
}: Props = $props()

// Internal
const MAX_NR_OF_ITEMS = 3
let displayedItems = $derived(items.slice(0, MAX_NR_OF_ITEMS))
let titleText = $derived(items.join('\n'))
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="box-border h-[90px] cursor-pointer rounded-lg border bg-[var(--mdc-theme-surface)] transition-all duration-100 {selected
		? 'border-[var(--mdc-theme-primary)] shadow'
		: 'border-transparent hover:border-dashed hover:border-[var(--mdc-theme-primary)]'}"
	style="display: grid; grid-template-columns: 1fr 3rem;"
	{onclick}
	{onkeydown}
	data-testid={dataTestid}
	title={titleText}
>
	<div class="overflow-hidden py-2 pl-3">
		{#if icon}
			<div class="pb-[0.2rem]">
				<Icons name={icon} size="rect" />
			</div>
		{/if}
		<ul class="m-0 list-none p-0 leading-[1.15]">
			{#each displayedItems as item}
				<li class="truncate">{item}</li>
			{/each}
		</ul>
	</div>
	<span class="p-2">
		<Counter count={items.length} />
	</span>
</div>
