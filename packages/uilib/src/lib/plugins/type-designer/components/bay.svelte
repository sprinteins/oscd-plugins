<script lang="ts">
    import { type BayTypeElement, type IEDTypeElement, type LDeviceTypeElement, type VoltageLevelTypeElement } from '@oscd-plugins/core';
    import Card, {
        Content,
    } from '@smui/card';

    // TODO remove 4 lines
    export let typeDesigner: {
		logicalDevices: LDeviceTypeElement[]
		bays: BayTypeElement[]
		ieds: IEDTypeElement[]
		voltageLevels: VoltageLevelTypeElement[]
	}
</script>

<bay>
    <div class="card-container">
        {#each Object.values(typeDesigner) as componentArray, componentIndex (componentIndex)}
            {#each componentArray as component (component.id)}
                <Card>
                    <Content>
                        {Object.keys(typeDesigner)[componentIndex]} #{component.id}
                        <br>
                        {#each Object.entries(component) as [key, value]}
                            {key}: {value}
                            <br>
                        {/each}
                    </Content>
                </Card>
            {/each}
        {/each}
    </div>
</bay>

<style>
    bay {
      width: 100%;
      height: 100%;
    }

    .card-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        grid-gap: 1rem;
        align-items: start;
    }
</style>
