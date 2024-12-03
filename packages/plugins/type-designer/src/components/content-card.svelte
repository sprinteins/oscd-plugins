
<script lang="ts">
// SMUI COMPONENTS
import Card from '@smui/card'
// COMPONENTS
import { IconWrapper } from '@oscd-plugins/ui'

//====== INITIALIZATION ======//

// props
export let isRoot: boolean
export let typeName: string
export let isOpen: boolean | undefined = undefined
export let displayArrow = true
export let clickCallback: () => void

// TODO : upcoming feature with a dedicated menu
// function handleCardMenu(event: Event) {
// 	event.preventDefault()
// 	event.stopPropagation()
// 	//menu
// }
</script>

<div id="type-designer-type-element" style={isRoot ? '' : 'width: 80%;'}>
	<Card  class="card" on:click={clickCallback}>
		<div class="card-title">
				{#if isRoot}
					{#if isOpen }
						<IconWrapper icon="keyboard_arrow_down" fillColor="#666" />
					{:else}
						<IconWrapper icon="keyboard_arrow_right" fillColor="#666" class="{displayArrow ? '' : 'card-title__arrow--hidden'}" />
					{/if}
					<IconWrapper icon="nearby" fillColor="primary" />
				{:else}
					<IconWrapper icon="nearby_empty" fillColor="primary" />
				{/if}
			<div class="card-title__name">
				{#if !isRoot}
					<i class="card-title__ref">#Ref</i>
				{/if}
				<span>{typeName}</span>
			</div>
		</div>
		<!-- <CustomIconButton icon="more_vert" color="primary" on:click={handleCardMenu}/> -->
	</Card>
</div>

<style>
#type-designer-type-element :global(.card){
	padding: 1rem;
	border-radius: 4px;
	flex-shrink: 0;
	border: 1px solid #ccc;
	cursor: pointer;
}
.card-title {
	display: flex;
	align-items: center;
}
#type-designer-type-element :global(.card-title__arrow--hidden) {
	opacity: .2;
}
.card-title__name {
	margin-left: 1rem;
	display:flex;
	flex-direction: column;
}
.card-title__ref {
	font-size: 0.8rem;
	color: #666;
}
</style>
