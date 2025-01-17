<script lang="ts">
    import {
    	filterState,
    	type SelectedFilter,
    } from "../_store-view-filter/selected-filter-store"
    import {
    	selectIEDNode,
    	clearSelection,
    	setNameFilter,
        clearIEDSelection,
        toggleMultiSelectionOfIED,
    } from "../_store-view-filter/selected-filter-store-functions"
    import ConnectionSelector from "./assets/connection-selector.svg"
    import type { BayNode, IEDNode, RootNode } from "../../../components/diagram"
    import { ConnectionTypeFilter } from "./connection-type-filter"
    import { MessageTypeFilter } from "./message-type-filter"
    import ConnectionInformation from "./connection-information/connection-information.svelte"
    import IEDAccordion from "./ied-accordion/ied-accordion.svelte"
    import { preferences$ } from "../_store-preferences"

    export let rootNode: RootNode
    export let bays: string[]

    $: IEDSelections = $filterState?.selectedIEDs
    $: ConnectionSelection = $filterState.selectedConnection
    $: selectedMessageTypes = $filterState.selectedMessageTypes
    $: isIedFiltersDisabled =
        $filterState?.selectedConnection !== undefined
    $: isConnectionDirectionDisabled = handleConnectionDirectionDisabled(
    	$filterState,
    	isIedFiltersDisabled
    )

    let IEDs = rootNode.children;  
    let searchQuery = ""
    let searchFocus = false
    let filteredIEDs = IEDs
    let filteredBays = bays

    function handleConnectionDirectionDisabled(
    	filter: SelectedFilter,
    	iedFilterDisabled: boolean
    ): boolean {        
    	if (iedFilterDisabled) return true

        searchQuery = ""
    	const selectedIEDs = filter?.selectedIEDs
    	const selectedCon = filter?.selectedConnection?.id

        return Boolean(selectedIEDs.length === 0 && selectedCon === undefined)
    }

    function handleNameFilterChange(e: Event) {
    	const target = e.target as HTMLInputElement
    	setNameFilter(target.value)
    }

    function handleSearch() {
        filteredIEDs = IEDs.filter(ied => ied.label.toLowerCase().includes(searchQuery.toLowerCase()))
		filteredBays = bays.filter(bay => bay.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    function handleSearchFocus(e: Event) {
        searchFocus = true
		searchQuery = ''
		handleSearch()
    }

    function handleSearchBlur(e: Event) {
		searchFocus = false		
	}

    function handleSearchClick(e: Event) {
        const target = e.target as HTMLElement;
	    const nodeName = target.innerText|| '';
        if (bays.includes(nodeName)) {
            clearIEDSelection()
            for (const node of rootNode.children) {
                if (node.bays.has(nodeName)) {
                    toggleMultiSelectionOfIED(node)
                }
            }
        }
        else {
            let selectedNode = rootNode.children.find(node => node.label == nodeName)
            if (selectedNode) {
                selectIEDNode(selectedNode)
            }
        }
    }

    function clearAll() {
        searchQuery = "";
        clearSelection();
    }

</script>

<div class="sidebar sidebar-right">
    <div class="sidebar-content">
        <!-- svelte-ignore a11y-missing-attribute -->
        <div class="actions">
            <a class="clear-all" on:keypress on:click={clearAll}>
                Clear all
            </a>
        </div>

        <div class="ied-nodes">
            <img src={ConnectionSelector} alt="connection selector" />
            <div class="dropdown">
                <input
                    class ="searchfield"
                    type="text"
                    placeholder="Filter IED or bay"
                    bind:value={searchQuery}
                    on:input={handleSearch}
                    on:focus={handleSearchFocus}
                    on:blur={handleSearchBlur}
                />
                {#if searchFocus}
                    <div class="dropdown_content">
                        {#if filteredIEDs.length > 0}
                            <div class="content_label">
                                IEDs ({filteredIEDs.length})
                            </div>
                            {#each filteredIEDs as ied}
                                <div role="button" tabindex="0" class="content" on:mousedown={handleSearchClick}>
                                    {ied.label}
                                </div>
                            {/each}
                            {#if filteredBays.length > 0}
                                <hr class="content_seperator">
                            {/if}
                        {/if}
                        {#if filteredBays.length > 0}
                            <div class="content_label">
                                bays ({filteredBays.length})
                            </div>
                            {#each filteredBays as bay}
                                <div role="button" tabindex="0" class="content" on:mousedown={handleSearchClick}>
                                    {bay}
                                </div>
                            {/each}
                        {/if}
                    </div>  
                {/if} 
            </div>
        </div>

        <div class="centered">
            <ConnectionTypeFilter 
                disabled={isConnectionDirectionDisabled} 
                isFilterIncomingActive={$filterState.incomingMessageFilterActive}
                isFilterOutgoingActive={$filterState.outgoingMessageFilterActive}
            />
        </div>

        <hr class="dashed-line" />
        <MessageTypeFilter
            {selectedMessageTypes}
            filterDisabled={isIedFiltersDisabled}
        />

        {#if IEDSelections.length > 0}
            <hr class="seperation-line" />
            <ul class="ied-detail-list">
                {#each IEDSelections as IEDSelection}
                    <li>
                        <IEDAccordion {IEDSelection} {rootNode} />
                    </li>
                {/each}
            </ul>
        {/if}

        {#if ConnectionSelection !== undefined}
            <hr class="seperation-line" />
            <ConnectionInformation {ConnectionSelection} />
        {/if}

        <hr class="seperation-line" />

        <h2>Focus Mode</h2>

        <label class="ied-search">
            <span class="ied-search-headline">Filter IEDs by name:</span>
            <input
                class="input"
                type="text"
                placeholder="e.g.: XAT"
                value={$filterState.nameFilter}
                on:input={handleNameFilterChange}
            />
        </label>

        <div class="checkbox-group">
            <label>
                <input
                    type="checkbox"
                    bind:checked={$preferences$.isFocusModeOn}
                />
                <span>Focus on selected IEDs</span>
            </label>
        </div>

        <h2>Preferences</h2>

        <div class="arrows-visible">
            <label>
                <input
                    type="checkbox"
                    bind:checked={$preferences$.showConnectionArrows}
                />
                <span>Show arrows on connections</span>
            </label>
        </div>

        <div class="checkbox-group">
            <label>
                <input
                    type="checkbox"
                    bind:checked={$preferences$.playConnectionAnimation}
                />
                <span>Play data flow animation</span>
            </label>
        </div>
    </div>
</div>

<style>
    hr {
        margin: 2rem 0;
    }

    .sidebar {
        height: 100%;
        width: var(--sidebar-width);
        overflow: hidden;
    }

    .sidebar .sidebar-content {
        padding: 1rem;
        background-color: #fcf6e5;
        height: calc(100% - 2rem);
        overflow: auto;
        min-width: 330px;
    }

    .ied-nodes {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .ied-nodes img {
        height: 1.3rem;
        width: 1.3rem;
    }

    .dropdown {
        position: relative;
        display: block;
    }

    .searchfield {
        padding: 14px 20px 12px 15px;
        border: none;
        border-bottom: 1px solid #ddd;
    }
    
    .dropdown_content {
    	display: block;
        position: absolute;
    	background-color: #f6f6f6;
        border: 1px solid #ddd;
        z-index: 1;
        width: 100%;
    }

    .content {
    	display: block;
    	color: black;
        padding: 4px 16px;
        text-decoration: none;
    }	
    
    .content_label {
    	display: block;
    	color: gray;
    	padding: 8px;
    	text-decoration: none;
    	font-size: 1em
    }
    
    .content_seperator {
    	border: none;
    	background-color: gray;
    	height: 1px;
        margin: 0.5em
    }

    .content:hover {
    	background-color: #ddd;
    }

    .actions {
        display: flex;
        flex-direction: row-reverse;
        margin-bottom: 1rem;
    }

    .actions .clear-all {
        cursor: pointer;
        border: 1px solid rgba(0, 0, 0, 0);
        border-radius: 5px;
        padding: 6px 8px;
        transition: border-color 200ms ease-in-out;
    }

    .actions .clear-all:hover {
        border-color: var(--color-text-disabled-1);
    }

    .centered {
        display: flex;
        justify-content: flex-start;
    }

    .ied-detail-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }
    .ied-search {
        display: inline-grid;
    }

    .ied-search-headline {
        margin-bottom: 0.5rem;
    }
    .input {
        margin-bottom: 1rem;
    }
    .dashed-line {
        border: 0.1rem dashed var(--color-cyan-30-pc-opacity);
    }
    .seperation-line {
        border: none;
        border-top: 0.1rem solid var(--color-accent);
    }
</style>