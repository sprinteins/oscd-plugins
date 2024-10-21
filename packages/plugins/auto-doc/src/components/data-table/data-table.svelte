<script lang="ts">
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    import Checkbox from '@smui/checkbox';
    import Button from "../../../../../uilib/src/lib/components/button/button.svelte"

    type Template = {
        name: string,
        description: string,
        lastEdited: Date,       
    }
  
    let allTemplates : Template[] = [
      {
        name: 'Template1',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, asperiores accusamus quis sapiente sequi facilis?',
        lastEdited: new Date(),
      },
      {
        name: 'Template256',
        description: 'A simple description',
        lastEdited: new Date()
      },
      {
        name: 'CYK_Template',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        lastEdited: new Date("foo"),
      },
      {
        name: 'I surely have quite a long title name.',
        description: "Lorem ipsum dolor sit amet consectetur.",
        lastEdited: new Date(),
      },
      {
        name: 'AUOBHBT Template',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta placeat itaque minus praesentium sequi deleniti voluptatibus dicta!',
        lastEdited: new Date(),
      },
    ];
    let selectedTemplates : Template[] = [];

    $: totalSelected = selectedTemplates.length

function isInvalidDate(date: Date){
    return isNaN(date.getTime());
}

function formatDate(date: Date, defaultString: string = "-"): string{
    if(isInvalidDate(date)){ return defaultString;}

    return `${getDD_MM_YYYYFromDate(date)}, ${getHH_MM_FromDate(date)}`;
}

function getHH_MM_FromDate(date: Date,): string{

    const timeOptions: Intl.DateTimeFormatOptions = { 
        hour: "numeric",
        minute: "2-digit"
    };

    const extractedHH_MM = new Intl.DateTimeFormat("en-US", timeOptions).format(date)
    return extractedHH_MM;
}
function getDD_MM_YYYYFromDate(date: Date): string{
    const dateOptions: Intl.DateTimeFormatOptions = { 
        month:   "2-digit" as const, 
        day:     "2-digit" as const,
        year:    "numeric" as const,
    };

    const DD_MM_YYYY = new Date(date).toLocaleDateString("de-DE", dateOptions); 
    return DD_MM_YYYY;
}



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
                <Cell>{formatDate(template.lastEdited)}</Cell>
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