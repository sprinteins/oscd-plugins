<script lang="ts">
// SMUI COMPONENTS
import Card from '@smui/card'
// TYPES
import type { BaseElementStandardAttributes } from '@oscd-plugins/core'
//====== INITIALIZATION ======//

// props
export let name: string
export let elementType: BaseElementStandardAttributes

//====== FUNCTIONS ======//

function handleCardClick(elementType: BaseElementStandardAttributes) {
	console.log('Clicked:', elementType)
}
</script>

<section id="type-designer-card">
    <Card class="card" on:click={() => handleCardClick(elementType)}>
        {name}
        <div class="rhombus-icon"></div>
    </Card>
</section>

<style>
    #type-designer-card :global(.card) {
        padding: 1rem;
        border-radius: 4px;
        margin-bottom: 1rem;
        flex-shrink: 0;
        border: 1px solid #ccc;
        cursor: pointer;
    }
		
		.rhombus-icon {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 8px;
    height: 8px;
    background-color: rgb(81, 159, 152);
    transform: rotate(45deg);
  }
</style>
