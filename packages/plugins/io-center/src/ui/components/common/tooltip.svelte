<script lang="ts">
    import { onDestroy } from "svelte";
    import type { TooltipPosition } from "./types.common";

    type Props = {
        text?: string;
        position?: TooltipPosition;
        isPositionModified?: boolean;
        delayInMS?: number;
    };

    const {
        text = "",
        position = "top",
        isPositionModified = false,
        delayInMS = 500,
    }: Props = $props();

    let isTooltipVisible = $state(false);
    let timeoutId: ReturnType<typeof setTimeout>;

    const showTooltip = () => {
        if (text === "") return;

        timeoutId = setTimeout(() => {
            isTooltipVisible = true;
        }, delayInMS);
    };

    const hideTooltip = () => {
        clearTimeout(timeoutId);
        isTooltipVisible = false;
    };

    onDestroy(() => {
        clearTimeout(timeoutId);
    });
</script>

<div
    class="tooltip-container"
    onmouseenter={showTooltip}
    onmouseleave={hideTooltip}
    role="tooltip"
>
    <slot></slot>

    {#if isTooltipVisible}
        <div
            class={`tooltip ${position} visible ${isPositionModified ? "modified" : ""}`}
        >
            {text}
        </div>
    {/if}
</div>

<style>
    .tooltip-container {
        position: relative;
        display: inline-block;
    }

    .tooltip {
        position: absolute;
        padding: 0.5em 1em;
        background-color: #333;
        color: white;
        font-size: 0.875rem;
        border-radius: 4px;
        z-index: 10;
        opacity: 0;
        transform: translateY(10px);
        transition:
            opacity 0.2s ease,
            transform 0.2s ease;
        max-width: 300px;
        width: max-content;
        text-wrap: wrap;
        word-break: break-word;
        z-index: 5000 !important;
    }

    .tooltip.top {
        bottom: 100%;
        left: 50%;
        transform: translate(-50%, -10px);
    }

    .tooltip.bottom {
        top: 100%;
        left: 50%;
        transform: translate(-50%, 10px);
    }

    .tooltip.left {
        right: 100%;
        top: 50%;
        transform: translate(-10px, -50%);
    }

    .tooltip.left.modified {
        top: 30%;
        transform: translate(0px, 0%);
    }

    .tooltip.right {
        left: 100%;
        top: 50%;
        transform: translate(10px, -50%);
    }

    .tooltip.right.modified {
        top: 30%;
        transform: translate(0px, 0%);
    }

    .tooltip.visible {
        opacity: 1;
        transform: translateY(0);
    }
</style>
