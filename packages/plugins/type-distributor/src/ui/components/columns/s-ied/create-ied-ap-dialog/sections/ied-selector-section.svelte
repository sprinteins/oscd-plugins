<script lang="ts">
import { SelectWorkaround } from '@oscd-plugins/core-ui-svelte'
import type { IedData } from '../lib'
import { querySIEDs } from '@/headless/ied'
import { bayStore } from '@/headless/stores'

let {
	ied = $bindable({ name: '', description: '', isNew: true }),
	disabled = false
}: {
	ied: IedData
	disabled?: boolean
} = $props()

const existingSIeds = $derived.by(() => {
	const sieds = querySIEDs(bayStore.selectedBay ?? '')
	return sieds.map((ied) => ({
		value: ied.getAttribute('name') || '',
		label: ied.getAttribute('name') || 'Unnamed IED'
	}))
})

const options = $derived([
	{ value: '', label: 'None (Create New)' },
	...existingSIeds
])

const selectorValue = $derived(ied.isNew ? '' : ied.name)

function handleChange(event: Event) {
	const target = event.target as HTMLSelectElement
	const value = target.value

	if (value) {
		ied.name = value
		ied.description = ''
		ied.isNew = false
	} else {
		ied.name = ''
		ied.description = ''
		ied.isNew = true
	}
}
</script>

<section>
  <header class="pb-4">
    <h1 class="text-xl font-bold">Select existing S-IED</h1>
  </header>
  <div class="space-y-2">
    <SelectWorkaround
      value={selectorValue}
      {options}
      {handleChange}
      placeholder="Search S-IEDs"
      class="w-full"
      {disabled}
    />
  </div>
</section>
