<script lang="ts">
import { MOVE_BLOCK_DIRECTION } from '@/constants'
import { CustomIconButton } from '@oscd-plugins/ui/src/components'
import { createEventDispatcher } from 'svelte'

//Prop
export let elementId: string

const dispatch = createEventDispatcher()

function duplicateBlockElement() {
	dispatch('elementDuplicate', { elementId })
}

function moveBlockElement(direction: number) {
	dispatch('elementMove', { elementId, direction })
}

function deleteBlockElement() {
	dispatch('elementDelete', { elementId })
}
</script>



<div class="element-wrapper">
    <div class="action-btns">
        <CustomIconButton icon="content_copy" color="black" size="small" on:click={duplicateBlockElement}/>
        <CustomIconButton icon="delete" color="black" size="small" on:click={deleteBlockElement}/>
        <CustomIconButton icon="arrow_upward" color="black" size="small" on:click={() => moveBlockElement(MOVE_BLOCK_DIRECTION.UP)}/>
        <CustomIconButton icon="arrow_downward" color="black" size="small" on:click={() => moveBlockElement(MOVE_BLOCK_DIRECTION.DOWN)}/>
    </div>
    <slot/>
</div>


<style lang="scss">

    .element-wrapper{
        border-left: 10px solid transparent;
        padding: 0 0 .5rem 1rem;

        &:hover{
            border-color: var(--mdc-theme-secondary);
            transition: .25s all ease;
            background-color: #f5f5f5;


            .action-btns{
                visibility: visible;
                transition: .25s all ease;

            }
        }


    }

    .action-btns{
        display: flex;
        justify-content: flex-end;
        visibility: hidden;
    }

</style>