<script lang="ts">
// Import directly from source in monorepo development
import TelemetryView from '@oscd-plugins/communication-explorer/src/ui/components/telemetry-view/telemetry-view.svelte'
import Checkbox from '@smui/checkbox'
import FormField from '@smui/form-field'
import Radio from '@smui/radio'
import Select, { Option } from '@smui/select'
import Textfield from '@smui/textfield'
import { IEDService } from '@oscd-plugins/core'

interface Props {
	// prop
	onContentChange: (newContent: string) => void
	content?: string
	doc?: XMLDocument
}

let { onContentChange, content = '', doc }: Props = $props()

const selectBays = [
	{ name: 'all Bays', disabled: false },
	{ name: 'Bay selection', disabled: false }
]

function getBays(xmlDocument: XMLDocument): Set<string> {
	const iedService = new IEDService(xmlDocument.documentElement)
	return iedService.Bays()
}

function getLegend() {
	throw new Error('Get Legend not implemented.')
	// Need to get the
}

function getListOfIEDandDetails(xmlDocument: XMLDocument) {
	const iedService = new IEDService(xmlDocument.documentElement)
	return iedService.IEDCommunicationInfos()
}

let bayOptions = $derived.by(() => {
	if (!doc) return new Set<string>()
	return getBays(doc)
})

let selected: string = $state(selectBays[0].name)
let selectedBay: string | undefined = $state()

// Further details checkboxes
let showLegend: boolean = $state(false)
let showListOfBays: boolean = $state(false)
let showListOfIEDs: boolean = $state(false)

// Communication matrix
interface MessageRow {
	enabled: boolean
	messageType: string
	regexSourceIED: string
	regexTargetIED: string
	regexSourceIEDError?: string
	regexTargetIEDError?: string
	matchedSourceIEDs?: string[]
	matchedTargetIEDs?: string[]
}

let messageRows: MessageRow[] = $state([
	{
		enabled: true,
		messageType: 'Goose',
		regexSourceIED: '',
		regexTargetIED: '',
		matchedSourceIEDs: [],
		matchedTargetIEDs: []
	},
	{
		enabled: true,
		messageType: 'MMS',
		regexSourceIED: '',
		regexTargetIED: '',
		matchedSourceIEDs: [],
		matchedTargetIEDs: []
	},
	{
		enabled: true,
		messageType: 'SMV',
		regexSourceIED: '',
		regexTargetIED: '',
		matchedSourceIEDs: [],
		matchedTargetIEDs: []
	},
	{
		enabled: false,
		messageType: 'Unknown',
		regexSourceIED: '',
		regexTargetIED: '',
		matchedSourceIEDs: [],
		matchedTargetIEDs: []
	}
])

// Get all IED names from the document
let availableIEDs = $derived.by(() => {
	if (!doc) return []
	const iedInfos = getListOfIEDandDetails(doc)
	return iedInfos.map((info) => info.iedName)
})

// Match IEDs based on regex pattern
function matchIEDsWithRegex(pattern: string, ieds: string[]): string[] {
	if (!pattern) return []

	try {
		const regex = new RegExp(pattern)
		return ieds.filter((ied) => regex.test(ied))
	} catch (e) {
		return []
	}
}

// Validate regex pattern
function validateRegex(pattern: string): string | undefined {
	if (!pattern) return undefined

	try {
		new RegExp(pattern)
		return undefined
	} catch (e) {
		return 'Invalid regex'
	}
}

// Update validation when IED fields change
function updateSourceIEDValidation(index: number, event: Event) {
	const value = (event.target as HTMLInputElement).value
	messageRows[index].regexSourceIED = value
	messageRows[index].regexSourceIEDError = validateRegex(value)
	messageRows[index].matchedSourceIEDs = matchIEDsWithRegex(
		value,
		availableIEDs
	)
}

function updateTargetIEDValidation(index: number, event: Event) {
	const value = (event.target as HTMLInputElement).value
	messageRows[index].regexTargetIED = value
	messageRows[index].regexTargetIEDError = validateRegex(value)
	messageRows[index].matchedTargetIEDs = matchIEDsWithRegex(
		value,
		availableIEDs
	)
}
</script>

