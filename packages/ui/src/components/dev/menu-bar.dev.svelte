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
			<IconButton on:click={handleUpload} style="margin-right: .5rem;">
				<IconWrapper icon="upload_file"/>
				<input type="file" bind:this={fileInput} style="display: none" on:change={handleFileChange} accept=".scd" name="xmlDocument" />
			</IconButton>
			<IconButton on:click={handleDownload}>
				<IconWrapper icon="download"/>
			</IconButton>
			{/if}
		</Section>
	</Row>
</TopAppBar>

<script lang='ts'>
// CORE
import { newOpenDocEvent } from '@oscd-plugins/core'
// MUI COMPONENTS
import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar'
import IconButton from '@smui/icon-button'
// COMPONENTS
import { IconWrapper } from '../icons'
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