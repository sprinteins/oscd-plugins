<!--
@component
THIS IS A WORKAROUND TO BE USED UNTIL THE FIX FOR THE SHADOW DOM ISSUE IS RELEASED
SEE: https://github.com/huntabyte/bits-ui/issues/828
-->

<script lang="ts">
// ACTIONS
import { clickOutside } from '$lib/headless/actions/index.js'
// COMPONENTS
import { Button } from '$lib/ui/shadcn/index.js'
import EllipsisVertical from 'lucide-svelte/icons/ellipsis-vertical'
// UTILS
import { cn } from '$lib/utils/shadcn.js'

//props
let {
	class: className,
	actions
}: {
	class?: string
	actions: {
		label: string
		disabled: boolean
		callback: () => void
	}[]
} = $props()

//refs
let isDropdownOpen = $state(false)

function handleMenuOpen(event: Event) {
	event.stopPropagation()
	isDropdownOpen = !isDropdownOpen
}

function handleActionClick(event: Event, action: { callback: () => void }) {
	event.stopPropagation()
	action.callback()
	isDropdownOpen = false
}
</script>

<details use:clickOutside onclickoutside={() => isDropdownOpen = false} class="dropdown " open={isDropdownOpen}>
  <summary class="marker:hidden list-none">
		<Button.Root variant="ghost" onclick={(event) => handleMenuOpen(event) } class="size-10 rounded-full">
			<EllipsisVertical class="!size-5" />
	</Button.Root>
	</summary>
  <ul 
		data-state={isDropdownOpen ? 'open' : 'closed'}
		data-side="top"
		class={cn(
		"right-0 menu dropdown-content bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md",
		className
	)}>
		{#if actions?.length}
			{#each actions as action}
				<li class={["relative flex cursor-default select-none items-start gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground", action.disabled && 'disabled' ]}>
					<button class="w-full cursor-pointer" onclick={(event) => handleActionClick(event, action)}>{action.label}</button>
				</li>
			{/each}
		{/if}
  </ul>
</details>

<style lang="scss">
	// DAISYUI STYLE
.dropdown {
  @apply relative inline-block;
}
.dropdown > *:not(summary):focus {
  @apply outline-none;
}
.dropdown .dropdown-content {
  @apply absolute;
}
.dropdown:is(:not(details)) .dropdown-content {
  @apply invisible opacity-0;
}
.dropdown:is(details) summary::-webkit-details-marker {
  @apply hidden;
}

.menu {
  @apply flex flex-col flex-wrap text-sm;
  :where(li ul) {
    @apply relative whitespace-nowrap;
  }
  :where(li:not(.menu-title) > *:not(ul, details, .menu-title, .btn)),
  :where(li:not(.menu-title) > details > summary:not(.menu-title)) {
    @apply grid grid-flow-col content-start items-center gap-2;
    grid-auto-columns: minmax(auto, max-content) auto max-content;
    user-select: none;
  }
  & li.disabled {
    @apply cursor-not-allowed select-none;
  }
  :where(li > .menu-dropdown:not(.menu-dropdown-show)) {
    @apply hidden;
  }
}
:where(.menu li) {
  @apply relative flex shrink-0 flex-col flex-wrap items-stretch;
  .badge {
    @apply justify-self-end;
  }
}
	</style>