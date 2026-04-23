<script lang="ts">
import { Tooltip, Truncate } from '@/ui/components'
import type { Template } from '@/ui/components/views/template-overview/types.template-overview'
import { CustomIconButton } from '@oscd-plugins/ui/src/components'
import DataTable, { Head, Body, Row, Cell } from '@smui/data-table'

interface Props {
	allTemplates: Template[]
	deleteTemplate: (id: string) => void
	editTemplate: (id: string) => void
	downloadTemplate: (id: string, orientation: 'portrait' | 'landscape') => void
	duplicateTemplate: (id: string) => void
}

let {
	allTemplates,
	deleteTemplate,
	editTemplate,
	downloadTemplate,
	duplicateTemplate
}: Props = $props()

let openDownloadMenuFor: string | null = $state(null)
let downloadMenuPos = $state({ top: 0, right: 0 })

function openDownloadMenu(templateId: string, event: MouseEvent) {
	const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
	downloadMenuPos = { top: rect.bottom, right: window.innerWidth - rect.right }
	openDownloadMenuFor = templateId
}

function closeDownloadMenu() {
	openDownloadMenuFor = null
}

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
            {#each allTemplates as template, i}
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
                            <CustomIconButton icon="edit" color="black" size="small" onclick={()=>{editTemplate(template.id)}}/>
                        </Tooltip>
                        <Tooltip text="Delete" position="left" isPositionModified={true}>
                            <CustomIconButton icon="delete" color="black" size="small" onclick={()=>{deleteTemplate(template.id)}}/>
                        </Tooltip>
                        <Tooltip text="Duplicate" position="left" isPositionModified={true}>
                            <CustomIconButton icon="content_copy" color="black" size="small" onclick={()=>{duplicateTemplate(template.id)}}/>
                        </Tooltip>
                        <!-- ! &nbsp; - No-Break Space. Verhindert den Umbruch des Tooltips. Wenn nicht verwendet, wird das zweite Wort vom Border der Zeile(Spalte) abgeschnitten. -->
                        <div class="download-menu-wrapper">
                            <Tooltip text="Generate&nbsp;Document" position="left" isPositionModified={true}>
                                <CustomIconButton icon="download" color="black" size="small" onclick={(e) => openDownloadMenu(template.id, e)}/>
                            </Tooltip>
                        </div>
                    </div>
                    </Cell>
                </Row>
            {/each}
        </Body>
    </DataTable>
{/if}  

{#if openDownloadMenuFor !== null}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="download-backdrop" onclick={closeDownloadMenu} onkeydown={() => {}}></div>
    <div class="download-dropdown" style="top: {downloadMenuPos.top}px; right: {downloadMenuPos.right}px;">
        <button onclick={() => { downloadTemplate(openDownloadMenuFor!, 'portrait'); closeDownloadMenu() }}>Portrait PDF</button>
        <button onclick={() => { downloadTemplate(openDownloadMenuFor!, 'landscape'); closeDownloadMenu() }}>Landscape PDF</button>
    </div>
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
    .download-menu-wrapper {
        position: relative;
        display: inline-block;
    }
    .download-backdrop {
        position: fixed;
        inset: 0;
        z-index: 999;
    }
    .download-dropdown {
        position: fixed;
        z-index: 1000;
        background: white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        min-width: 8rem;

        button {
            padding: 0.6rem 1rem;
            text-align: left;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 0.875rem;

            &:hover {
                background: rgba(0, 0, 0, 0.06);
            }
        }
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