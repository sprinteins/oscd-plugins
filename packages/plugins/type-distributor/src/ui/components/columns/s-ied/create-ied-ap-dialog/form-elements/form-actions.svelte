<script lang="ts">
import { Button } from '@oscd-plugins/core-ui-svelte'
import MultiApBackButton from './multi-ap-back-button.svelte'

const {
	onCancel,
	onSubmit,
	onGoBackToIedSelection,
	submitLabel,
	isMultiApMode,
	disabled = false
}: {
	onCancel: () => void
	onSubmit: () => void
	onGoBackToIedSelection: () => void
	submitLabel: string
	isMultiApMode: boolean
	disabled?: boolean
} = $props()
</script>

<section>
  <footer class="flex justify-end space-x-2 mt-4">
	{#if isMultiApMode}
	 <MultiApBackButton
      {onGoBackToIedSelection}
    />
	{/if}
    <Button.Root variant="ghost" class="hover:bg-destructive/10 hover:text-destructive/90 text-destructive" onclick={onCancel}>Close</Button.Root>
    <Button.Root variant="ghost" class="text-primary" onclick={onSubmit} {disabled}>
      {submitLabel}
    </Button.Root>
  </footer>
</section>
