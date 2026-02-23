<script lang="ts">
import { Card } from '@oscd-plugins/core-ui-svelte'
import {
	bayStore,
	bayTypesStore,
	equipmentMatchingStore,
	ssdImportStore
} from '@/headless/stores'
import EquipmentMatchingHeader from './equipment-matching-header.svelte'
import EquipmentMatchingRow from './equipment-matching-row.svelte'
import TemplateCountMismatchPanel from './template-count-mismatch-panel.svelte'

const bayType = $derived(
	bayTypesStore.selectedBayType
		? ssdImportStore.bayTypes.find(
				(bt) => bt.uuid === bayTypesStore.selectedBayType
			)
		: null
)

const scdEquipment = $derived(
	bayStore.scdBay
		? Array.from(bayStore.scdBay.querySelectorAll('ConductingEquipment'))
		: []
)

const ambiguousEquipmentRows = $derived.by(() => {
	const rows: Array<{ name: string; type: string }> = []

	for (const eq of scdEquipment) {
		const type = eq.getAttribute('type')
		if (
			type == null ||
			(equipmentMatchingStore.templatesByType.get(type)?.length ?? 0) <= 1
		)
			continue

		const rawName = eq.getAttribute('name')?.trim()
		if (!rawName) continue

		rows.push({ name: rawName, type })
	}

	return rows
})

const allMatchesSet = $derived(
	ambiguousEquipmentRows.length > 0 &&
		ambiguousEquipmentRows.every((equipment) =>
			equipmentMatchingStore.manualMatches.has(equipment.name)
		) &&
		equipmentMatchingStore.templateCountMismatch.length === 0
)

const hasMissingMatches = $derived(
	ambiguousEquipmentRows.some(
		(equipment) => !equipmentMatchingStore.manualMatches.has(equipment.name)
	)
)

const optionsByEquipment = $derived.by(() => {
	const noOption = [{ value: '', label: 'None' }]
	const map = new Map<string, { value: string; label: string }[]>()

	for (const equipment of ambiguousEquipmentRows) {
		const { name, type } = equipment

		if (!type || !bayType) {
			map.set(name, noOption)
			continue
		}

		const seen = new Set<string>()
		const unique = (
			equipmentMatchingStore.templatesByType.get(type) ?? []
		).filter((t) => {
			if (seen.has(t.uuid)) return false
			seen.add(t.uuid)
			return true
		})

		map.set(name, [
			...noOption,
			...unique.map((t) => ({
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
			{#each ambiguousEquipmentRows as equipment (equipment.name)}
				{@const options = optionsByEquipment.get(equipment.name) ?? []}

				<EquipmentMatchingRow
					{equipment}
					{options}
					selectedTemplateUuid={equipmentMatchingStore.manualMatches.get(
						equipment.name,
					) ?? ""}
					handleMatchChange={(name, uuid) => equipmentMatchingStore.setMatch(name, uuid)}
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
