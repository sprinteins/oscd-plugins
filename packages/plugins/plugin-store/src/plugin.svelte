<svelte:options tag={null} />

<script lang="ts">
import { PluginStore } from '@oscd-plugins/uilib/src/lib/plugins/plugin-store'
import * as pckg from '../package.json'

let isOpen = false

export async function run() {
	isOpen = true
}
</script>

<PluginStore bind:isOpen={isOpen}/> 

<input type="hidden" name="package-name" value={pckg.name} />
<input type="hidden" name="package-version" value={pckg.version} />
