<script lang="ts">
import {
	Card,
	Label,
	SelectWorkaround
} from '@oscd-plugins/core-ui-svelte'
import {
	bayStore,
	bayTypesStore,
	equipmentMatchingStore,
	ssdImportStore,
} from '@/headless/stores'
import type { ConductingEquipmentTemplate } from '@/headless/common-types'

const bayType = $derived(
	bayTypesStore.selectedBayType ? ssdImportStore.bayTypes.find((bt) => bt.uuid === bayTypesStore.selectedBayType) : null
)

const scdEquipment = $derived(
	bayStore.scdBay ? Array.from(bayStore.scdBay.querySelectorAll('ConductingEquipment')) : []
)

const templatesByType = $derived.by(() => {
	const map = new Map<string, ConductingEquipmentTemplate[]>()

	if (!bayType) {
		return map
	}

	for (const conductingEquipment of bayType.conductingEquipments) {
		const template = ssdImportStore.getConductingEquipmentTemplate(
			conductingEquipment.templateUuid
		)
		if (template) {
			const existing = map.get(template.type) || []
			existing.push(template)
			map.set(template.type, existing)
		}
	}

	return map
})

const templateNameCountsByType = $derived.by(() => {
	const result = new Map<string, Map<string, number>>()

	for (const [type, templates] of templatesByType.entries()) {
		const nameCountsForType = new Map<string, number>()
		for (const template of templates) {
			const count = nameCountsForType.get(template.name) || 0
			nameCountsForType.set(template.name, count + 1)
		}
		result.set(type, nameCountsForType)
	}

	return result
})

function getOptionsForEquipment(
	equipment: Element,
	currentEquipmentName: string
) {
	const type = equipment.getAttribute('type')

	if (!type || !bayType) return []

	const allTemplates = templatesByType.get(type) || []
	const currentSelection = equipmentMatchingStore.manualMatches.get(currentEquipmentName)

	const usedTemplates = new Map<string, number>()
	for (const [
		eqName,
		templateUuid
	] of equipmentMatchingStore.manualMatches.entries()) {
		if (eqName !== currentEquipmentName) {
			const count = usedTemplates.get(templateUuid) || 0
			usedTemplates.set(templateUuid, count + 1)
		}
	}

	const availableTemplateCounts = new Map<string, number>()
	for (const ce of bayType.conductingEquipments) {
		const template = ssdImportStore.getConductingEquipmentTemplate(ce.templateUuid)
		if (template && template.type === type) {
			const count = availableTemplateCounts.get(template.uuid) || 0
			availableTemplateCounts.set(template.uuid, count + 1)
		}
	}

	const seenTemplates = new Set<string>()
	const options = allTemplates
		.filter((t) => {
			if (seenTemplates.has(t.uuid)) return false
			seenTemplates.add(t.uuid)
			
			const used = usedTemplates.get(t.uuid) || 0
			const available = availableTemplateCounts.get(t.uuid) || 0
			const isCurrentlySelected = t.uuid === currentSelection
			
			return isCurrentlySelected || used < available
		})
		.map((t) => ({
			value: t.uuid,
			label: `${t.name} (${t.type})`
		}))
	
	return options
}

function handleMatchChange(equipmentName: string, templateUuid: string) {
	equipmentMatchingStore.setManualMatch(equipmentName, templateUuid)
}

const getCurrentValue = (name: string) => {
	return equipmentMatchingStore.manualMatches.get(name) || ''
}

const ambiguousEquipment = $derived.by(() => {
	return scdEquipment.filter((eq) => {
		const type = eq.getAttribute('type')
		if (!type) return false

		const templates = templatesByType.get(type) || []
		return templates.length > 1
	})
})

const allMatchesSet = $derived(
	ambiguousEquipment.length > 0 &&
		ambiguousEquipment.every((eq) => {
			const name = eq.getAttribute('name')
			return name && equipmentMatchingStore.manualMatches.has(name)
		})
)
</script>

<Card.Root class="mt-4">
	<Card.Header>
		<Card.Title>Equipment Matching</Card.Title>
		{#if equipmentMatchingStore.validationResult?.requiresManualMatching}
			<p class="text-sm text-amber-600 mt-2">
				Manual matching required: Multiple equipment templates with the
				same type found.
			</p>
			{#if equipmentMatchingStore.validationResult.ambiguousTypes && equipmentMatchingStore.validationResult.ambiguousTypes.length > 0}
				<p class="text-xs text-gray-600 mt-1">
					Ambiguous types: {equipmentMatchingStore.validationResult.ambiguousTypes
						.map(info => `${info.typeCode} (${info.templateNames.join(', ')})`)
						.join(', ')}
				</p>
			{/if}
			<div class="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
				<p class="text-xs font-semibold text-blue-700 mb-1">
					Available templates:
				</p>
				{#each Array.from(templateNameCountsByType.entries()) as [type, nameCounts]}
					{#if nameCounts.size > 1}
						<div class="text-xs text-blue-600">
							<span class="font-medium">{type}:</span>
							{Array.from(nameCounts.entries())
								.map(([name, count]) => `${count}x ${name}`)
								.join(", ")}
						</div>
					{/if}
				{/each}
			</div>
		{/if}
	</Card.Header>

	<Card.Content>
		<div class="space-y-4">
			{#each ambiguousEquipment as equipment}
				{@const name = equipment.getAttribute("name") || "Unknown"}
				{@const type = equipment.getAttribute("type") || "Unknown"}
				{@const options = getOptionsForEquipment(equipment, name)}

				<div class="space-y-2">
					<Label.Root class="text-sm font-medium">
						{name} <span class="text-gray-500">({type})</span>
					</Label.Root>
					<SelectWorkaround
						value={getCurrentValue(name)}
						handleChange={(event) => {
							const selectEl = event.target as HTMLSelectElement;
							if (selectEl?.value) {
								handleMatchChange(name, selectEl.value);
							}
						}}
						{options}
						placeholder="Select template..."
						class="w-full"
					/>
				</div>
			{/each}

			{#if ambiguousEquipment.length === 0}
				<p class="text-sm text-gray-600">
					No ambiguous equipment found. All equipment can be
					auto-matched.
				</p>
			{:else}
				<div class="mt-4 p-2 bg-gray-50 border border-gray-200 rounded">
					<p class="text-xs text-gray-600">
						Progress: {equipmentMatchingStore.manualMatches.size} of
						{ambiguousEquipment.length} matched
					</p>
				</div>
				{#if !allMatchesSet}
					<p class="text-sm text-red-600">
						Please select a template for all equipment before
						applying.
					</p>
				{/if}
			{/if}
		</div>
	</Card.Content>
</Card.Root>
