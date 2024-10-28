<script>
    import {CustomIconButton} from "@oscd-plugins/ui/src/components"

</script>



<div class="element-wrapper">
    <div class="action-btns">
        <CustomIconButton icon="content_copy" color="black" size="small"/>
        <CustomIconButton icon="delete" color="black" size="small"/>
        <CustomIconButton icon="arrow_upward" color="black" size="small"/>
        <CustomIconButton icon="arrow_downward" color="black" size="small"/>
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