<script lang="ts">

    interface Props {
        name?: string;
        children?: import('svelte').Snippet;
    }

    let { name = "", children }: Props = $props();
</script>


<example>
    <div>
        <h3>{name}</h3>
    </div>
    {@render children?.()}
</example>


<style>
    example {
        display: block;
        margin-bottom: 3rem;
        position: relative;
        width: 100%;
        max-height: 100vh;
        overflow: hidden;
    }
    h3 {
        margin-bottom: 1rem;
    }
</style>
