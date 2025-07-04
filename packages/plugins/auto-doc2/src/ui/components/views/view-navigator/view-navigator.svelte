<script lang='ts'>
import { View } from './view';
import TemplateOverview from '@/ui/components/views/template-overview/template-overview.svelte';

let currentView: View = View.Home
let templateId: number | null = null

function navigate(view: View, id = null): void {
	templateId = id
	currentView = view
}
</script>

{#if currentView === View.Home}
	<TemplateOverview></TemplateOverview>
{:else if currentView === View.Create }
	<div>TODO: Create</div>
{:else}
	<div>TODO: Edit</div>
{/if}
