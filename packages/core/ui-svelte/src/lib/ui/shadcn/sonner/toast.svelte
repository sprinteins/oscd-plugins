<script lang="ts">
import Root from './sonner.svelte'

interface Props {
	mode?: 'light' | 'dark' | 'system'
}

let { mode = 'light' }: Props = $props()
</script>

<div data-sonner-toaster-root>
	<Root {mode} />
</div>

<style>
	[data-sonner-toaster-root] {
		display: contents;
	}
</style>
