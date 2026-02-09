<script lang="ts">
import type {
	ConductingEquipmentTemplate,
	FunctionTemplate,
	BayType
} from '@/headless/common-types'
import EqFunctionType from './eq-function-type.svelte'
import FunctionType from './function-type.svelte'

const {
	functionTemplates,
	conductingEquipmentTemplates,
	bayTypeWithTemplates
}: {
	functionTemplates: FunctionTemplate[]
	conductingEquipmentTemplates: ConductingEquipmentTemplate[]
	bayTypeWithTemplates:
		| (BayType & {
				conductingEquipmentTemplates: ConductingEquipmentTemplate[]
				functionTemplates: FunctionTemplate[]
		  })
		| null
} = $props()
</script>

{#if bayTypeWithTemplates && conductingEquipmentTemplates && conductingEquipmentTemplates.length > 0}
  <div class="space-y-2 mb-2">
    <h3 class="text-sm font-semibold text-gray-700">Equipment Functions</h3>
    {#each bayTypeWithTemplates.conductingEquipments as eqInstance}
      {@const equipment = conductingEquipmentTemplates.find(
        (t) => t.uuid === eqInstance.templateUuid,
      )}
      {#if equipment && equipment.eqFunctions && equipment.eqFunctions.length > 0}
        {#each equipment.eqFunctions as eqFunc}
          <EqFunctionType
            eqFunction={eqFunc}
            {equipment}
            bayTypeInstanceUuid={eqInstance.uuid}
          />
        {/each}
      {/if}
    {/each}
  </div>
{/if}

{#if bayTypeWithTemplates && functionTemplates && functionTemplates.length > 0}
  <div class="space-y-2">
    <h3 class="text-sm font-semibold text-gray-700">Functions</h3>
    {#each bayTypeWithTemplates.functions as funcInstance}
      {@const func = functionTemplates.find(
        (t) => t.uuid === funcInstance.templateUuid,
      )}
      {#if func}
        <FunctionType {func} bayTypeInstanceUuid={funcInstance.uuid} />
      {/if}
    {/each}
  </div>
{/if}
