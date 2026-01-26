<script lang="ts">
import { Button, Card, Label, SelectWorkaround } from '@oscd-plugins/core-ui-svelte'
import { equipmentMatchingStore, ssdImportStore, bayTypesStore } from '@/headless/stores'
import type { ConductingEquipmentTemplate } from '@/headless/types'

const { 
	scdBay,
	bayTypeUuid
}: {
	scdBay: Element
	bayTypeUuid: string
} = $props()

console.log('[EquipmentMatching] Component mounted/updated')
console.log('[EquipmentMatching] Props - bayTypeUuid:', bayTypeUuid)
console.log('[EquipmentMatching] Props - scdBay:', scdBay)

const bayType = $derived.by(() => {
	const bt = ssdImportStore.bayTypes.find(bt => bt.uuid === bayTypeUuid)
	console.log('[EquipmentMatching] Derived bayType:', bt?.name)
	return bt
})

// Get SCD equipment
const scdEquipment = $derived.by(() => {
	const equipment = Array.from(scdBay.querySelectorAll('ConductingEquipment'))
	console.log('[EquipmentMatching] SCD Equipment:', equipment.map(e => ({
		name: e.getAttribute('name'),
		type: e.getAttribute('type')
	})))
	return equipment
})

// Get BayType equipment templates grouped by type
const templatesByType = $derived.by(() => {
	if (!bayType) {
		console.log('[EquipmentMatching] No bayType found')
		return new Map<string, ConductingEquipmentTemplate[]>()
	}
	
	console.log('[EquipmentMatching] BayType:', bayType.name)
	console.log('[EquipmentMatching] BayType equipment count:', bayType.conductingEquipments.length)
	
	const map = new Map<string, ConductingEquipmentTemplate[]>()
	
	for (const ce of bayType.conductingEquipments) {
		const template = ssdImportStore.getConductingEquipmentTemplate(ce.templateUuid)
		if (template) {
			const existing = map.get(template.type) || []
			existing.push(template)
			map.set(template.type, existing)
		}
	}
	
	console.log('[EquipmentMatching] Templates by type:', Array.from(map.entries()).map(([type, templates]) => ({
		type,
		count: templates.length,
		templates: templates.map(t => t.name)
	})))
	
	return map
})

// Get template name counts by type (e.g., for DIS: {"Disconnector": 4, "Earth Switch": 2})
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

// Get available templates for a specific equipment, excluding already assigned ones
function getOptionsForEquipment(equipment: Element, currentEquipmentName: string) {
	const type = equipment.getAttribute('type')
	console.log('[EquipmentMatching] Getting options for:', currentEquipmentName, 'type:', type)
	
	if (!type) {
		console.log('[EquipmentMatching] No type for equipment:', currentEquipmentName)
		return []
	}
	
	const allTemplates = templatesByType.get(type) || []
	console.log('[EquipmentMatching] Found templates for type', type, ':', allTemplates.length)
	
	// Count how many times each template UUID has been used (excluding current equipment)
	const usedTemplates = new Map<string, number>()
	for (const [eqName, templateUuid] of equipmentMatchingStore.manualMatches.entries()) {
		if (eqName !== currentEquipmentName) {
			const count = usedTemplates.get(templateUuid) || 0
			usedTemplates.set(templateUuid, count + 1)
		}
	}
	
	// Count available instances of each template
	const templateCounts = new Map<string, number>()
	for (const template of allTemplates) {
		const count = templateCounts.get(template.uuid) || 0
		templateCounts.set(template.uuid, count + 1)
	}
	
	// Create options only for templates that still have available instances
	const options = allTemplates
		.filter(t => {
			const used = usedTemplates.get(t.uuid) || 0
			const available = templateCounts.get(t.uuid) || 0
			return used < available
		})
		.map(t => ({
			value: t.uuid,
			label: `${t.name} (${t.type})`
		}))
		// Remove duplicates by UUID
		.filter((option, index, self) => 
			index === self.findIndex(o => o.value === option.value)
		)
	
	console.log('[EquipmentMatching] Available options:', options)
	return options
}

function handleMatchChange(equipmentName: string, templateUuid: string) {
	equipmentMatchingStore.setManualMatch(equipmentName, templateUuid)
}

// Create a reactive derived value for current selections
const getCurrentValue = (name: string) => {
	return equipmentMatchingStore.manualMatches.get(name) || ''
}

// Filter equipment to only show those with multiple template options (ambiguous)
const ambiguousEquipment = $derived.by(() => {
	return scdEquipment.filter(eq => {
		const type = eq.getAttribute('type')
		if (!type) return false
		
		const templates = templatesByType.get(type) || []
		// Only show equipment where there are multiple template options
		return templates.length > 1
	})
})

const allMatchesSet = $derived(
	ambiguousEquipment.length > 0 && 
	ambiguousEquipment.every(eq => {
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
				Manual matching required: Multiple equipment templates with the same type found.
			</p>
			{#if equipmentMatchingStore.validationResult.ambiguousTypes}
				<p class="text-xs text-gray-600 mt-1">
					Ambiguous types: {equipmentMatchingStore.validationResult.ambiguousTypes.join(', ')}
				</p>
			{/if}
			<div class="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
				<p class="text-xs font-semibold text-blue-700 mb-1">Available templates:</p>
				{#each Array.from(templateNameCountsByType.entries()) as [type, nameCounts]}
					{#if nameCounts.size > 1}
						<div class="text-xs text-blue-600">
							<span class="font-medium">{type}:</span>
							{Array.from(nameCounts.entries()).map(([name, count]) => `${count}x ${name}`).join(', ')}
						</div>
					{/if}
				{/each}
			</div>
		{/if}
	</Card.Header>
	
	<Card.Content>
		<div class="space-y-4">
			{#each ambiguousEquipment as equipment}
				{@const name = equipment.getAttribute('name') || 'Unknown'}
				{@const type = equipment.getAttribute('type') || 'Unknown'}
				{@const options = getOptionsForEquipment(equipment, name)}
				
				<div class="space-y-2">
					<Label.Root class="text-sm font-medium">
						{name} <span class="text-gray-500">({type})</span>
					</Label.Root>
					<SelectWorkaround
						value={getCurrentValue(name)}
						handleChange={(event) => {
							const selectEl = event.target as HTMLSelectElement
							if (selectEl?.value) {
								handleMatchChange(name, selectEl.value)
							}
						}}
						options={options}
						placeholder="Select template..."
						class="w-full"
					/>
				</div>
			{/each}
			
			{#if ambiguousEquipment.length === 0}
				<p class="text-sm text-gray-600">
					No ambiguous equipment found. All equipment can be auto-matched.
				</p>
			{:else}
				<div class="mt-4 p-2 bg-gray-50 border border-gray-200 rounded">
					<p class="text-xs text-gray-600">
						Progress: {equipmentMatchingStore.manualMatches.size} of {ambiguousEquipment.length} matched
					</p>
				</div>
				{#if !allMatchesSet}
					<p class="text-sm text-red-600">
						Please select a template for all equipment before applying.
					</p>
				{/if}
			{/if}
		</div>
	</Card.Content>
</Card.Root>
