<script lang="ts">
import type {
	ConductingEquipmentTemplate,
	FunctionTemplate
} from '@/headless/types'
import { EquipmentItem, FunctionItem } from '@/ui/components/items'

const {
	functionTemplates,
	conductingEquipmentTemplates
}: {
	functionTemplates: FunctionTemplate[]
	conductingEquipmentTemplates: ConductingEquipmentTemplate[]
} = $props()

// Mock data for testing drag and drop
const mockEquipmentTemplate: ConductingEquipmentTemplate = {
	uuid: 'mock-equipment-1',
	name: 'Q01',
	type: 'CBR',
	desc: 'Circuit Breaker',
	terminals: [],
	eqFunctions: [
		{
			uuid: 'mock-eqfunc-1',
			name: 'Protection',
			desc: 'Protection function',
			lnodes: [
				{
					uuid: 'mock-lnode-1',
					lnClass: 'XCBR',
					lnType: 'XCBR_Type1',
					lnInst: '1'
				},
				{
					uuid: 'mock-lnode-2',
					lnClass: 'CSWI',
					lnType: 'CSWI_Type1',
					lnInst: '1'
				}
			]
		}
	]
}

const mockFunctionTemplate: FunctionTemplate = {
	uuid: 'mock-func-1',
	name: 'Bay Control',
	desc: 'Bay level control function',
	lnodes: [
		{
			uuid: 'mock-lnode-3',
			lnClass: 'CILO',
			lnType: 'CILO_Type1',
			lnInst: '1'
		}
	]
}

const hasRealData = $derived(
	(conductingEquipmentTemplates && conductingEquipmentTemplates.length > 0) ||
	(functionTemplates && functionTemplates.length > 0)
)
</script>

{#if !hasRealData}
	<div class="p-4 mb-4 bg-amber-50 border border-amber-200 rounded-md">
		<p class="text-xs text-amber-800 mb-2">
			<strong>Mock Data:</strong> Drag these items to test the drop functionality
		</p>
	</div>
{/if}

{#if conductingEquipmentTemplates && conductingEquipmentTemplates.length > 0}
    <div class="space-y-2 mb-2">
        <h3 class="text-sm font-semibold text-gray-700">Equipment Functions</h3>
        {#each conductingEquipmentTemplates as equipment}
            {#if equipment.eqFunctions && equipment.eqFunctions.length > 0}
                {#each equipment.eqFunctions as eqFunc}
                    <EquipmentItem
                        eqFunction={eqFunc}
                        equipmentName={equipment.name}
                    />
                {/each}
            {/if}
        {/each}
    </div>
{:else}
	<!-- Mock Equipment Functions -->
	<div class="space-y-2 mb-2">
		<h3 class="text-sm font-semibold text-gray-700">Equipment Functions (Mock)</h3>
		{#each mockEquipmentTemplate.eqFunctions as eqFunc}
			<EquipmentItem
				eqFunction={eqFunc}
				equipmentName={mockEquipmentTemplate.name}
			/>
		{/each}
	</div>
{/if}

{#if functionTemplates && functionTemplates.length > 0}
    <div class="space-y-2">
        <h3 class="text-sm font-semibold text-gray-700">Functions</h3>
        {#each functionTemplates as func}
            <FunctionItem {func} />
        {/each}
    </div>
{:else}
	<!-- Mock Functions -->
	<div class="space-y-2">
		<h3 class="text-sm font-semibold text-gray-700">Functions (Mock)</h3>
		<FunctionItem func={mockFunctionTemplate} />
	</div>
{/if}
