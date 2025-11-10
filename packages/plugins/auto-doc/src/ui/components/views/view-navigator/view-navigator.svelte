<script lang='ts'>
import TemplateCreation from '@/ui/components/views/template-creation/template-creation.svelte'
import TemplateOverview from '@/ui/components/views/template-overview/template-overview.svelte'
import { View, type ViewState } from './view'

let viewState = $state<ViewState>({
	view: View.Home,
	templateId: null
})

function navigate(newViewState: Partial<ViewState>): void {
	viewState = {
		...viewState,
		...newViewState
	}
}
</script>

{#if viewState.view === View.Home}
	<TemplateOverview { navigate }></TemplateOverview>
{:else if viewState.view === View.Create }
	<TemplateCreation { navigate } id={viewState.templateId}></TemplateCreation>
{:else}
	<TemplateCreation { navigate } id={viewState.templateId}></TemplateCreation>
{/if}
