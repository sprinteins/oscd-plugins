<script>

    export let name = ""
</script>


<example>
    <div>
        <h3>{name}</h3>
    </div>
    <slot />
</example>


<style>
    example {
        display: block;
        margin-bottom: 3rem;
        position: relative;
        width: 100%;
    }
    h3 {
        margin-bottom: 1rem;
    }
</style>
