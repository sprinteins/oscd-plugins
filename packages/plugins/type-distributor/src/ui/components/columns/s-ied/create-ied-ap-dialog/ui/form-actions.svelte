<script lang="ts">
import { Button } from '@oscd-plugins/core-ui-svelte'

const {
	onCancel,
	onSubmit,
	submitLabel,
	disabled = false
}: {
	onCancel: () => void
	onSubmit: () => void
	submitLabel: string
	disabled?: boolean
} = $props()
</script>

<section>
  <footer class="flex justify-end space-x-2 mt-4">
    <Button.Root variant="outline" onclick={onCancel}>Cancel</Button.Root>
    <Button.Root onclick={onSubmit} {disabled}>
      {submitLabel}
    </Button.Root>
  </footer>
</section>
