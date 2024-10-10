<TopAppBar
	variant="static"
	color='primary'
>
	<Row>
		<Section>
			<Title>Dev Menu Bar</Title>
		</Section>
		<Section align="end" toolbar>
			<IconButton on:click={handleUpload}>
				<IconWrapper icon="upload_file"/>
				<input type="file" bind:this={fileInput} style="display: none" on:change={handleFileChange} accept=".scd" name="xmlDocument" />
			</IconButton>
			<IconButton on:click={handleDownload}>
				<IconWrapper icon="download"/>
			</IconButton>
		</Section>
	</Row>
</TopAppBar>

<script lang='ts'>
// MUI COMPONENTS
import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar'
import IconButton from '@smui/icon-button';
// COMPONENTS
import { IconWrapper } from '../icons'

//====== INITIALIZATION ======//

let fileInput: HTMLInputElement;

//====== FUNCTIONS ======//

function handleUpload() {
	fileInput.click();
	// const file =
  //     (<HTMLInputElement | null>event.target)?.files?.item(0) ?? false;
  //   if (!file) return;

  //   const text = await file.text();
  //   const docName = file.name;
  //   const doc = new DOMParser().parseFromString(text, 'application/xml');
}

async function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const text = await file.text();
    const docName = file.name;
    const doc = new DOMParser().parseFromString(text, 'application/xml');
    // Process the XML document as needed
}

function handleDownload() {
	// let documentAsString = formatXml(
  //       new XMLSerializer().serializeToString(this.doc)
  //     );

  //     // Add XML declaration/prolog if it's been stripped
  //     // TODO: This can be removed once the improved OpenSCD core edit API is present
  //     documentAsString = documentAsString.startsWith('<?xml')
  //       ? documentAsString
  //       : '<?xml version="1.0" encoding="UTF-8"?>' + '\n' + documentAsString;

  //     const blob = new Blob([documentAsString], {
  //       type: 'application/xml',
  //     });

  //     const a = document.createElement('a');
  //     a.download = this.docName;
  //     a.href = URL.createObjectURL(blob);
  //     a.dataset.downloadurl = ['application/xml', a.download, a.href].join(':');
  //     a.style.display = 'none';
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     setTimeout(function () {
  //       URL.revokeObjectURL(a.href);
  //     }, 5000);
    
}
</script>