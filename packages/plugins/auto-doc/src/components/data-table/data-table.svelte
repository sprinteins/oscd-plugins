<script lang="ts">
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    import Checkbox from '@smui/checkbox';
    import Button from "../../../../../uilib/src/lib/components/button/button.svelte"

    type Template = {
        name: string,
        description: string,
        lastEdited: string,       
    }
  
    let allTemplates : Template[] = [
      {
        name: 'Broom',
        description: 'A wooden handled broom.',
        lastEdited: "yesterday",
      },
      {
        name: 'Dust Pan',
        description: 'A plastic dust pan.',
        lastEdited: "yesterday"
      },
      {
        name: 'Mop',
        description: 'A strong, durable mop.',
        lastEdited: "yesterday",
      },
      {
        name: 'Horse',
        description: "She's got some miles on her.",
        lastEdited: "yesterday",
      },
      {
        name: 'Bucket',
        description: 'A metal bucket.',
        lastEdited: "yesterday",
      },
    ];
    let selectedTemplates : Template[] = [];

    $: totalSelected = selectedTemplates.length

  </script>


<div class="table-container">
    <p class="total-selected">
        {#if selectedTemplates.length > 0}
            {totalSelected} items selected
        {/if}
    </p>
    <DataTable style="width: 100%">
        <Head>
          <Row>
            <Cell checkbox>
              <Checkbox />
            </Cell>
            <Cell class="big">Name</Cell>
            <Cell>Last Edited</Cell>
            <Cell>Description</Cell>
            <Cell>Actions</Cell>
          </Row>
        </Head>
        <Body>
            {#each allTemplates as template (template.name)}
            <Row>
                <Cell checkbox>
                <Checkbox
                    bind:group={selectedTemplates}
                    value={template}
                    valueKey={template.name}
                />
                </Cell>
                <Cell>{template.name}</Cell>
                <Cell>{template.lastEdited}</Cell>
                <Cell>{template.description}</Cell>
                <Cell>
                <div class="action-btns">
                    <button>Edit</button>
                    <button>Delete</button>
                    <button>Duplicate</button>
                    <button>Download</button>
                </div>
                </Cell>
            </Row>
            {/each}
        </Body>
    </DataTable>
</div>



  

  

<style>

    .total-selected{
        /* border: 1px solid red; */
        min-height: 1.25rem;
    }
    .table-container{
       min-width: 1600px;
    }
    .table-container :global(.mdc-data-table__table-container){
        /* background-color: red; */
    }
   
</style>