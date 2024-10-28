<TopAppBar
	variant="static"
	color='primary'
>
	<Row>
		<Section>
			<Title>Dev Menu Bar</Title>
		</Section>
		<Section align="end" toolbar>
			{#if pluginType && pluginType === 'editor'}
				<div class="editor-buttons">
					<CustomIconButton icon="upload_file" color="white" on:click={handleUpload}/>
					<input type="file" bind:this={fileInput} style="display: none" on:change={handleFileChange} accept=".scd" name="xmlDocument" />
					<CustomIconButton icon="download" color="white" on:click={handleDownload}/>
				</div>
			{/if}
		</Section>
	</Row>
</TopAppBar>

<script lang='ts'>
// CORE
import { newOpenDocEvent } from '@oscd-plugins/core'
// MUI COMPONENTS
import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar'
// COMPONENTS
import { CustomIconButton } from '..'
// TYPES
import type { PluginType } from '@oscd-plugins/core'

//====== INITIALIZATION ======//

// props
export let pluginType: PluginType | undefined = undefined

// local variables
let fileInput: HTMLInputElement

//====== FUNCTIONS ======//

function handleUpload() {
	fileInput.click()
}

async function handleFileChange(event: Event) {
	const input = event.target as HTMLInputElement
	const file = input.files?.[0]
	if (!file) return

	const text = await file.text()
	const docName = file.name
	const doc = new DOMParser().parseFromString(text, 'application/xml')

	document.dispatchEvent(newOpenDocEvent(doc, docName))
}

function handleDownload() {
	document.dispatchEvent(new Event('save-doc'))
}
</script>

<style>
	.editor-buttons {
		display: flex;
		gap: .5rem;
	}
</style>