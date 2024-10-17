<script lang="ts">
    import Card from "@smui/card";
    import type { DataTypeTemplates } from "./data-type-templates";

    export let elementType: DataTypeTemplates[];

    function handleCardClick(item: string) {
        console.log("Clicked:", item);
    }
</script>

<section id="type-designer-card">
    {#each elementType as elementType}
        <Card
            class="card"
            on:click={() => handleCardClick(JSON.stringify(elementType))}
        >
            {elementType.name}
            <div class="rhombus-icon"></div>
        </Card>
    {/each}
</section>

<style>
    #type-designer-card :global(.card) {
        padding: 1rem;
        background-color: #f5f5f5;
        border-radius: 4px;
        margin-bottom: 1rem;
        flex-shrink: 0;
        border: 1px solid #ccc;
        cursor: pointer;
    }
</style>
