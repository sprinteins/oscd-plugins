<Example name="Type Designer">
	<TypeDesignerPlugin xmlDocument={doc} />
</Example>

<script lang="ts">
import TypeDesignerPlugin from './type-designer-plugin.svelte'
import { xmlStr } from '../../../test-files/simple_v5'
import { Example } from '../../components/internal'

const parser = new DOMParser()
const doc = parser.parseFromString(xmlStr, 'text/xml') as unknown as XMLDocument
</script>
