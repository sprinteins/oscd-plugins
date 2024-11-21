
<script lang="ts">
import { cn } from '$lib/utils.js'
import buttonVariants from './variants.button'
// TYPES
import type { ButtonProps } from './button'

let {
	class: className,
	variant = 'default',
	size = 'default',
	ref = $bindable(null),
	href = undefined,
	type = 'button',
	children,
	...restProps
}: ButtonProps = $props()
</script>

{#if href}
	<a
		bind:this={ref}
		class={cn(buttonVariants({ variant, size, className }))}
		{href}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		class={cn(buttonVariants({ variant, size, className }))}
		{type}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}
