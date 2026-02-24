<script lang="ts">
  import { ArrowLeft } from '@lucide/svelte';
import { Button } from '@oscd-plugins/core-ui-svelte'

let {
	onGoBackToIedSelection
}: {
	onGoBackToIedSelection: () => void
} = $props()
</script>

<Button.Root variant="outline" class="w-fit hover:bg-destructive/10 hover:text-destructive/90 text-destructive" onclick={onGoBackToIedSelection}>
 <ArrowLeft></ArrowLeft>
 Back
</Button.Root>
