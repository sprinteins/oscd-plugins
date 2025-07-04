<script lang="ts">
import { Tooltip, Truncate } from '@/components'
import type { Template } from '@/pages/template-overview/types.template-overview'
import { CustomIconButton } from '@oscd-plugins/ui/src/components'
import Checkbox from '@smui/checkbox'
import DataTable, { Head, Body, Row, Cell } from '@smui/data-table'
import { createEventDispatcher } from 'svelte'

export let allTemplates: Template[]

const dispatch = createEventDispatcher()
let selectedTemplates: Template[] = []

function isInvalidDate(date: Date) {
	return Number.isNaN(date.getTime())
}

function formatDate(date: Date, defaultString = '-'): string {
	if (isInvalidDate(date)) {
		return defaultString
	}

	return `${getDD_MM_YYYYFromDate(date)}, ${getHH_MM_FromDate(date)}`
}

function getHH_MM_FromDate(date: Date): string {
	const timeOptions: Intl.DateTimeFormatOptions = {
		hour: 'numeric',
		minute: '2-digit'
	}

	const extractedHH_MM = new Intl.DateTimeFormat('en-US', timeOptions).format(
		date
	)
	return extractedHH_MM
}
function getDD_MM_YYYYFromDate(date: Date): string {
	const dateOptions: Intl.DateTimeFormatOptions = {
		month: '2-digit' as const,
		day: '2-digit' as const,
		year: 'numeric' as const
	}

	const DD_MM_YYYY = new Date(date).toLocaleDateString('de-DE', dateOptions)
	return DD_MM_YYYY
}

function deleteTemplate(templateId: string) {
	dispatch('templateDelete', { templateId })
}

function downloadTemplateContent(templateId: string) {
	dispatch('templateDownload', { templateId })
}

function editTemplate(templateId: string) {
	dispatch('editTemplate', { templateId })
}
function duplicateTemplate(templateId: string) {
	dispatch('duplicateTemplate', { templateId })
}
</script>



<div class="table-container">   
    {#if allTemplates.length === 0}
        <div>There are currently no templates available</div>
    {:else}
    <DataTable>
        <Head>
            <Row>
            <!-- <Cell checkbox>
                <Checkbox />
            </Cell> -->
            <Cell class="big">Name</Cell>
            <Cell>Last Edited</Cell>
            <Cell>Description</Cell>
            <Cell></Cell>
            </Row>
        </Head>
        <Body>
            {#each allTemplates as template}
                <Row>
                    <!-- <Cell checkbox>
                        <Checkbox
                            bind:group={selectedTemplates}
                            value={template}
                            valueKey={template.name}
                        />
                    </Cell> -->
                    <Cell>
                        <Truncate text={template.name} maxChars={40} tooltipPosition="top"/>
                    </Cell>
                    <Cell>{formatDate(template.lastEdited)}</Cell>
                    <Cell>
                        <Truncate text={template.description} maxChars={100} tooltipPosition="top"/>
                    </Cell>
                    <Cell>
                    <div class="action-btns center-action-btns">
                        <Tooltip text="Edit" position="right" isPositionModified={true}>
                            <CustomIconButton icon="edit" color="black" size="small" on:click={()=>{editTemplate(template.id)}}/>
                        </Tooltip>
                        <Tooltip text="Delete" position="left" isPositionModified={true}>
                            <CustomIconButton icon="delete" color="black" size="small" on:click={()=>{deleteTemplate(template.id)}}/>
                        </Tooltip>
                        <Tooltip text="Duplicate" position="left" isPositionModified={true}>
                            <CustomIconButton icon="content_copy" color="black" size="small" on:click={()=>{duplicateTemplate(template.id)}}/>
                        </Tooltip>
                        <!-- ! &nbsp; - No-Break Space. Verhindert den Umbruch des Tooltips. Wenn nicht verwendet, wird das zweite Wort vom Border der Zeile(Spalte) abgeschnitten. -->
                        <Tooltip text="Generate&nbsp;Document" position="left" isPositionModified={true}>
                            <CustomIconButton icon="download" color="black" size="small" on:click={()=>{downloadTemplateContent(template.id)}}/>
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
    .center-action-btns {
        padding-top: 0.5rem;
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