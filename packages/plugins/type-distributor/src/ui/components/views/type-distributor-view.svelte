<script lang="ts">
import {
	Card,
	pluginGlobalStore,
	SelectWorkaround,
	Button
} from '@oscd-plugins/core-ui-svelte'
import { bayStore, bayTypesStore, equipmentMatchingStore } from '@/headless/stores'
import type { BayType } from '@/headless/types'
import { BayTypeDetails } from '@/ui/components'
import EquipmentMatching from '@/ui/components/equipment-matching.svelte'
import { getSIEDs } from '@/headless/ied'
import SIedDetails from '../s-ied-details.svelte'
import { AddSIedApDialogTrigger } from '../s-ied-ap'
import { onSelectBayType } from '@/headless/matching'
import { getDocumentAndEditor, getBayElement } from '@/headless/distribution'

const bayTypeOptions = $derived(
	bayTypesStore.bayTypes.map((bt: BayType) => ({
		value: bt.uuid,
		label: bt.name
	}))
)

const bayTypeWithTemplates = $derived(
	bayTypesStore.selectedBayType
		? bayTypesStore.getBayTypeWithTemplates(bayTypesStore.selectedBayType)
		: null
)

const functionTemplates = $derived(
	bayTypeWithTemplates?.functionTemplates ?? []
)
const conductingEquipmentTemplates = $derived(
	bayTypeWithTemplates?.conductingEquipmentTemplates ?? []
)

const sIedItems = $derived.by(() => {
	pluginGlobalStore.editCount
	return getSIEDs(bayStore.selectedBay ?? '')
})

// Get SCD Bay element - only when needed, not in a derived
function getScdBay(): Element | null {
	console.log('[getScdBay] Called, selectedBay:', bayStore.selectedBay)
	if (!bayStore.selectedBay) {
		console.log('[getScdBay] No bay selected')
		return null
	}
	try {
		const { doc } = getDocumentAndEditor()
		const bay = getBayElement(doc, bayStore.selectedBay)
		console.log('[getScdBay] Found bay:', bay)
		return bay
	} catch (error) {
		console.log('[getScdBay] Error:', error)
		return null
	}
}

// Debug effect to track reactivity
$effect(() => {
	const shouldShow = bayStore.selectedBay && 
		bayTypesStore.selectedBayType && 
		equipmentMatchingStore.validationResult?.requiresManualMatching
	
	if (shouldShow) {
		console.log('[Equipment Matching] Showing UI for manual matching')
	}
})

// Bay type selection error
let bayTypeError = $state<string | null>(null)

function handleBayTypeChange() {
	console.log('[handleBayTypeChange] Called with selectedBayType:', bayTypesStore.selectedBayType)
	console.log('[handleBayTypeChange] equipmentMatchingStore.validationResult BEFORE:', equipmentMatchingStore.validationResult)
	bayTypeError = null
	
	if (!bayStore.selectedBay) {
		console.log('[handleBayTypeChange] No bay selected')
		bayTypeError = 'No Bay selected'
		return
	}
	
	try {
		// Check if editor is available
		getDocumentAndEditor()
		console.log('[handleBayTypeChange] Editor available, calling onSelectBayType')
		
		// Validate and potentially show manual matching UI
		onSelectBayType(bayStore.selectedBay, false)
		console.log('[handleBayTypeChange] Validation result AFTER:', equipmentMatchingStore.validationResult)
		console.log('[handleBayTypeChange] requiresManualMatching:', equipmentMatchingStore.validationResult?.requiresManualMatching)
	} catch (error) {
		console.error('[handleBayTypeChange] Error:', error)
		if (error instanceof Error && error.message === 'No editor available') {
			bayTypeError = 'Editor not ready yet. Please try again.'
		} else {
			bayTypeError = error instanceof Error ? error.message : 'Failed to select bay type'
		}
	}
}

function handleApplyBayType() {
	console.log('[handleApplyBayType] Called')
	console.log('[handleApplyBayType] Manual matches:', equipmentMatchingStore.manualMatches)
	console.log('[handleApplyBayType] Validation result:', equipmentMatchingStore.validationResult)
	bayTypeError = null
	
	if (!bayStore.selectedBay) {
		console.log('[handleApplyBayType] No bay selected')
		bayTypeError = 'No Bay selected'
		return
	}
	
	try {
		// Check if editor is available
		getDocumentAndEditor()
		console.log('[handleApplyBayType] Editor available, applying changes')
		
		// Apply the changes with manual matches if needed
		onSelectBayType(bayStore.selectedBay, true)
		console.log('[handleApplyBayType] Changes applied successfully')
		
		// Clear the validation result to hide the equipment matching UI
		equipmentMatchingStore.clearValidationResult()
	} catch (error) {
		console.error('[handleApplyBayType] Error:', error)
		if (error instanceof Error && error.message === 'No editor available') {
			bayTypeError = 'Editor not ready yet. Please try again.'
		} else {
			bayTypeError = error instanceof Error ? error.message : 'Failed to apply bay type'
		}
	}
}

