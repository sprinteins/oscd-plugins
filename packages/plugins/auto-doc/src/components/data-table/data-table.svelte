<script lang="ts">
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    import Checkbox from '@smui/checkbox';
    import {Tooltip, Truncate} from "@/components"
    import type {Template} from "@/pages/template-overview/types.template-overview";
    import {CustomIconButton} from "@oscd-plugins/ui/src/components"
    import {createEventDispatcher} from "svelte"

    export let allTemplates : Template[];

    const dispatch = createEventDispatcher()
    let selectedTemplates : Template[] = [];

0
    function isInvalidDate(date: Date){
        return Number.isNaN(date.getTime());
    }

    function formatDate(date: Date, defaultString = "-"): string{
        if(isInvalidDate(date)){ return defaultString;}

        return `${getDD_MM_YYYYFromDate(date)}, ${getHH_MM_FromDate(date)}`;
    }

    function getHH_MM_FromDate(date: Date,): string{

        const timeOptions: Intl.DateTimeFormatOptions = { 
            hour: "numeric",
            minute: "2-digit"
        };

        const extractedHH_MM = new Intl.DateTimeFormat("en-US", timeOptions).format(date);
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

    function deleteTemplate(templateId: string){
        dispatch("templateDelete", {templateId})
    }

    function downloadTemplateContent(templateId: string){
        dispatch("templateDownload", {templateId})
    }

</script>



<div class="table-container">   
    {#if allTemplates.length === 0}
        <div>There are currently no templates available</div>
    {:else}
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
            {#each allTemplates as template}
                <Row>
                    <Cell checkbox>
                        <Checkbox
                            bind:group={selectedTemplates}
                            value={template}
                            valueKey={template.name}
                        />
                    </Cell>
                    <Cell>
                        <Truncate text={template.name} maxChars={40} tooltipPosition="top"/>
                    </Cell>
                    <Cell>{formatDate(template.lastEdited)}</Cell>
                    <Cell>
                        <Truncate text={template.description} maxChars={100} tooltipPosition="top"/>
                    </Cell>
                    <Cell>
                    <div class="action-btns">
                        <!-- <Tooltip text="Edit">
                            <CustomIconButton icon="edit" color="black"/>
                        </Tooltip> -->
                        <Tooltip text="Delete">
                            <CustomIconButton icon="delete" color="black" on:click={()=>{deleteTemplate(template.id)}}/>
                        </Tooltip>
                        <!-- <Tooltip text="Duplicate">
                            <CustomIconButton icon="content_copy" color="black"/>
                        </Tooltip> -->
                        <Tooltip text="Download" position="left">
                            <CustomIconButton icon="download" color="black" on:click={()=>{downloadTemplateContent(template.id)}}/>
                        </Tooltip>
                    </div>
                    </Cell>
                </Row>
            {/each}
        </Body>
    </DataTable>
{/if}  
</div>

<style lang="scss">
    .table-container{
       width: 100%;
       display: flex;
       flex-direction: column;
       align-items: center;
    }
    .table-container{

        & :global(.mdc-data-table){
            width: 95%;
        }
        & :global(.mdc-data-table__table-container),
        :global(.mdc-data-table__header-cell)
        {
            background-color: rgba(255,255,255);
        }

        & :global(.mdc-data-table__header-cell){

            &:nth-child(1){
                width: 1%;
            }
            &:nth-child(2){
                width: 25%;
            }
            &:nth-child(3){
                width: 15%;
            }
            &:nth-child(4){
                width: 40%;
            }
            &:last-child{
                width: 1%;
            }
        }

        & :global(.mdc-data-table__table-container),
         :global(.mdc-data-table){
            border-radius: 10px;
        }

        & :global(.mdc-data-table__cell){
            overflow-y: visible;
        }
    }
</style>