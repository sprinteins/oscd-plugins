<script lang="ts">
    import Button, {Label} from "@smui/button"
    import {IconWrapper} from "@oscd-plugins/ui"
    import TextElement from "@/components/elements/text-element/text-element.svelte"
    import ImageElement from "@/components/elements/image-element/image-element.svelte"
    import SignalListElement from "@/components/elements/signal-list-element/signal-list-element.svelte"
    import ElementWrapper from "@/components/element-wrapper/element-wrapper.svelte"
    import {docTemplatesStore} from '@/stores'
    import type {BlockElement, ElementType, ElementMap} from '@/components/elements/types.elements'

    // Prop
    export let template: Element


    const allBlocks = Array.from( template.querySelectorAll("Block"))
    
    const mappedBlocks : BlockElement[] = allBlocks.map(block => {
        return {
            id: block.getAttribute("id") as string,
            type: block.getAttribute("type") as ElementType,
            content: block.textContent
        }
    })
    

    


    let isElementsChoiceVisible = false
    let blockElements : BlockElement[] = mappedBlocks
    const componentMap : ElementMap  = {
        "text": TextElement,
        "image": ImageElement,
        "signalList": SignalListElement,
    }


    function addElement(type: ElementType){
        const elementId = docTemplatesStore.addBlockToDocumentTemplate(template, type, blockElements.length)
        
        const newBlockElement: BlockElement = {
            id: elementId,
            type: type,
            content: ""
        }

        blockElements = [...blockElements, newBlockElement]
    }

    function moveBlockElement(event: CustomEvent<{elementId: string, direction: number}>) {
        const {elementId, direction} = event.detail

        const blockElement = blockElements.find((element) => element.id === elementId);
        if(!blockElement) {
            return;
        }

        const index = blockElements.indexOf(blockElement);

        const isFirst = index === 0;
        const isLast = index === blockElements.length;
        if(isFirst && direction === -1 || isLast && direction === 1) {
            return;
        }

        const calculatedPosition = index + direction;
        docTemplatesStore.moveBlockInDocumentTemplate(template, elementId, calculatedPosition);

        blockElements = blockElements.filter((element) => element !== blockElement);
        blockElements.splice(calculatedPosition, 0, blockElement);
    }

    function deleteBlockElement(event: CustomEvent<{elementId: string}>){
        const {elementId} = event.detail
        docTemplatesStore.deleteBlockFromDocumentTemplate(template, elementId);
        blockElements = blockElements.filter(blockElement => blockElement.id !== elementId)
    }


    function handleContentChange(elementId: string, newContent: string){
        docTemplatesStore.editBlockContentOfDocumentTemplate(template, elementId, newContent)
    }
</script>




<div class="template-builder">
    <div class="card">

        <div class="elements-list">
            {#each blockElements as blockElement (blockElement.id)}
                <ElementWrapper elementId={blockElement.id} on:elementDelete={deleteBlockElement} on:elementMove={(direction) => moveBlockElement(direction)}>
                    <svelte:component 
                        this={componentMap[blockElement.type]}
                        content={blockElement.content}
                        onContentChange={(newContent) => handleContentChange(blockElement.id, newContent)}
                    />
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
                    <Button variant="outlined" on:click={()=>{addElement("signalList")}}>Signal List</Button>
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



