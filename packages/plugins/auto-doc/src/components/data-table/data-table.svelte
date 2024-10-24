<script lang="ts">
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    import Checkbox from '@smui/checkbox';
    import  IconWrapper from '../../../../../ui/src/components/icons/icon-wrapper.svelte'
    import IconButton from '@smui/icon-button'
    import { type Template} from "@/pages/template-overview/template-overview.svelte"


    export let allTemplates : Template[];

    let selectedTemplates : Template[] = [];


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
    <DataTable>
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
</div>

<style lang="scss">
    .total-selected{
        min-height: 1.25rem;
    }
    .table-container{
       width: 100%;
       display: flex;
       flex-direction: column;
       align-items: center;
    }
    .table-container{

        & :global(.mdc-data-table__table-container),
        :global(.mdc-data-table__header-cell)
        {
            background-color: rgba(255,255,255);
            // border-radius: 30px;
        }

        & :global(.mdc-data-table__table-container),
         :global(.mdc-data-table){
            border-radius: 10px;
         }
    }
    span{
        display: inline-block;
        margin-left: inherit;
    }
   
</style>