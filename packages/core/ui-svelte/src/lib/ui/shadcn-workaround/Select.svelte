<!--
@component
THIS IS A WORKAROUND TO BE USED UNTIL THE FIX FOR THE SHADOW DOM ISSUE IS RELEASED
SEE: https://github.com/huntabyte/bits-ui/issues/828
-->

<script lang="ts">
import { cn } from '$lib/utils/shadcn.js'

let {
	value = $bindable(),
	class: className,
	options,
	placeholder,
	handleChange
}: {
	value: string | undefined
	class?: string
	options?: { value: string; label: string }[]
	placeholder?: string
	handleChange?: (event: Event) => void
} = $props()
</script>

<select
bind:value={value}
onchange={handleChange}
class={cn(
	"border-input bg-background ring-offset-background data-[placeholder]:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
	className
)}>
	{#if placeholder}<option value="">{placeholder}</option>{/if}
	{#if options?.length}
		{#each options as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	{/if}
</select>