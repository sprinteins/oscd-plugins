<script lang="ts">
import type {
	BayTypeWithTemplates,
	ConductingEquipmentTemplate,
	FunctionTemplate
} from '@/headless/common-types'
import EqFunctionType from './eq-function-type.svelte'
import FunctionType from './function-type.svelte'
import GeneralEquipmentType from './general-equipment-type.svelte'

const {
	functionTemplates,
	conductingEquipmentTemplates,
	bayTypeWithTemplates
}: {
	functionTemplates: FunctionTemplate[]
	conductingEquipmentTemplates: ConductingEquipmentTemplate[]
	bayTypeWithTemplates: BayTypeWithTemplates | null
} = $props()

const equipmentMap = $derived(
	new Map(conductingEquipmentTemplates.map((e) => [e.uuid, e]))
)
const functionMap = $derived(new Map(functionTemplates.map((f) => [f.uuid, f])))

const geTemplateMap = $derived(
	new Map(
		(bayTypeWithTemplates?.generalEquipmentTemplates ?? []).map((ge) => [
			ge.uuid,
			ge
		])
	)
)

const hasEquipmentFunctions = $derived(
	bayTypeWithTemplates?.conductingEquipments.some(
		(eq) => equipmentMap.get(eq.templateUuid)?.eqFunctions?.length
	) ?? false
)
const hasGEFunctions = $derived(
	bayTypeWithTemplates?.generalEquipments.some(
		(ge) => geTemplateMap.get(ge.templateUuid)?.eqFunctions?.length
	) ?? false
)
const hasFunctions = $derived(
	(bayTypeWithTemplates?.functions.length ?? 0) > 0 &&
		functionTemplates.length > 0
)
</script>

{#if hasEquipmentFunctions && bayTypeWithTemplates}
  <div class="space-y-2 mb-2">
    <h3 class="text-sm font-semibold text-gray-700">Conducting Equipment Functions</h3>
    {#each bayTypeWithTemplates.conductingEquipments as eqInstance}
      {@const equipment = equipmentMap.get(eqInstance.templateUuid)}
      {#if equipment?.eqFunctions?.length}
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

{#if hasGEFunctions && bayTypeWithTemplates}
  <div class="space-y-2 mb-2">
    <h3 class="text-sm font-semibold text-gray-700">General Equipment Functions</h3>
    {#each bayTypeWithTemplates.generalEquipments as geInstance}
      {@const ge = geTemplateMap.get(geInstance.templateUuid)}
      {#if ge?.eqFunctions?.length}
        {#each ge.eqFunctions as eqFunc}
          <GeneralEquipmentType
            eqFunction={eqFunc}
            generalEquipment={ge}
            bayTypeInstanceUuid={geInstance.uuid}
          />
        {/each}
      {/if}
    {/each}
  </div>
{/if}

{#if hasFunctions && bayTypeWithTemplates}
  <div class="space-y-2">
    <h3 class="text-sm font-semibold text-gray-700">Functions</h3>
    {#each bayTypeWithTemplates.functions as funcInstance}
      {@const func = functionMap.get(funcInstance.templateUuid)}
      {#if func}
        <FunctionType {func} bayTypeInstanceUuid={funcInstance.uuid} />
      {/if}
    {/each}
  </div>
{/if}