<div class="communication-overview-container">
    <!-- <div class="bay-selection">
        <p class="section-description">
            Choose the bays you want to display in the diagram
        </p>
        <div style="display: flex; flex-direction: column;">
            {#each selectBays as option}
                <FormField>
                    <Radio
                        bind:group={selected}
                        value={option.name}
                        disabled={option.disabled}
                    />
                    {#snippet label()}
                        {option.name}
                    {/snippet}
                </FormField>
            {/each}
        </div>
        <div class="bay-select-container">
            <Select
                variant="outlined"
                bind:value={selectedBay}
                label="Bay name"
                disabled={selected === "all Bays"}
            >
                {#each bayOptions as bay}
                    <Option value={bay}>{bay}</Option>
                {/each}
            </Select>
        </div>
    </div>

    <div class="further-details">
        <p class="section-description">Further details</p>
        <div style="display: flex; flex-direction: column;">
            <FormField>
                <Checkbox bind:checked={showLegend} />
                {#snippet label()}
                    Show legend
                {/snippet}
            </FormField>
            <FormField>
                <Checkbox bind:checked={showListOfBays} />
                {#snippet label()}
                    Show list of bays
                {/snippet}
            </FormField>
            <FormField>
                <Checkbox bind:checked={showListOfIEDs} />
                {#snippet label()}
                    Show list of IEDs and IED details
                {/snippet}
            </FormField>
        </div>
    </div>

    <div class="communication-matrix">
        <p class="section-description">Communication matrix</p>
        <p class="section-description">
            Choose the message types you want to display. You can filter for
            source or target IEDs with REGEX.
        </p>

        <div class="matrix-table">
            {#each messageRows as row, index}
                <div class="matrix-row">
                    <div class="checkbox-cell">
                        <Checkbox bind:checked={row.enabled} />
                    </div>
                    <div class="input-cell">
                        <Textfield
                            label="Message Type {index + 1}"
                            variant="outlined"
                            bind:value={row.messageType}
                            disabled={true}
                        />
                    </div>
                    <div class="input-cell">
                        <Textfield
                            label="Source IED"
                            variant="outlined"
                            value={row.regexSourceIED}
                            oninput={(e) => updateSourceIEDValidation(index, e)}
                            disabled={!row.enabled}
                            invalid={!!row.regexSourceIEDError}
                        >
                            {#snippet helper()}
                                {#if row.regexSourceIEDError}
                                    <span class="error-text">{row.regexSourceIEDError}</span>
                                {/if}
                            {/snippet}
                        </Textfield>
                        {#if row.matchedSourceIEDs && row.matchedSourceIEDs.length > 0}
                            <div class="matched-ieds">
                                <span class="matched-label">Matched ({row.matchedSourceIEDs.length}):</span>
                                <span class="matched-list">{row.matchedSourceIEDs.join(', ')}</span>
                            </div>
                        {/if}
                    </div>
                    <div class="input-cell">
                        <Textfield
                            label="Target IED"
                            variant="outlined"
                            value={row.regexTargetIED}
                            oninput={(e) => updateTargetIEDValidation(index, e)}
                            disabled={!row.enabled}
                            invalid={!!row.regexTargetIEDError}
                        >
                            {#snippet helper()}
                                {#if row.regexTargetIEDError}
                                    <span class="error-text">{row.regexTargetIEDError}</span>
                                {/if}
                            {/snippet}
                        </Textfield>
                        {#if row.matchedTargetIEDs && row.matchedTargetIEDs.length > 0}
                            <div class="matched-ieds">
                                <span class="matched-label">Matched ({row.matchedTargetIEDs.length}):</span>
                                <span class="matched-list">{row.matchedTargetIEDs.join(', ')}</span>
                            </div>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    </div> -->
	<communication-explorer>
	{#if doc && doc.documentElement}
		<div class="diagram-container"> 
            <!-- style="position: absolute; left: -9999px; top: -9999px; visibility: hidden;"> -->
			<TelemetryView root={doc.documentElement} showSidebar={false} />
		</div>
	{:else}
		<div class="no-data">
			<p>No XML document loaded. Please load an SCL file to view communication data.</p>
		</div>
	{/if}
	</communication-explorer>
</div>

<style lang="scss">
	.communication-overview-container {
        padding: 1rem;
        color: #333;
    }

    .section-description {
        color: #666;
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
    }

    .bay-selection {
        margin-bottom: 1.5rem;
    }

    .bay-select-container {
        margin-top: 0.5rem;
        margin-left: 1.5rem;
    }

    .further-details {
        margin-bottom: 1.5rem;
    }

    .matrix-table {
        margin-top: 1rem;
    }

    .matrix-row {
        display: grid;
        grid-template-columns: auto 1fr 1fr 1fr;
        gap: 1rem;
        align-items: start;
        margin-bottom: 1rem;
        padding: 0.5rem;
        align-items: center;
    }

    .input-cell {
        display: flex;
        flex-direction: column;
    }

    .error-text {
        font-size: 0.75rem;
        color: var(--color-red, #b00020);
    }

    .matched-ieds {
        margin-top: 0.25rem;
        padding: 0.5rem;
        background-color: #f5f5f5;
        border-radius: 4px;
        font-size: 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .matched-label {
        font-weight: 600;
        color: #333;
    }

    .matched-list {
        color: #666;
        word-break: break-word;
    }

	.diagram-container {
		min-height: 500px;
		border: 1px solid #e0e0e0;
		border-radius: 4px;
		background: white;
		overflow: hidden;
		
		/* Ensure the TelemetryView component renders properly */
		:global(.root) {
			height: 500px;
		}
	}

	.no-data {
		padding: 2rem;
		text-align: center;
		color: #808080;
	}

    communication-explorer {
		display: block;
		position: relative;
		font-size: 12px;
		min-height: 80vh;
	}
	:root,
	:host {
		--color-paper-white: #ffffff;
		--color-white: #f9f7f1;
		--color-white-dark: #f2f2f2;
		--color-yellow: #d9d800;
		--color-blue: #004552;
		--color-blue-dark: #14343e;
		--color-blue-1: #3253a8;
		--color-blue-1-light: #00c0f9;
		--color-blue-light: #e5ecee;
		--color-torques: #007d80;
		--color-torques-30-opacity: #007d804d;
		--color-green: #288409;
		--color-green-30pc-opacity: #2884094d;
		--color-green-light: #9bff00;
		--color-black: #000000;
		--color-beige-1: burlywood;
		--color-beige-2: blanchedalmond;
		--color-beige-3: #f3ecda;
		--color-beige-4: #fcf6e5;
		--color-beige-5: #fdfbf2;
		--color-red: #b00020;
		--color-pink: #c73c61;
		--color-pink-30-pc-opacity: #c73c614d;
		--color-pink-light: #ff40a7;
		--color-grey-1: #626262;
		--color-grey-2: #808080;

		--color-grey-3: #bdbdbd;
		--color-grey-dark: #4d5d63;
		--color-grey-dark-70pc-opacity: #4d5d63b3;

		--color-cyan: #2aa198;
		--color-cyan-30-pc-opacity: #2aa1984d;
		--color-select-dropdown: #fffff4;
		--color-select-dropdown-transparent: #fffff480;

		--color-border: #4d5d63;

		--color-filter-chips-background: #fdfbf2;

		--color-primary: var(--color-yellow);
		--color-secondary: var(--color-blue);
		--color-text: var(--color-white);
		--color-accent: var(--color-cyan);
		--color-text-disabled-1: rgba(0, 0, 0, 0.4);

		--border-radius: 5px;

		--font-family: "Roboto", sans-serif;
		--letter-spacing: 0.2px;
		--font-size: 12px;
		--font-size-small: 8px;
		--font-color: var(--color-grey-dark);

		--color-ied-focus: var(--color-beige-1);
		--color-ied-focus-hover: var(--color-beige-2);

		--color-message-goose: var(--color-green);
		--color-message-highlight-goose: var(--color-green-light);
		--color-message-disabled-goose: var(--color-green-30pc-opacity);
		--color-message-mms: var(--color-blue-1);
		--color-message-highlight-mms: var(--color-blue-1-light);
		--color-message-disabled-mms: var(--color-torques-30-opacity);
		--color-message-sampledvalues: var(--color-pink);
		--color-message-highlight-sampledvalues: var(--color-pink-light);
		--color-message-disabled-samplevalues: var(--color-pink-30-pc-opacity);
		--color-message-unknown: var(--color-black);

		--color-category-selector: var(--color-beige-5);

		/* cb = colorblind */
		/* --color-message-goose-cb: #3BC40E; */
		/* --color-message-mms-cb: #00BCBF; */
		/* --color-message-sampledvalues-cb: #407CF5; */

		--sidebar-width: 400px;

		/* SMUI Variables */

		--mdc-theme-primary: var(--color-cyan);
		--mdc-typography-button-font-weight: bold;
		--mdc-theme-surface: var(--color-beige-3);
		--mdc-theme-error: var(--color-red);
	}

	:root,
	:host {
		font-family: var(--font-family);
		letter-spacing: var(--letter-spacing);
		font-size: var(--font-size);
	}

	:global(input[type="checkbox"]) {
		accent-color: var(--color-accent);
		/* margin: 0; */
	}
</style>
