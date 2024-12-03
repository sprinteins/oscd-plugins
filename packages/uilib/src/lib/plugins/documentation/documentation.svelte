<script lang="ts">
import Print from './views/print.svelte'
import { Theme } from '../../theme'
// STORES
import pluginStore from './stores/plugin'
import iedStore from './stores/ied'

export let xmlDocument: XMLDocument
export let editCount: number

//==== REACTIVITY ====//

$: triggerUpdate({
	updateTrigger: editCount,
	newXmlDocument: xmlDocument
})
//====== FUNCTIONS =====//

async function triggerUpdate({
	updateTrigger, // is not used but should be passed to the function to trigger reactivity
	newXmlDocument
}: {
	updateTrigger: number
	newXmlDocument: XMLDocument | undefined
}) {
	pluginStore.init(newXmlDocument)
	iedStore.init(newXmlDocument)
}
</script>

<Theme>
	<documentation>
		<Print />
	</documentation>
</Theme>
