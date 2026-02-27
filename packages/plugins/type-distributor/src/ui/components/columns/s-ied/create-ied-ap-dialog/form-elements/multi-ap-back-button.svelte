<script lang="ts">
import { ArrowLeft } from '@lucide/svelte'
import { Button } from '@oscd-plugins/core-ui-svelte'

let {
	onGoBackToIedSelection
}: {
	onGoBackToIedSelection: () => void
} = $props()
</script>

<Button.Root variant="ghost" class="w-fit text-primary" onclick={onGoBackToIedSelection}>
 <ArrowLeft></ArrowLeft>
 Back
</Button.Root>
