<div id="custom-drawer">
	<Drawer variant="dismissible" bind:open={$open}>
		<Header>
			<Title>{ $currentTitle }</Title>
			<Subtitle>{ $currentDescription }</Subtitle>
		</Header>
		<Content>
			{#if $currentInnerComponent}
				<svelte:component this={InnerComponent} {...$currentInnerComponentProps}/>
			{/if}
		</Content>
	</Drawer>
	<AppContent class="app-content" >
		<slot />
	</AppContent>
</div>

<script lang="ts">
// COMPONENTS
import Drawer, {
	AppContent,
	Content,
	Header,
	Title,
	Subtitle
} from '@smui/drawer'
// STORES
import drawerStore from './custom-drawer.store'

//====== INITIALIZATION ====//

//stores
const {
	open,
	currentTitle,
	currentDescription,
	currentInnerComponent,
	currentInnerComponentProps
} = drawerStore

$: InnerComponent = $currentInnerComponent || null
</script>
	
<style>
	#custom-drawer :global(.mdc-drawer--dismissible) {
		left: initial;
  	right: 0;
		border-right-width:0;
  border-left-width:1px;
  border-right-style:none;
  border-left-style:solid
	}

	#custom-drawer :global(.mdc-drawer.mdc-drawer--open:not(.mdc-drawer--closing) + .mdc-drawer-app-content) {
		margin-right: 256px;
		margin-left: 0;
		
	}

	#custom-drawer :global(.mdc-drawer__content) {
		overflow: hidden; /* should be controlled in the inner component */
	}

	#custom-drawer :global(.mdc-drawer--animate) {
		transform:translateX(100%)
	}

	#custom-drawer :global(.mdc-drawer--opening) {
		transform:translateX(0);
		transition-duration:250ms
	}

	#custom-drawer :global(.mdc-drawer--closing) {
		transform:translateX(100%)
	}
	
	#custom-drawer, #custom-drawer :global(.app-content) {
		height:100%;
	}
</style>