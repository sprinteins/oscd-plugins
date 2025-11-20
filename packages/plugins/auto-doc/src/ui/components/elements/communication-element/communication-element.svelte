<script lang="ts">
import TelemetryView from '@oscd-plugins/communication-explorer/src/ui/components/telemetry-view/telemetry-view.svelte'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { LegacyTheme } from '@oscd-plugins/ui'
import NoXmlWarning from '../../no-xml-warning/no-xml-warning.svelte';

interface Props {
	onContentChange: (newContent: string) => void
	content?: string
}

let { onContentChange, content = '' }: Props = $props()
</script>

{#if pluginGlobalStore.xmlDocument}
    <div class="communication-element">
        <LegacyTheme>
            <TelemetryView root={pluginGlobalStore.xmlDocument} showSidebar={false} />
        </LegacyTheme>
    </div>
{:else}
    <NoXmlWarning />
{/if}

<style>
    .communication-element {
        border: 1px solid #ccc;
    }
</style>