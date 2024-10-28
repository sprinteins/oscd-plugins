<script>
    import Button, {Label} from "@smui/button"
    import {IconWrapper} from "@oscd-plugins/ui"
    import TextElement from "../elements/text-element/text-element.svelte";
    import ElementWrapper from "../element-wrapper/element-wrapper.svelte"

    let isElementsChoiceVisible = false


</script>




<div class="template-builder">
    <div class="card">

        <div class="elements-list">
            <ElementWrapper>
                <TextElement/>
            </ElementWrapper>
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
                    <Button variant="outlined">Text</Button>
                    <Button variant="outlined">Image</Button>
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



