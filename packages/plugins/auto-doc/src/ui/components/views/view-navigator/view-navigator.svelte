<script lang='ts'>
import { View, type ViewState } from './view';
import TemplateOverview from '@/ui/components/views/template-overview/template-overview.svelte';
import TemplateCreation from '@/ui/components/views/template-creation/template-creation.svelte';

let viewState = $state<ViewState>({
	view: View.Home,
	templateId: null
});

function navigate(newViewState: Partial<ViewState>): void {
	viewState = {
		...viewState,
		...newViewState
	};
}
</script>

{#if viewState.view === View.Home}
	<TemplateOverview { navigate }></TemplateOverview>
{:else if viewState.view === View.Create }
	<TemplateCreation { navigate } id={viewState.templateId}></TemplateCreation>
{:else}
	<TemplateCreation { navigate } id={viewState.templateId}></TemplateCreation>
{/if}
