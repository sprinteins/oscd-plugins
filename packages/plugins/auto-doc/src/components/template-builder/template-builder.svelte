<script lang="ts">
    import Button, {Label} from "@smui/button"
    import {IconWrapper} from "@oscd-plugins/ui"
    import TextElement from "../elements/text-element/text-element.svelte"
    import ImageElement from "../elements/image-element/image-element.svelte"
    import ElementWrapper from "../element-wrapper/element-wrapper.svelte"
    import {docTemplatesStore} from '@/stores'
    import type {BlockElement, ElementType} from '@/components/elements/types.elements'

    // Prop
    export let templateId: string


    let isElementsChoiceVisible = false
    let blockElements : BlockElement[] = []
    const template = docTemplatesStore.getDocumentTemplate(templateId) as Element;
    const componentMap  = {
        "text": TextElement,
        "image": ImageElement
    }


    function addElement(type: ElementType){
        const elementId = docTemplatesStore.addBlockToDocumentTemplate(template, "", type, blockElements.length)
        
        const newBlockElement: BlockElement = {
            id: elementId,
            type: type,
        }

        blockElements = [...blockElements, newBlockElement]
    }

    function deleteBlockElement(event: CustomEvent<{elementId: string}>){
        const {elementId} = event.detail
        docTemplatesStore.deleteBlockFromDocumentTemplate(template, elementId);
        blockElements = blockElements.filter(blockElement => blockElement.id !== elementId)
    }

</script>




<div class="template-builder">
    <div class="card">

        <div class="elements-list">
            {#each blockElements as blockElement (blockElement.id)}
                <ElementWrapper elementId={blockElement.id} on:elementDelete={deleteBlockElement}>
                    <svelte:component this={componentMap[blockElement.type]}/>
                </ElementWrapper>
            {/each}
        </div>

        <footer >
            <Button on:click={()=> isElementsChoiceVisible = !isElementsChoiceVisible}>
                <IconWrapper icon="add" fillColor="#2aa198"/>
                <Label>
                    add element 
                </Label> 
            </Button>
            <div class="elements-container">
                {#if isElementsChoiceVisible}
                    <Button variant="outlined" on:click={()=>{addElement('text')}}>Text</Button>
                    <Button variant="outlined" on:click={()=>{addElement("image")}}>Image</Button>
                {/if}
            </div>
        </footer>
    </div>
</div>



<style>

    .template-builder{
        width: 70%;
    }
    .card{
        background-color: white;
        min-height: 50vh;
        overflow-y: auto;
        border-radius: .5rem;
        padding: 1.5rem;
    }

    .elements-list{
        display: flex;
        flex-direction: column;
    }

    footer{
        margin-top: 2rem;
    }

    .elements-container{
        margin-top: 2rem;
        display: flex;
        gap: 1.5rem;
        flex-wrap: wrap;
    }

  
</style>



