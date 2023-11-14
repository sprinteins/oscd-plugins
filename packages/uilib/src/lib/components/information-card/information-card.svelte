<script>
    import { createEventDispatcher } from "svelte"
    import Button from "../button/button.svelte"

    const dispatch = createEventDispatcher()
    function handleButtonClick() {
    	dispatch("buttonClick")
    }
</script>

<div class="card">
    <h2><slot name="header" /></h2>
    <p><slot name="description" /></p>
    <div class="button-right">
        <Button on:click={handleButtonClick}><slot name="button-text" /></Button
        >
    </div>
</div>

<style lang="scss">
    .card {
        background-color: #fcf6e5;
        padding: 0.8rem 1.3rem;
        max-width: 50ch;
        .button-right {
            margin-top: 1rem;
            text-align: right;
        }
    }
</style>