const canApply = $derived.by(() => {
	const result = (() => {
		if (!bayTypesStore.selectedBayType || !equipmentMatchingStore.validationResult?.isValid) {
			return false
		}
		
		if (!equipmentMatchingStore.validationResult?.requiresManualMatching) {
			return true
		}
		
		// For manual matching, check if all ambiguous equipment has matches
		// We need to count only ambiguous equipment, not all equipment
		const bay = getScdBay()
		if (!bay) return false
		
		// Count equipment with ambiguous types - use snapshot to avoid proxy issues
		// ambiguousTypes contains strings like "DIS (Disconnector, Earth Switch)"
		// We need to extract just the type part before the parenthesis
		const ambiguousTypesRaw = $state.snapshot(equipmentMatchingStore.validationResult?.ambiguousTypes) || []
		const ambiguousTypes = ambiguousTypesRaw.map(typeStr => {
			const match = typeStr.match(/^([^\s(]+)/)
			return match ? match[1] : typeStr
		})
		
		const allEquipment = Array.from(bay.querySelectorAll('ConductingEquipment'))
		const ambiguousEquipmentCount = allEquipment.filter(eq => {
			const type = eq.getAttribute('type')
			return type && ambiguousTypes.includes(type)
		}).length
		
		const allMatchesSet = equipmentMatchingStore.areAllManualMatchesSet(ambiguousEquipmentCount)
		
		return allMatchesSet
	})()
	
	console.log('[canApply] Computed:', result, {
		selectedBayType: bayTypesStore.selectedBayType,
		isValid: equipmentMatchingStore.validationResult?.isValid,
		requiresManualMatching: equipmentMatchingStore.validationResult?.requiresManualMatching,
		manualMatchesCount: equipmentMatchingStore.manualMatches.size
	})
	
	return result
})
</script>

<div class="grid grid-cols-3 gap-4 w-full h-full p-4 overflow-hidden">
  <Card.Root class="flex-1 flex flex-col min-h-full">
    <Card.Header>
      <Card.Title>SLD</Card.Title>
    </Card.Header>
  </Card.Root>
  <Card.Root class="flex-1 flex flex-col min-h-full">
    <Card.Header>
      <Card.Title>S-IEDs</Card.Title>
    </Card.Header>
    <Card.Content class="flex-1 overflow-y-auto">
      <div class="flex flex-col gap-y-4 justify-between">
        <SIedDetails {sIedItems} />
        <AddSIedApDialogTrigger />
      </div>
    </Card.Content>
  </Card.Root>
  <Card.Root class="flex-1 flex flex-col min-h-full">
    <Card.Header>
      <SelectWorkaround
        bind:value={bayTypesStore.selectedBayType}
        handleChange={handleBayTypeChange}
        options={bayTypeOptions}
        placeholder="Select Bay Type"
        class="w-full"
      />
    </Card.Header>
    <Card.Content class="overflow-y-auto space-y-4">
      {#if bayTypeError}
        <div class="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {bayTypeError}
        </div>
      {/if}
      
      {#if equipmentMatchingStore.validationResult && !equipmentMatchingStore.validationResult.isValid && !equipmentMatchingStore.validationResult.requiresManualMatching}
        <div class="p-3 bg-red-50 border border-red-200 rounded">
          <p class="text-sm font-semibold text-red-700 mb-2">Validation Errors:</p>
          <ul class="text-sm text-red-600 space-y-1">
            {#each equipmentMatchingStore.validationResult.errors as error}
              <li>• {error}</li>
            {/each}
          </ul>
        </div>
      {/if}
      
      {#if bayStore.selectedBay && bayTypesStore.selectedBayType && equipmentMatchingStore.validationResult?.requiresManualMatching}
        {@const bay = getScdBay()}
        {#if equipmentMatchingStore.validationResult.errors.length > 0}
          <div class="p-3 bg-amber-50 border border-amber-200 rounded mb-4">
            <p class="text-sm font-semibold text-amber-700 mb-2">Please match the equipment manually:</p>
            <ul class="text-sm text-amber-600 space-y-1">
              {#each equipmentMatchingStore.validationResult.errors as error}
                <li>• {error}</li>
              {/each}
            </ul>
          </div>
        {/if}
        {#if bay}
          <EquipmentMatching 
            scdBay={bay} 
            bayTypeUuid={bayTypesStore.selectedBayType}
          />
        {:else}
          <div class="p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p class="text-sm text-yellow-700">Unable to load bay element for matching</p>
          </div>
        {/if}
      {/if}
      
      {#if bayTypesStore.selectedBayType && equipmentMatchingStore.validationResult?.isValid}
        <Button.Root
          onclick={handleApplyBayType}
          disabled={!canApply}
          class="w-full"
        >
          Apply Bay Type
        </Button.Root>
      {/if}
      
      {#if bayTypeWithTemplates}
        <BayTypeDetails
          {functionTemplates}
          {conductingEquipmentTemplates}
        />
      {:else}
        <p class="text-gray-500 text-sm">
          Select a bay type to see details
        </p>
      {/if}
    </Card.Content>
  </Card.Root>
</div>
