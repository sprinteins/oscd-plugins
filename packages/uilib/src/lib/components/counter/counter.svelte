<script lang="ts">
	export let count: number
	export let max = 10

	$: label = count <= max ? count : `${max - 1}+`
</script>

<counter>
	<span>
		{label}
	</span>
</counter>

<style>
	counter {
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
