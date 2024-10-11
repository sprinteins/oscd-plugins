<script lang="ts">
  import Card from "@smui/card";
  import Paper from "@smui/paper";
  import Button from "@smui/button";
  import type { DataTypeTemplates } from "./data-type-templates";
  import { createNewItem } from "./create-new-item";
  import { TypeDesignerService } from "../type-designer-service";
    import { ELEMENT_NAMES, type DataTypeTemplatesQueries } from "@oscd-plugins/core";

  export let scdQueries: DataTypeTemplatesQueries;

  type Column = {
    name: string;
    visible: boolean;
    items: DataTypeTemplates[];
  };

  const service = new TypeDesignerService(scdQueries);
  const logicalDevices = service.findAllLogicalDeviceElements();
  const bays = service.findAllBayElements();
  const ieds = service.findAllIEDElements();
  const voltageLevels = service.findAllVoltageLevelElements();
  const substations = service.findAllSubstationElements();
  console.log("found: ", logicalDevices);

  let columns: Column[] = [
    { name: ELEMENT_NAMES.bay, visible: true, items: bays },
    { name: ELEMENT_NAMES.ied, visible: true, items: ieds },
    { name: ELEMENT_NAMES.substation, visible: true, items: substations },
    { name: ELEMENT_NAMES.lDevice, visible: true, items: logicalDevices },
    { name: ELEMENT_NAMES.voltageLevel, visible: true, items: voltageLevels },
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
              <Card
                class="card"
                on:click={() => handleCardClick(JSON.stringify(item))}
              >
                {item.name}
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
