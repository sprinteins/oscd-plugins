<script lang="ts">
import { SelectWorkaround, Checkbox, Label } from '@oscd-plugins/core-ui-svelte'
import type { LD0Source } from '@/headless/scl'
import type { FunctionTemplate } from '@/headless/common-types'

let {
	ld0FunctionTemplates,
	source = $bindable()
}: {
	ld0FunctionTemplates: FunctionTemplate[]
	source: LD0Source
} = $props()

const DEFAULT_VALUE = '__default__'

const hasSingleTemplate = $derived(ld0FunctionTemplates.length === 1)
const singleTemplate = $derived(
	hasSingleTemplate ? ld0FunctionTemplates[0] : null
)
const isDefaultSelected = $derived(source.kind === 'default')

const selectOptions = $derived.by(() => {
	const functionOptions = ld0FunctionTemplates.map((t) => ({
		value: t.uuid,
		label: `${t.name} (SSD)`
	}))
	return [
		...functionOptions,
		{ value: DEFAULT_VALUE, label: 'Default (IEC 61850-7-4)' }
	]
})

const selectValue = $derived(
	source.kind === 'default' ? DEFAULT_VALUE : source.functionTemplate.uuid
)

const onlyMandatoryChecked = $derived(
	source.kind === 'default' ? source.onlyMandatoryDOs : false
)

function handleChange(event: Event) {
	const value = (event.target as HTMLSelectElement).value
	if (value === DEFAULT_VALUE) {
		const keepMandatory =
			source.kind === 'default' ? source.onlyMandatoryDOs : false
		source = { kind: 'default', onlyMandatoryDOs: keepMandatory }
	} else {
		const template = ld0FunctionTemplates.find((t) => t.uuid === value)
		if (template) {
			source = { kind: 'function', functionTemplate: template }
		}
	}
}

function handleMandatoryChange(checked: boolean | 'indeterminate') {
	if (source.kind === 'default') {
		source = { ...source, onlyMandatoryDOs: checked === true }
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
      />
    </div>

    {#if isDefaultSelected}
      <div class="flex items-center gap-2">
        <Checkbox.Root
          id="ld0-mandatory"
          checked={onlyMandatoryChecked}
          onCheckedChange={handleMandatoryChange}
        />
        <Label.Root for="ld0-mandatory" class="cursor-pointer font-normal">
          Only Mandatory DOs
        </Label.Root>
      </div>
    {/if}
  </div>
</section>
