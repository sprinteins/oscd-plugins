<script lang="ts">
import type {
	ConductingEquipmentTemplate,
	FunctionTemplate
} from '@/headless/common-types'
import EqFunctionType from './eq-function-type.svelte'
import FunctionType from './function-type.svelte'

const {
	functionTemplates,
	conductingEquipmentTemplates
}: {
	functionTemplates: FunctionTemplate[]
	conductingEquipmentTemplates: ConductingEquipmentTemplate[]
} = $props()
</script>

{#if conductingEquipmentTemplates && conductingEquipmentTemplates.length > 0}
  <div class="space-y-2 mb-2">
    <h3 class="text-sm font-semibold text-gray-700">Equipment Functions</h3>
    {#each conductingEquipmentTemplates as equipment}
      {#if equipment.eqFunctions && equipment.eqFunctions.length > 0}
        {#each equipment.eqFunctions as eqFunc}
          <EqFunctionType eqFunction={eqFunc} {equipment} />
        {/each}
      {/if}
    {/each}
  </div>
{/if}

{#if functionTemplates && functionTemplates.length > 0}
  <div class="space-y-2">
    <h3 class="text-sm font-semibold text-gray-700">Functions</h3>
    {#each functionTemplates as func}
      <FunctionType {func} />
    {/each}
  </div>
{/if}
