<script lang="ts">
    import { onDestroy } from 'svelte';
    import type {TooltipPosition} from "./types.tooltip"

  
    export let text = ''; 
    export let position: TooltipPosition = 'top'; 
    export let delayInMS = 500; 
  
    let isTooltipVisible = false;
    let timeoutId: ReturnType<typeof setTimeout>;
  
    const showTooltip = () => {
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
        on:mouseenter={showTooltip}
        on:mouseleave={hideTooltip}
        role="tooltip"
    >
        <slot></slot>

        {#if isTooltipVisible}
            <div class="tooltip {position} visible">
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
      white-space: nowrap;
      z-index: 10;
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.2s ease, transform 0.2s ease;
      max-width: 500px;
      text-wrap: auto;
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
  
    .tooltip.right {
      left: 100%;
      top: 50%;
      transform: translate(10px, -50%);
    }
  
    .tooltip.visible {
      opacity: 1;
      transform: translateY(0);
    }
  </style>
  

  