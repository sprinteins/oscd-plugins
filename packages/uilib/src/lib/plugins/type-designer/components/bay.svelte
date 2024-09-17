<script lang="ts">
    import { type BayTypeElement, type IEDTypeElement, type LDeviceTypeElement, type VoltageLevelTypeElement } from '@oscd-plugins/core';
    import Card, {
        Content,
    } from '@smui/card';
    import { type TypeCluster } from '../types';

    export let typeCluster: TypeCluster;

    function formatComponentName(name: string): string {
        if (name.endsWith('s')) {
            name = name.slice(0, -1);
        }
        name = name.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        return name;
    }
</script>

<bay>
    <div class="card-container">
        {#each Object.values(typeCluster) as componentArray, componentIndex (componentIndex)}
            {#each componentArray as component (component.id)}
                <Card>
                    <Content>
                        {formatComponentName(Object.keys(typeCluster)[componentIndex])} #{component.id}
                        <br>
                        {#each Object.entries(component) as [key, value]}
                            {#if typeof value !== 'object'}
                                {key}: {value}
                                <br>
                            {/if}
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
