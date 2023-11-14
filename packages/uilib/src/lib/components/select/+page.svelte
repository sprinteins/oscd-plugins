<script lang="ts">
  import { Example } from "../internal"
  import { Select } from "."

  export let items: { label: string }[] = [
  	{ label: "Banane" },
  	{ label: "" },
  	{ label: "Apfel" },
  	{ label: "Rhabarber" },
  ]

  let selectedLinkTargetIndex = 1

  function handleTargetInputChange(e: Event) {
  	const input = e.target as HTMLInputElement
  	const value = input.value
  	const index = parseInt(value)

  	selectedLinkTargetIndex = index
  }
</script>

<h1>Add Dropdown Menu</h1>

<Example name="Select">
  <Select
    on:change={handleTargetInputChange}
    bind:linkTargetIndex={selectedLinkTargetIndex}
    {items}
  /></Example
>
