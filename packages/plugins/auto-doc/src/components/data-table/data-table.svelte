<script lang="ts">
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    import Checkbox from '@smui/checkbox';
    import  IconWrapper from '../../../../../ui/src/components/icons/icon-wrapper.svelte'
    import IconButton from '@smui/icon-button'


    type Template = {
        name: string,
        description: string,
        lastEdited: Date,       
    }
  
    let allTemplates : Template[] = [
      {
        name: 'Template1',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, asperiores accusamus quis sapiente sequi facilis?',
        lastEdited: new Date("2024-10-15T08:38:00"),
      },
      {
        name: 'Template256',
        description: 'A simple description',
        lastEdited: new Date("2024-10-10T13:24:00")
      },
      {
        name: 'CYK_Template',
        description: 'I have an invalid Date ',
        lastEdited: new Date("foo"),
      },
      {
        name: 'I surely have quite a long title name.',
        description: "Lorem ipsum dolor sit amet consectetur.",
        lastEdited: new Date("2024-10-20T10:55:32"),
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


<div class="template-controls">
    <button class="btn-pill btn-pill-primary"> + Add template</button>

    <button class="btn-pill btn-pill-outlined">Export Documents</button>
    <button class="btn-pill btn-pill-outlined">Filter</button>
</div>


<main class="table-container">
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
            <Cell></Cell>
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
                    <IconButton>
                        <IconWrapper icon="edit" fillColor="black"/>
                    </IconButton>
                    <IconButton>
                        <IconWrapper icon="delete" fillColor="black"/>
                    </IconButton>
                    <IconButton>
                        <IconWrapper icon="content_copy" fillColor="black"/>
                    </IconButton>
                    <IconButton>
                        <IconWrapper icon="download" fillColor="black"/>
                    </IconButton>
                </div>
                </Cell>
            </Row>
            {/each}
        </Body>
    </DataTable>
</main>



  

  

<style lang="scss">
    $clr-purple: #6C71C3;
    $clr-purple-15: #494fbf;

    .total-selected{
        /* border: 1px solid red; */
        min-height: 1.25rem;
    }
    .table-container{
       min-width: 1600px;
    }
    .table-container{

        & :global(.mdc-data-table__table-container),
        :global(.mdc-data-table__header-cell)
        {
            background-color: rgba(255,255,255);
        }
    }

    .template-controls{
        margin: 1rem 0 0 1rem;
        .btn-pill{
            padding: 0.5em 1em;
            border-radius: 1em;
            cursor: pointer;
        }

        .btn-pill-outlined{
            background-color: transparent;
            border-color: $clr-purple;
            color: $clr-purple;


            &:hover{
                background-color: $clr-purple;
                color: white;
            }
        }

        .btn-pill-primary{
            background-color: $clr-purple;
            color: white;

            &:hover{
                background-color:$clr-purple-15;
                color: white;
            }
        }
    }
   
</style>