<TopAppBar
      variant="static"
      color='primary'
    >
<Row>
	<Section align="end" toolbar>
	<!-- <VisuallyHiddenInput
		type="file"
		onChange={(event) => console.log(event.target.files)}
		multiple
	/> -->
	<!-- <VisuallyHiddenInput
		type="file"
		onChange={(event) => console.log(event.target.files)}
		multiple
	/> -->

		<Button>
			<Label>Upload SCD</Label>
		</Button>
		<Button>
			<Label>Download SCD</Label>
		</Button>
	</Section>
</Row>
		
</TopAppBar>

<style>
	.icon {
		color: fff
	}
</style>

<script lang='ts'>
import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar'
import Button, { Label, Icon } from '@smui/button'
import IconButton from '@smui/icon-button'
import { IconFileDownload, IconFileUpload } from '../../icons'
</script>