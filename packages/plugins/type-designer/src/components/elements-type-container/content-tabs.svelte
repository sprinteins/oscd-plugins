<div class="columns-container">
  {#each columns as column, index}
    <Paper class="column">
      <IconButton
        class="hide-button"
        on:click={() => toggleColumnVisibility(index)}
      >
        <Icon class="material-icons">close</Icon>
      </IconButton>
      <div class="column-content">
        {#if column.visible}
          <Paper>
            <div class="column-header">
              <h3>{column.name}</h3>
            </div>
            {#each column.items as item}
              <Card>{item}</Card>
            {/each}
            <Button on:click={() => addItemToColumn(index)}>
              <Icon class="material-icons">Add new</Icon>
            </Button>
          </Paper>
        {/if}
      </div>
    </Paper>
  {/each}
</div>

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
        ? { ...column, items: [...column.items, column.name] }
        : column,
    );
  }
</script>