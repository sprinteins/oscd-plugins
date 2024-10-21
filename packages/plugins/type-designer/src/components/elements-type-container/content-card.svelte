<script lang="ts">
    import Card from "@smui/card";
    import type { DataTypeTemplates } from "./data-type-templates";

    export let elementType: DataTypeTemplates[];

    function handleCardClick(item: DataTypeTemplates) {
        console.log("Clicked:", item);
    }
</script>

<section id="type-designer-card">
    <Card class="card" on:click={() => handleCardClick(elementType)}>
        {elementType.name}
        <div class="rhombus-icon"></div>
    </Card>
</section>

<style>
    #type-designer-card :global(.card) {
        padding: 1rem;
        border-radius: 4px;
        margin-bottom: 1rem;
        flex-shrink: 0;
        border: 1px solid #ccc;
        cursor: pointer;
    }
</style>
