<script lang="ts" context="module">

    export type Template = {
        name: string,
        description: string,
        lastEdited: Date,       
    }
</script>

<script lang="ts">
    import {Table} from '@/components'

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
    ]    
</script>

<main class="tamplate-overview">
    <header class="template-controls">
        <button class="btn-pill btn-pill-primary"> + Add template</button>
        <button class="btn-pill btn-pill-outlined">Export Documents</button>
        <button class="btn-pill btn-pill-outlined">Filter</button>
    </header>

    <Table allTemplates={allTemplates}/>

</main>


<style lang="scss">

    $clr-purple: #6C71C3;
    $clr-purple-15: #494fbf;

    .tamplate-overview{
        padding: 2rem;
    }
    .template-controls{
            margin: 0 0 1rem 1rem;
            .btn-pill{
                padding: 0.5em 1em;
                border-radius: 1em;
                cursor: pointer;
            }

            .btn-pill-outlined{
                background-color: transparent;
                border-color: $clr-purple;
                color: $clr-purple;


                &:hover{
                    background-color: $clr-purple;
                    color: white;
                }
            }

            .btn-pill-primary{
                background-color: $clr-purple;
                color: white;

                &:hover{
                    background-color:$clr-purple-15;
                    color: white;
                }
            }
        }
</style>