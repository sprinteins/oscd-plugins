<script>
    import Button, {Label} from "@smui/button"

    let isElementsChoiceVisible = false

    import {IconWrapper} from "@oscd-plugins/ui"

</script>




<div class="template-builder">
    <div class="card">

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
        width: 60%;
    }
    .card{
        background-color: white;
        min-height: 50vh;
        overflow-y: auto;
        border-radius: .5rem;
        padding: 1.5rem;
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



