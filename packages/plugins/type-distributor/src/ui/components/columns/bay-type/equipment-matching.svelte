<script lang="ts">
import { Card } from '@oscd-plugins/core-ui-svelte'
import {
	bayStore,
	equipmentMatchingStore,
	ssdImportStore
} from '@/headless/stores'
import { getScdEquipmentMatchKey } from '@/headless/matching/matching'
import EquipmentMatchingHeader from './equipment-matching-header.svelte'
import EquipmentMatchingRow from './equipment-matching-row.svelte'
import TemplateCountMismatchPanel from './template-count-mismatch-panel.svelte'

const bayType = $derived(
	ssdImportStore.selectedBayType
		? ssdImportStore.bayTypes.find(
				(bt) => bt.uuid === ssdImportStore.selectedBayType
			)
		: null
)

const scdEquipment = $derived(
	bayStore.scdBay
		? Array.from(
				bayStore.scdBay.querySelectorAll(':scope > ConductingEquipment')
			)
		: []
)

const ambiguousEquipmentRows = $derived.by(() => {
	const rows: Array<{ key: string; name: string; type: string }> = []

	for (const [index, eq] of scdEquipment.entries()) {
		const type = eq.getAttribute('type')
		if (
			type == null ||
			(equipmentMatchingStore.templatesByType.get(type)?.length ?? 0) <= 1
		)
			continue

		const key = getScdEquipmentMatchKey(eq, index)
		const rawName = eq.getAttribute('name')?.trim()
		if (!rawName) continue

		rows.push({ key, name: rawName, type })
	}

	return rows
})

const allMatchesSet = $derived.by(() => {
	if (ambiguousEquipmentRows.length === 0) return false
	const allManualMatchesMade = ambiguousEquipmentRows.every((equipment) =>
		equipmentMatchingStore.manualMatches.has(equipment.key)
	)
	const noCountMismatch =
		equipmentMatchingStore.templateCountMismatch.length === 0
	return allManualMatchesMade && noCountMismatch
})

const hasMissingMatches = $derived(
	ambiguousEquipmentRows.some(
		(equipment) => !equipmentMatchingStore.manualMatches.has(equipment.key)
	)
)

const optionsByEquipment = $derived.by(() => {
	const noOption = [{ value: '', label: 'None' }]
	const map = new Map<string, { value: string; label: string }[]>()

	for (const equipment of ambiguousEquipmentRows) {
		const { key, type } = equipment

		if (!type || !bayType) {
			map.set(key, noOption)
			continue
		}

		const templates = equipmentMatchingStore.templatesByType.get(type) ?? []

		map.set(key, [
			...noOption,
			...templates.map((t) => ({
				value: t.uuid,
				label: `${t.name} (${t.type})`
			}))
		])
	}

	return map
})
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Equipment Matching</Card.Title>
		<EquipmentMatchingHeader />
	</Card.Header>

	<Card.Content>
		<div class="space-y-4">
			{#each ambiguousEquipmentRows as equipment (equipment.key)}
				{@const options = optionsByEquipment.get(equipment.key) ?? []}

				<EquipmentMatchingRow
					{equipment}
					{options}
					selectedTemplateUuid={equipmentMatchingStore.manualMatches.get(
						equipment.key,
					) ?? ""}
				/>
			{/each}

			{#if ambiguousEquipmentRows.length === 0}
				<p class="text-sm text-gray-600">
					No ambiguous equipment found. All equipment can be
					auto-matched.
				</p>
			{:else if !allMatchesSet}
				{#if hasMissingMatches}
					<p class="text-sm text-red-600">
						Please select a template for all equipment before
						applying.
					</p>
				{/if}

				{#if equipmentMatchingStore.templateCountMismatch.length > 0}
					<TemplateCountMismatchPanel
						templateCountMismatch={equipmentMatchingStore.templateCountMismatch}
					/>
				{/if}
			{/if}
		</div>
	</Card.Content>
</Card.Root>
