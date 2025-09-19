<script lang="ts">
import Theme from '@/components/theme/theme.svelte'
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<Theme>
	{@render children?.()}
</Theme>