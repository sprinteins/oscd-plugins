<script lang="ts">
    import {Table} from '@/components';
    import type {Template} from "./types.template-overview";
    import Button from "@smui/button"


    let allTemplates : Template[] = [
        {
            name: 'Template1',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, asperiores accusamus quis sapiente sequi facilis?',
            lastEdited: new Date("2024-10-15T08:38:00"),
        },
        {
            name: 'Template256',
            description: 'A simple description',
            lastEdited: new Date("2024-10-10T13:24:00")
        },
        {
            name: 'CYK_Template',
            description: 'I have an invalid Date ',
            lastEdited: new Date("foo"),
        },
        {
            name: 'I surely have quite a long title name.',
            description: "Lorem ipsum dolor sit amet consectetur.",
            lastEdited: new Date("2024-10-20T10:55:32"),
        },
        {
            name: 'AUOBHBT Template',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta placeat itaque minus praesentium sequi deleniti voluptatibus dicta!',
            lastEdited: new Date(),
        },
    ];    
</script>

<main class="template-overview">
    <header class="template-controls">
        <Button variant="raised" class="btn-pill btn-pill-primary" > + Add template</Button>
        <Button variant="outlined" class="btn-pill btn-pill-outlined">Export Documents</Button>
    </header>

    <Table allTemplates={allTemplates}/>

</main>


<style lang="scss">

    $clr-purple: #6C71C3;
    $clr-purple-15: #494fbf;

    .template-overview{
        padding: 2rem;
    }
    .template-controls{
        margin: 0 0 1rem 1rem;
        & :global(.btn-pill){
                border-radius: 2em;
                cursor: pointer;
                border-color: $clr-purple;
        }

        & :global(.btn-pill-outlined){
            color: $clr-purple;
            &:hover{
                background-color: $clr-purple;
                color: white;
            }
        }

        & :global(.btn-pill-primary){
            background-color: $clr-purple;
            color: white;

            &:hover{
                background-color:$clr-purple-15;
            }
        }
    }
</style>