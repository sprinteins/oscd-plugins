<script lang="ts">
    import Theme from "../../theme/theme.svelte";

    export let root: Element;

    let htmlRoot: HTMLElement;
</script>

<Theme>
    <plugin-store bind:this={htmlRoot}>
        <p>PluginStore</p>
    </plugin-store>
</Theme>

<style>
    :root,
    :host {
        --header-height: 128px;
    }
    plugin-store {
        height: calc(100vh - var(--header-height));
        display: flex;
        align-items: stretch;
        position: relative;
    }
</style>
