<!--
@component
THIS IS A WORKAROUND TO BE USED UNTIL THE FIX FOR THE SHADOW DOM ISSUE IS RELEASED
SEE: https://github.com/huntabyte/bits-ui/issues/828
-->

<script lang="ts">
import { cn } from '$lib/utils/shadcn.js'

let {
	value = $bindable(),
	disabled = false,
	class: className,
	options,
	placeholder,
	handleChange
}: {
	value: string | number | null | undefined | Record<string, unknown>
	disabled?: boolean
	class?: string
	options?: {
		value: string | number | Record<string, unknown>
		label: string | number
	}[]
	placeholder?: string
	handleChange?: (event: Event) => void
} = $props()
</script>

<select
bind:value={value}
onchange={handleChange}
disabled={disabled}
class={cn(
	"border-input bg-background ring-offset-background data-[placeholder]:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
	className
)}>
	{#if placeholder && (value === undefined || value === null)}
			<option {value} selected disabled hidden>{placeholder}</option>
	{:else if placeholder && value === ""}
			<option value="" selected disabled hidden>{placeholder}</option>
	{/if}
	{#if options?.length}
		{#each options as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	{/if}
</select>

<style>
	select {
		background: url("data:image/svg+xml,<svg height='10px' width='10px' viewBox='0 0 16 16' fill='%23000000' xmlns='http://www.w3.org/2000/svg'><path d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/></svg>") no-repeat;
		background-position: calc(100% - 0.75rem) center !important;
		-moz-appearance:none !important;
		-webkit-appearance: none !important; 
		appearance: none !important;
		padding-right: 2rem !important;
		@apply bg-background;
	}
</style>