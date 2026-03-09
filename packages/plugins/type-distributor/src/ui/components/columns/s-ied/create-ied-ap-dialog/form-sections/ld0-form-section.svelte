<script lang="ts">
import { SelectWorkaround, Label } from '@oscd-plugins/core-ui-svelte'
import type { LD0Source } from '@/headless/scl'
import type { FunctionTemplate } from '@/headless/common-types'

let {
	ld0FunctionTemplates,
	source = $bindable(),
	disabled = false
}: {
	ld0FunctionTemplates: FunctionTemplate[]
	source: LD0Source
	disabled?: boolean
} = $props()

const DEFAULT_ALL = '__default_all__'
const DEFAULT_MANDATORY = '__default_mandatory__'

const hasSingleTemplate = $derived(ld0FunctionTemplates.length === 1)
const singleTemplate = $derived(
	hasSingleTemplate ? ld0FunctionTemplates[0] : null
)

const selectOptions = $derived.by(() => {
	const functionOptions = ld0FunctionTemplates.map((t) => ({
		value: t.uuid,
		label: `${t.name} (SSD)`
	}))
	return [
		...functionOptions,
		{ value: DEFAULT_ALL, label: 'Default (IEC 61850-7-4)' },
		{ value: DEFAULT_MANDATORY, label: 'Default – Mandatory DOs only (IEC 61850-7-4)' }
	]
})

const selectValue = $derived.by(() => {
	if (source.kind === 'function') return source.functionTemplate.uuid
	return source.onlyMandatoryDOs ? DEFAULT_MANDATORY : DEFAULT_ALL
})

function handleChange(event: Event) {
	const value = (event.target as HTMLSelectElement).value
	if (value === DEFAULT_ALL) {
		source = { kind: 'default', onlyMandatoryDOs: false }
	} else if (value === DEFAULT_MANDATORY) {
		source = { kind: 'default', onlyMandatoryDOs: true }
	} else {
		const template = ld0FunctionTemplates.find((t) => t.uuid === value)
		if (template) {
			source = { kind: 'function', functionTemplate: template }
		}
	}
}
</script>

<section>
  <div class="space-y-3">
    {#if hasSingleTemplate && singleTemplate}
      <p class="text-muted-foreground text-sm">
        ℹ <span class="font-medium">{singleTemplate.name}</span> will be applied automatically.
        You can override this below.
      </p>
    {/if}

    <div class="space-y-2">
      <Label.Root for="ld0-source">LDO, Select Source</Label.Root>
      <SelectWorkaround
        value={selectValue}
        options={selectOptions}
        handleChange={handleChange}
        placeholder="Select LD0 source"
        class="w-full"
        {disabled}
      />
    </div>
  </div>
</section>
