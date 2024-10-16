<script context="module" lang="ts">
  export type Column = {
    name: string;
    visible: boolean;
    items: DataTypeTemplates[];
  };
</script>

<script lang="ts">
  import Paper from "@smui/paper";
  import Button from "@smui/button";
  import type { DataTypeTemplates } from "./data-type-templates";
  import { createNewItem } from "./create-new-item";
  import {
    ELEMENT_NAMES,
    type DataTypeTemplatesService,
  } from "@oscd-plugins/core";
    import ContentCard from "./content-card.svelte";

  export let service: DataTypeTemplatesService;

  const typeCluster = service.findTypeDesignerElements();

  let columns: Column[] = [
    { name: ELEMENT_NAMES.substation, visible: true, items: typeCluster.substations },
    { name: ELEMENT_NAMES.voltageLevel, visible: true, items: typeCluster.voltageLevels },
    { name: ELEMENT_NAMES.bay, visible: true, items: typeCluster.bays },
    { name: ELEMENT_NAMES.ied, visible: true, items: typeCluster.ieds },
    { name: ELEMENT_NAMES.lDevice, visible: true, items: typeCluster.logicalDevices },
    { name: ELEMENT_NAMES.lNode, visible: true, items: [] },
  ];

  function toggleColumnVisibility(index: number) {
    columns = columns.map((column, i) =>
      i === index ? { ...column, visible: !column.visible } : column,
    );
  }

  function addItemToColumn(index: number) {
    const column = columns[index];
    const itemCount = column.items.length;
    const newItem = createNewItem(column.name, itemCount);

    if (newItem) {
      columns = columns.map((col, i) =>
        i === index ? { ...col, items: [...col.items, newItem] } : col,
      );
    }
  }
</script>

<div class="columns-container">
  {#each columns as column, index}
    <Paper class="column">
      <div class="column-header">
        {#if column.visible}
          <h2>{column.name}</h2>
        {:else}
          <h2>{column.name} (hidden)</h2>
        {/if}
        <Button on:click={() => toggleColumnVisibility(index)}>X</Button>
      </div>
      <ContentCard column={column} />
      <div class="add-button-container">
        {#if column.visible && column.name !== ELEMENT_NAMES.lNode}
          <Button class="add-button" on:click={() => addItemToColumn(index)}>
            + add {column.name}
          </Button>
        {/if}
      </div>
    </Paper>
  {/each}
</div>
