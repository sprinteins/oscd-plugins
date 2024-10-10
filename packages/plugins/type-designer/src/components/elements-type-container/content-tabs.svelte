<script lang="ts">
  import IconButton, { Icon } from "@smui/icon-button";
  import Card from "@smui/card";
  import Paper from "@smui/paper";
  import { ELEMENT_NAMES } from "@oscd-plugins/core";
  import Button from "@smui/button";

  type Column = {
    name: string;
    visible: boolean;
    items: string[];
  };

  type ColumnElement = {
    element: string[];
  };

  let columns: Column[] = [
    { name: ELEMENT_NAMES.bay, visible: true, items: [ELEMENT_NAMES.bay] },
    { name: ELEMENT_NAMES.ied, visible: true, items: [ELEMENT_NAMES.ied] },
    {
      name: ELEMENT_NAMES.substation,
      visible: true,
      items: [ELEMENT_NAMES.substation],
    },
    {
      name: ELEMENT_NAMES.lDevice,
      visible: true,
      items: [ELEMENT_NAMES.lDevice],
    },
    {
      name: ELEMENT_NAMES.voltageLevel,
      visible: true,
      items: [ELEMENT_NAMES.voltageLevel],
    },
  ];

  function toggleColumnVisibility(index: number) {
    columns = columns.map((column, i) =>
      i === index ? { ...column, visible: !column.visible } : column,
    );
  }

  function addItemToColumn(index: number) {
    columns = columns.map((column, i) =>
      i === index
        ? { ...column, items: [...column.items, `${column.name} ${column.items.length + 1}`] }
        : column,
    );
  }

  function handleCardClick(item: string) {
    console.log("Clicked:", item);
  }
</script>

<div class="columns-container">
  {#each columns as column, index}
    <Paper class="column">
      <div class="column-header">
        {#if column.visible}
          <h3>{column.name}</h3>
        {:else}
          <h3>{column.name} (hidden)</h3>
        {/if}
        <Button on:click={() => toggleColumnVisibility(index)}>X</Button>
      </div>
      <div class="column-content">
        {#if column.visible}
          <Paper>
            {#each column.items as item}
              <Card class="card" on:click={() => handleCardClick(item)}>
                {item}
                <div class="rhombus-icon"></div>
              </Card>
            {/each}
          </Paper>
        {/if}
      </div>
      <div class="add-button-container">
        {#if column.visible}
          <Button class="add-button" on:click={() => addItemToColumn(index)}>
            + add {column.name}
          </Button>
        {/if}
      </div>
    </Paper>
  {/each}
</div>
