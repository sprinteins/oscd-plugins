<script lang="ts">
    import { openSCDIcons, type OpenSCDIconNames } from "./"

    type IconSizes = "small" | "normal" | "rect" | "big";

    export let name: OpenSCDIconNames
    export let size: IconSizes

    $: icon = openSCDIcons[name] ?? ""
</script>

<div
    class="icon-size icon-size-{size}"
    class:icon-size-small={size === "small"}
    class:icon-size-normal={size === "normal"}
>
    {@html icon}
</div>

<style lang="scss">
    .icon-size-small {
        $size: 1rem;
        height: $size;
        width: $size;
    }

    .icon-size-normal {
        $size: 24px;
        height: $size;
        width: $size;
        :global(svg) {
            height: 26.5px;
            width: 24px;
        }
    }

    div.icon-size-normal {
        $size: 24px;
        height: $size;
        width: $size;
        :global(svg) {
            height: $size;
            width: $size;
        }
    }

    div.icon-size-rect {
        $size: 24px;
        height: $size;
        width: $size;
        :global(svg) {
            height: 26.5px;
            width: 24px;
        }
    }
    div.icon-size-big {
        $size: 40px;
        height: 32px;
        width: $size;
        :global(svg) {
            height: 32px;
            width: $size;
        }
    }

    /* TODO: remove if not needed */
    /* svg {
        $size: 24px;
        height: $size;
        width: $size;
    } */
</style>
