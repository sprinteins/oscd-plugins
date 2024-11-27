<script lang="ts">
// COMPONENTS
import InformationCard from '../../../components/information-card/information-card.svelte'
import Telemetry from '../components/telemetry.svelte'
import SCDElementList from '../components/scd-elements-list/scd-elements-list.svelte'
// UTILS
import { getElementInsideNestedShadowDom } from '@oscd-plugins/core'
// STORES
import printStore from '../stores/print'

//====== INITIALIZATION ======//

let printContainer: HTMLIFrameElement

// stores
const { printableElements, PRINTABLE_INIT_CONSTANT } = printStore

//====== REACTIVITY ======//

$: currentPluginElement = getElementInsideNestedShadowDom()

//====== FUNCTIONS ======//

function printContent(content: string) {
	const iframeDoc = printContainer.contentWindow.document
	iframeDoc.open()
	iframeDoc.write(content)
	iframeDoc.close()
	printContainer.contentWindow.print()
}

function getPrintableContent(type: keyof typeof PRINTABLE_INIT_CONSTANT) {
	let printableContent: string
	const style =
		currentPluginElement.shadowRoot.querySelector('style').innerText

	if ($printableElements[type].selector)
		printableContent = $printableElements[type].element.querySelector(
			$printableElements[type].selector
		)?.outerHTML
	else printableContent = $printableElements[type].element.innerHTML

	const additionalStyle = `
        <style>
            @page {
                size: A4;
                margin: 2rem;
            }
            body {
                margin: 2rem;
                padding: 0;
                width: 210mm;
                height: 297mm;
								${$printableElements[type].selector === 'svg' ? 'display: flex;' : ''}               
            }
            svg {
                max-width: 100%;
                max-height: 100%;
            }
        </style>
    `

	return `<!DOCTYPE html>
	    <html>
	      <head>
	        <style>${style}</style>
					${additionalStyle}
	      </head>
	      <body>${printableContent}</body>
	    </html>
	  `
}

function handlePrint(type: keyof typeof PRINTABLE_INIT_CONSTANT) {
	// conditional rendering + binding is not supported by svelte 3,
	// this has to be tested when migrated to svelte 5
	// + dynamically mounting the component directly
	printStore.selectCurrentPrintableElement(type)

	const printableContent = getPrintableContent(type)
	printContent(printableContent)
}
</script>

<iframe bind:this={printContainer} class="hide" title="Print Container" />


<div class="cards-wrapper">
	<div class="hide" bind:this={$printableElements.telemetry.element}>
			<Telemetry />
	</div>
	<InformationCard on:buttonClick={() => handlePrint("telemetry")}>
		<span slot="header">Communication Explorer</span>
		<span slot="description"
			>Downloading the Communication Explorer including an overview about the
			whole network</span
		>
		<span slot="button-text">Download</span>
	</InformationCard>

	<div class="hide" bind:this={$printableElements.documentation.element}>
		<SCDElementList />
</div>
	<InformationCard
		on:buttonClick={() => handlePrint("documentation")}
	>
		<span slot="header">Documentation</span>
		<span slot="description"
			>Copy Download the Documentation including a list with all busses, bays,
			Intelligent Electronic Device IEDs, Logical Nodes (LNs), Data Attributes
			(DAs), Data Objects (DOs) and Enumerations (ENUMs).</span
		>
		<span slot="button-text">Download</span>
	</InformationCard>
</div>
	
<style>
	.hide {
		display: none;
	}
	.cards-wrapper{
		margin: 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
	