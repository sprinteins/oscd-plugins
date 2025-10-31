<script lang="ts">
/**
 * Note:
 * Currently we are binding the `selected` property, but
 * I am not big fan of this approach. I would prefer
 * to have a `selected` event that we can listen to
 * and then update the `selected` property.
 */
import Chip, { Set as ChipSet, Text } from '@smui/chips'

interface Props {
	// Input
	selected: string[]
	testid?: string
	labels: string[]
}

let { selected = $bindable(), testid = '', labels }: Props = $props()

function dataTestid(id: string) {
	return { 'data-testid': id }
}

function chipTestid(rootTestId: string, label: string) {
	return `${rootTestId}_${label}`
}
</script>

<div class="category-selector">
  <ChipSet chips={labels} filter bind:selected>
    {#snippet chip(chip)}
      <Chip {chip} {...dataTestid(chipTestid(testid, chip))}>
        <Text>{chip}</Text>
      </Chip>
    {/snippet}
  </ChipSet>
</div>

<style lang="scss">
  .category-selector {
    :global(.mdc-chip) {
      height: 0;
      padding: 0.75rem 1rem;
      background-color: var(--color-category-selector);
      color: var(--font-color);
    }

    :global(.mdc-chip--selected) {
      outline: 1px var(--mdc-theme-primary) solid;
      outline: 1px solid var(--color-border);
      background-color: var(--color-category-selector);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      color: var(--font-color);
    }

    :global(.mdc-chip:hover) {
      outline-style: dashed;
      outline-color: var(--color-accent);
      outline-width: 0.1rem;
    }

    :global(.mdc-chip--selected) {
      outline: 1px var(--mdc-theme-primary) solid;
      background-color: var(--color-category-selector);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    :global(.mdc-chip-set) {
      display: inline-block;
      padding: 0;
      margin: 0;
    }
    :global(
        .mdc-chip-set--choice
          .mdc-chip.mdc-chip--selected
          .mdc-chip__ripple::before
      ) {
      background-color: var(--color-beige-3);
    }
  }
</style>
