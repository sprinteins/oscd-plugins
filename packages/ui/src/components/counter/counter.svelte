<script lang="ts">
	interface Props {
		count: number;
		max?: number;
	}

	let { count, max = 10 }: Props = $props();

	let label = $derived(count <= max ? count : `${max - 1}+`);
</script>

<div class="counter">
	<span>
		{label}
	</span>
</div>

<style>
	.counter {
		pointer-events: none;
		background-color: var(--mdc-theme-primary);
		color: var(--color-white);
		border-radius: 2rem;
		height: 1.25rem;
		width: 1.25rem;
		font-size: 0.875rem;
		display: inline-grid;
		place-items: center;
	}
</style>
