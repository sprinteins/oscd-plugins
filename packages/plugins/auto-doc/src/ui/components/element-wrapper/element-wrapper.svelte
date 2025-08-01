<script lang="ts">
    import {CustomIconButton} from "@oscd-plugins/ui/src/components"
    import {MOVE_BLOCK_DIRECTION} from "@/constants"

    
    interface Props {
        //Prop
        elementId: string;
        children?: import('svelte').Snippet;
        duplicateBlock(elementId: string): void,
        moveBlock(elementId: string, direction: number): void,
        deleteBlock(elementId: string): void
    }

    let { elementId, children, duplicateBlock, moveBlock, deleteBlock }: Props = $props();

    function duplicateBlockElement(){
        duplicateBlock(elementId);
    }

    function moveBlockElement(direction: number) {
        moveBlock(elementId, direction);
    }

    function deleteBlockElement(){
        deleteBlock(elementId);
    }

</script>



<div class="element-wrapper">
    <div class="action-btns">
        <CustomIconButton icon="content_copy" color="black" size="small" onclick={duplicateBlockElement}/>
        <CustomIconButton icon="delete" color="black" size="small" onclick={deleteBlockElement}/>
        <CustomIconButton icon="arrow_upward" color="black" size="small" onclick={() => moveBlockElement(MOVE_BLOCK_DIRECTION.UP)}/>
        <CustomIconButton icon="arrow_downward" color="black" size="small" onclick={() => moveBlockElement(MOVE_BLOCK_DIRECTION.DOWN)}/>
    </div>
    {@render children?.()}
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