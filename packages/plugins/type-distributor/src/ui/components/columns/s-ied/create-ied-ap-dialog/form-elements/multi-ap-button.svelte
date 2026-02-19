<script lang="ts">
import { Button } from '@oscd-plugins/core-ui-svelte'

let {
	isMultiApMode,
	hasValidInput,
	onEnterMultiApMode,
	onAddAccessPoint
}: {
	isMultiApMode: boolean
	hasValidInput: boolean
	onEnterMultiApMode: () => void
	onAddAccessPoint: () => void
} = $props()
</script>

{#if isMultiApMode}
  <Button.Root
    variant="outline"
    onclick={onAddAccessPoint}
    disabled={!hasValidInput}
  >
    Add Access Point
  </Button.Root>
{:else}
  <Button.Root
    variant="outline"
    onclick={onEnterMultiApMode}
    disabled={!hasValidInput}
  >
    Create Multiple Access Points
  </Button.Root>
{/if}
