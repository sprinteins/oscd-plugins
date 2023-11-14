<script lang="ts">
  /**
   * Note:
   * Currently we are binding the `selected` property, but
   * I am not big fan of this approach. I would prefer
   * to have a `selected` event that we can listen to
   * and then update the `selected` property.
   */
  import Chip, { Set, Text } from "@smui/chips"
  import { createEventDispatcher } from "svelte"
  import type { ElementCategory } from "./categories"
  import type { EventDetailCategorySelect } from "./event-detail"

  // Input
  export let testid = ""
  export let labels: string[]

  // Internal
  const dispatch = createEventDispatcher()
  let selected: (ElementCategory | null)[] = []
  $: {
  	// We filter out `null` but typescript does not know that so we cast
  	const newSelection = selected.filter(Boolean) as ElementCategory[]

  	// Currently the labels contain also contain the number of nodes
  	// inside the category.
  	// This leads to that, that when the file has not been processed yes
  	// we get labels like "DA Type(0)".
  	// When the file loads we get the correct labels like "DA Type (5)",
  	// but the selection is still there and looks for "DA Type(0)".
  	// The `indexOf` returns -1 and dispatches the event with that.
  	// This causes upstream a problem because there is no element at
  	// -1 and we get an error.
  	// So currently we filter out the -1 values.
  	// This is only treats the symptom but does not solves the root cause.
  	let selectedIndices = newSelection
  		.map((el) => labels.indexOf(el))
  		.filter((el) => el >= 0)

  	const nothingSelected = selectedIndices.length === 0
  	if (nothingSelected) {
  		const allIndices = new Array(labels.length).fill(null).map((_, i) => i)
  		selectedIndices = allIndices
  	}

  	const details: EventDetailCategorySelect = { selection: selectedIndices }
  	dispatch("select", details)
  }

  function dataTestid(id: string) {
  	return { "data-testid": id }
  }

  function chipTestid(rootTestId: string, label: string) {
  	return `${rootTestId}_${label}`
  }
</script>

<category-selector>
  {#each labels as label, ci}
    <Set chips={[label]} let:chip choice bind:selected={selected[ci]}>
      <Chip {chip} {...dataTestid(chipTestid(testid, chip))}>
        <Text>{chip}</Text>
      </Chip>
    </Set>
  {/each}
</category-selector>

<style lang="scss">
  category-selector {
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
