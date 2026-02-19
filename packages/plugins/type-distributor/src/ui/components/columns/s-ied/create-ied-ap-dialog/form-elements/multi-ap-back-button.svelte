<script lang="ts">
import { Button } from '@oscd-plugins/core-ui-svelte'

let {
	onGoBackToIedSelection
}: {
	onGoBackToIedSelection: () => void
} = $props()
</script>

<Button.Root variant="outline" class="w-fit" onclick={onGoBackToIedSelection}>
  Back
</Button.Root>
