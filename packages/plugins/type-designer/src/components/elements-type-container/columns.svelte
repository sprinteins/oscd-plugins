<script context="module" lang="ts">
  export type Column = {
    name: string;
    visible: boolean;
    items: DataTypeTemplates[];
  };
</script>

<script lang="ts">
  import Paper, { Content } from "@smui/paper";
  import Button from "@smui/button";
  import type { DataTypeTemplates } from "./data-type-templates";
  import { createNewItem } from "./create-new-item";
  import {
    ELEMENT_NAMES,
    type DataTypeTemplatesService,
  } from "@oscd-plugins/core";
  import ContentCard from "./content-card.svelte";
  import IconWrapper from "@oscd-plugins/ui/src/components/icons/icon-wrapper.svelte";
  import IconButton from "@smui/icon-button";

  export let service: DataTypeTemplatesService;

  const typeCluster = service.findTypeDesignerElements();

  let columns: Column[] = [
    {
      name: ELEMENT_NAMES.substation,
      visible: true,
      items: typeCluster.substations,
    },
    {
      name: ELEMENT_NAMES.voltageLevel,
      visible: true,
      items: typeCluster.voltageLevels,
    },
    { name: ELEMENT_NAMES.bay, visible: true, items: typeCluster.bays },
    { name: ELEMENT_NAMES.ied, visible: true, items: typeCluster.ieds },
    {
      name: ELEMENT_NAMES.lDevice,
      visible: true,
      items: typeCluster.logicalDevices,
    },
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

<article class="columns-container" id="type-designer-columns">
    {#each columns as column, index}
      <Paper class="column">
        <div class="column-header">
          {#if column.visible}
            <h2>{column.name}</h2>
          {:else}
            <h2>{column.name} (hidden)</h2>
          {/if}
          <IconButton on:click={() => toggleColumnVisibility(index)}>
            <IconWrapper
              icon={column.visible ? "visibility" : "visibility_off"}
              fillColor="rgb(81, 159, 152)"
            />
          </IconButton>
        </div>
        {#if column.visible}
          <Content class="content">
            <div class="element-types">
              <ContentCard elementType={column.items} />
            </div>
          </Content>
        {/if}
        <div class="add-button-container">
          {#if column.visible && column.name !== ELEMENT_NAMES.lNode}
            <Button class="add-button" on:click={() => addItemToColumn(index)}>
              + Create {column.name}
            </Button>
          {/if}
        </div>
      </Paper>
    {/each}
</article>

<style>
  .columns-container {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    padding: 1rem;
    height: 100%;
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
  }

  #type-designer-columns :global(.column) {
    padding: 0;
    display: flex;
    flex-direction: column;
    border: 1px solid rgb(81, 159, 152);
    transition: all 0.3s ease-in-out;
    width: 100%;
  }

  #type-designer-columns :global(.column-header) {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
  }

  #type-designer-columns :global(.content) {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
  }

  .element-types {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding: 0.5rem;
  }

  .add-button-container {
    background-color: var(--mdc-theme-surface);
    margin-top: auto;
    width: 100%;
  }

  #type-designer-columns :global(.add-button) {
    width: 100%;
    padding: 0.5rem;
    border: none;
    font-size: 1rem;
    text-transform: none;
  }

  #type-designer-columns :global(.collapsed-column) {
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
  }

  #type-designer-columns :global(.rhombus-icon) {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 8px;
    height: 8px;
    background-color: rgb(81, 159, 152);
    transform: rotate(45deg);
  }

  @media (max-width: 768px) {
    .columns-container {
      flex-direction: column;
      height: auto;
    }

    #type-designer-columns :global(.column) {
      max-width: none;
      height: auto;
    }
  }
</style>
